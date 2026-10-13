# Deployment Guide

Build the site before using traditional file hosting:

```bash
npm install
npm run build
```

The deployable files are created in `dist`.

## GitHub Pages

The included `.github/workflows/deploy-pages.yml` workflow builds and deploys the site automatically. In the repository, open **Settings → Pages**, choose **GitHub Actions**, then run **Deploy website preview** from the Actions tab.

## Hostinger or cPanel

Open File Manager, enter the domain or subdomain document root, and upload the contents of `dist`. `index.html` must be directly inside `public_html` or the configured subdomain folder. Enable SSL and test the HTTPS address.

## Netlify

Import the Git repository in Netlify. Use `npm run build` as the build command and `dist` as the publish directory. Alternatively, drag the completed `dist` folder into Netlify Drop.

## Vercel

Import the Git repository in Vercel. It normally detects Vite automatically. Confirm that the build command is `npm run build` and the output directory is `dist`, then deploy.

## Cloudflare Pages

Connect the Git repository in Cloudflare Pages. Set the framework preset to Vite, the build command to `npm run build`, and the output directory to `dist`.

## Other static hosts

Any static host can serve this template. Upload the contents of `dist`, serve `index.html` at the site root, and use HTTPS. No PHP, database, or server runtime is required.

## Privacy reminder

The `noindex` metadata asks search engines not to list the deployed surprise, but it does not create password protection. Anyone with the address can open it. Use your hosting provider's password-protection feature if actual access control is required.

