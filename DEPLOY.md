# 部署说明

- 前端 `site/`：基于 [shabbirshowne/birthday-surprise-template](https://github.com/shabbirshowne/birthday-surprise-template)（MIT，保留作者署名）。全部文字、图片、主题色、页面顺序都由运行时 `content.json` 驱动（`src/content.tsx`、`src/default-content.json`）。
- 后台 `site/public/admin/`：原生 JS，按 SCHEMA 生成表单；支持文字、图片/音频上传、主题色、页面顺序/开关、预览、历史版本恢复。
- 后端 `server/app.py`（Flask）：`/api/content` 读写、`/api/upload`（Pillow 纠正方向、最长边 2000px）、`/api/backups` + `/api/restore`、登录（pbkdf2 哈希 + 签名 Cookie）。本地联调用 `server/devserve.py`。

## 本地运行
```bash
cd site && npm install && npx vite build --configLoader runner
python3 -m venv venv && venv/bin/pip install flask pillow gunicorn
venv/bin/python server/devserve.py   # http://127.0.0.1:18799/for-you-1018/
```

## 生产环境（示例）
- 代码放在 `/srv/<app>/releases/rN`，`current` 软链指向当前版本；数据放在 `/var/lib/<app>/{content.json,uploads/}`，每次保存前自动备份。
- 环境变量（不要提交进仓库）：`SECRET_KEY`、`ADMIN_HASH`（`werkzeug.security.generate_password_hash` 生成）、数据目录等，见 `server/app.py` 顶部。
- gunicorn 绑定 127.0.0.1，由 nginx 反代 `/for-you-1018/api/`，`/for-you-1018/` 直接 alias 到 `dist/`（no-cache）。
- 发版：重新 build → 解压到新的 releases/rN → 切换软链 → 重启服务。数据目录保持不动。

> 仓库里的默认内容都是示例数据（虚构的名字、日期、城市；照片来自 Unsplash）。
