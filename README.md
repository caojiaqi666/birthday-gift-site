# 生日纪念网页 + 简易后台

一个可完全后台配置的生日惊喜网页：开门页 → 心意 → 封面 → 认识天数 → 气球心里话 → 朋友圈式回忆 → 照片墙 → 情书 → 许愿蛋糕 → 玫瑰终章（各页可排序/开关）。

- 前端：Vite + React + TypeScript，基于 [shabbirshowne/birthday-surprise-template](https://github.com/shabbirshowne/birthday-surprise-template)（MIT，页面保留作者署名），已中文化并改成运行时 `content.json` 驱动。
- 后台：`/admin/`，所有文字、图片、音乐、主题色、页面顺序都能改，带预览和历史版本。
- 后端：Flask（`server/app.py`）。

部署与本地运行见 [DEPLOY.md](DEPLOY.md)。仓库内默认内容均为示例数据。
