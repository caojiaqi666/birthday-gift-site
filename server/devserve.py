"""本地联调:模拟线上 nginx —— /<前缀>/ 出静态页(dist)和 uploads,/<前缀>/api/ 进 app.py。仅本地测试用。"""
import os, sys
PREFIX = os.environ.get('PREFIX', '/for-you-1018')
os.environ.setdefault('SECRET_KEY', 'dev-only'); os.environ.setdefault('COOKIE_SECURE', '0'); os.environ.setdefault('COOKIE_PATH', PREFIX + '/')
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
from flask import Flask, send_from_directory, redirect
import app as api
DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '../site/dist'))
static = Flask('static')
@static.route('/')
def idx(): return send_from_directory(DIST, 'index.html')
@static.route('/uploads/<path:p>')
def up(p): return send_from_directory(os.path.join(api.DATA, 'uploads'), p)
@static.route('/admin/')
def adm(): return send_from_directory(os.path.join(DIST, 'admin'), 'index.html')
@static.route('/<path:p>')
def st(p): return send_from_directory(DIST, p)
class Split:   # /api/* → api 应用,其余 → 静态
    def __call__(self, environ, start):
        return (api.app if environ.get('PATH_INFO', '').startswith('/api/') else static)(environ, start)
root = Flask('root')
@root.route('/')
def r(): return redirect(PREFIX + '/')
run_simple('127.0.0.1', int(sys.argv[1] if len(sys.argv) > 1 else 18799), DispatcherMiddleware(root, {PREFIX: Split()}), threaded=True)
