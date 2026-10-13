# Birthday Surprise Template

An animated, cinematic birthday website template for creating a personal surprise without starting from scratch.

Created by [Shabbir Showne](https://shabbirshowne.com). Contact: [info@shabbirshowne.com](mailto:info@shabbirshowne.com).

[View repository](https://github.com/shabbirshowne/birthday-surprise-template) · [Use this template](https://github.com/new?template_name=birthday-surprise-template&template_owner=shabbirshowne) · [Download latest source](https://github.com/shabbirshowne/birthday-surprise-template/archive/refs/heads/main.zip)

Live demo: [shabbirshowne.github.io/birthday-surprise-template](https://shabbirshowne.github.io/birthday-surprise-template/)

## Preview

| Cinematic story | Interactive cake |
| --- | --- |
| ![Cinematic birthday story preview](docs/assets/story-preview.png) | ![Interactive birthday cake preview](docs/assets/cake-preview.png) |

## Features

- Animated opening, memories, letter, cake, wish, mystery gift, and finale
- Sixteen-photo seamless marquee using fictional demo images
- Responsive layouts and reduced-motion support
- Browser-generated sound effects with a mute control
- Wishes stay only in the visitor's browser; this template sends no visitor data
- Search-engine `noindex` metadata included for private surprise deployments

## Quick start

```bash
npm install
npm run dev
```

Edit `src/config.ts` first. Replace the images in `public/demo`, keeping the same filenames, or update their paths in the config. Follow the complete [beginner customization tutorial](docs/TUTORIAL.md). Then run:

```bash
npm run build
```

Upload everything inside `dist` to your hosting document root. See [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) and the platform-neutral [deployment guide](docs/DEPLOYMENT.md).

## GitHub template setup

The canonical repository name is `birthday-surprise-template` and its permanent address is:

`https://github.com/shabbirshowne/birthday-surprise-template`

Create that public repository, upload this folder, then open **Settings** and enable **Template repository**. Visitors can use **Use this template** to create their own copy. The reusable, account-neutral instructions are in [docs/GITHUB_UPLOAD.md](docs/GITHUB_UPLOAD.md).

## Live preview with GitHub Pages

An automatic deployment workflow is included. After uploading it, open **Settings → Pages**, set **Source** to **GitHub Actions**, and run the **Deploy website preview** workflow from the Actions tab. The public demo will appear at the live-demo link above.

## Privacy

This source contains no analytics, camera access, location collection, IP logging, or remote wish-storage endpoint. Do not add covert tracking. If you add analytics or form storage, clearly disclose it and obtain appropriate consent.

## License

MIT. You may use, modify, and redistribute the code while preserving the copyright and license notice. Please retain `NOTICE`, `src/creator.ts`, and the visible creator credit so people can find the original project. Demo artwork is included as part of this repository under the same license.

Copyright © 2026 Shabbir Showne.
