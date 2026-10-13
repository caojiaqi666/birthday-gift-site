# Publish on Hostinger

1. Run `npm install` and `npm run build` locally.
2. In Hostinger hPanel, open File Manager for the chosen domain or subdomain.
3. Open its document root, normally `public_html` or the subdomain folder.
4. Upload the contents of `dist`, not the `dist` folder itself.
5. Confirm `index.html` is directly inside the document root.
6. Enable SSL and test the HTTPS address in a private browser window and on a phone.

When updating, build again and replace the deployed files. Keep the editable source outside `public_html`.

