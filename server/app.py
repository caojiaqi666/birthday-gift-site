"""生日纪念页 · 内容后台 API(Flask)。nginx 把 /<前缀>/api/ 反代到这里(去掉前缀),静态页与上传文件由 nginx 直接出。
环境变量:DATA_DIR(content.json + uploads/)、BACKUP_DIR、ADMIN_HASH(pbkdf2:sha256:...,werkzeug 格式)、SECRET_KEY、COOKIE_PATH。
"""
import hashlib, io, json, os, re, time, threading
from flask import Flask, jsonify, request, session, abort
from werkzeug.security import check_password_hash
from PIL import Image, ImageOps

DATA = os.environ.get('DATA_DIR', '/var/lib/gift'); BACKUP = os.environ.get('BACKUP_DIR', '/var/backups/gift')
UP = os.path.join(DATA, 'uploads'); CONTENT = os.path.join(DATA, 'content.json')
for d in (DATA, UP, BACKUP): os.makedirs(d, exist_ok=True)
app = Flask(__name__)
app.secret_key = os.environ['SECRET_KEY']
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SECURE=os.environ.get('COOKIE_SECURE', '1') == '1', SESSION_COOKIE_SAMESITE='Strict',
                  SESSION_COOKIE_PATH=os.environ.get('COOKIE_PATH', '/'), PERMANENT_SESSION_LIFETIME=30 * 86400, MAX_CONTENT_LENGTH=25 * 1024 * 1024)
LOCK = threading.Lock(); FAILS = {}

def authed():
    if not session.get('admin'): abort(401)

def read_content():
    try:
        with open(CONTENT, encoding='utf-8') as f: return json.load(f)
    except FileNotFoundError: return {}

@app.get('/api/content')
def get_content():
    r = jsonify(read_content()); r.headers['Cache-Control'] = 'no-store'; return r

@app.post('/api/login')
def login():
    ip = request.headers.get('X-Real-IP', request.remote_addr); now = time.time()
    hits = [t for t in FAILS.get(ip, []) if now - t < 600]
    if len(hits) >= 8: return jsonify(ok=False, error='尝试太多次,请 10 分钟后再试'), 429
    pw = (request.get_json(silent=True) or {}).get('password', '')
    if not check_password_hash(os.environ['ADMIN_HASH'], pw):
        FAILS[ip] = hits + [now]; return jsonify(ok=False, error='口令不对'), 403
    FAILS.pop(ip, None); session.permanent = True; session['admin'] = True; return jsonify(ok=True)

@app.post('/api/logout')
def logout(): session.clear(); return jsonify(ok=True)

@app.get('/api/me')
def me(): return jsonify(admin=bool(session.get('admin')))

def backup(tag):
    if not os.path.exists(CONTENT): return
    name = time.strftime('content-%Y%m%d-%H%M%S') + f'-{tag}.json'
    with open(CONTENT, 'rb') as a, open(os.path.join(BACKUP, name), 'wb') as b: b.write(a.read())
    files = sorted(f for f in os.listdir(BACKUP) if f.startswith('content-'))
    for f in files[:-200]: os.remove(os.path.join(BACKUP, f))   # 最多留 200 份

@app.put('/api/content')
def put_content():
    authed(); body = request.get_data()
    if len(body) > 2_000_000: return jsonify(ok=False, error='内容太大'), 413
    try: data = json.loads(body)
    except ValueError: return jsonify(ok=False, error='格式错误'), 400
    if not isinstance(data, dict): return jsonify(ok=False, error='格式错误'), 400
    data['savedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S%z')
    with LOCK:
        backup('before-save'); tmp = CONTENT + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=1)
        os.replace(tmp, CONTENT)
    return jsonify(ok=True, savedAt=data['savedAt'])

@app.post('/api/upload')
def upload():
    authed(); f = request.files.get('file')
    if not f: return jsonify(ok=False, error='没有文件'), 400
    raw = f.read(); h = hashlib.sha256(raw).hexdigest()[:16]; name = (f.filename or '').lower()
    if re.search(r'\.(mp3|m4a|aac|ogg|wav)$', name) or (f.mimetype or '').startswith('audio/'):
        if len(raw) > 20 * 1024 * 1024: return jsonify(ok=False, error='音乐文件太大(上限 20MB)'), 413
        ext = re.search(r'\.(mp3|m4a|aac|ogg|wav)$', name); out = f'{h}.{ext.group(1) if ext else "mp3"}'
        with open(os.path.join(UP, out), 'wb') as w: w.write(raw)
        return jsonify(ok=True, url=f'./uploads/{out}')
    try:
        im = Image.open(io.BytesIO(raw)); im = ImageOps.exif_transpose(im)   # 手机照片自动转正
    except Exception: return jsonify(ok=False, error='不是图片'), 400
    im.thumbnail((2000, 2000)); alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    out = f'{h}.png' if alpha else f'{h}.jpg'
    if alpha: im.save(os.path.join(UP, out), optimize=True)
    else: im.convert('RGB').save(os.path.join(UP, out), quality=86, optimize=True, progressive=True)
    return jsonify(ok=True, url=f'./uploads/{out}', w=im.width, h=im.height)

@app.get('/api/backups')
def backups():
    authed(); fs = sorted((f for f in os.listdir(BACKUP) if f.startswith('content-')), reverse=True)[:60]
    return jsonify(items=fs)

@app.post('/api/restore')
def restore():
    authed(); name = (request.get_json(silent=True) or {}).get('name', '')
    if not re.fullmatch(r'content-[\w-]+\.json', name): abort(400)
    p = os.path.join(BACKUP, name)
    if not os.path.exists(p): abort(404)
    with LOCK:
        backup('before-restore')
        with open(p, 'rb') as a, open(CONTENT + '.tmp', 'wb') as b: b.write(a.read())
        os.replace(CONTENT + '.tmp', CONTENT)
    return jsonify(ok=True)

application = app
