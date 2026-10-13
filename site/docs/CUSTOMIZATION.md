# Customization

1. Open `src/config.ts` and replace the recipient, sender, age, relationship length, cities, opening copy, and letter.
2. Replace `public/demo/portrait-1.png` through `portrait-4.png`, or add your own files and update `galleryImages` and `memoryImages`.
3. The included transparent cake is ready for general use. Advanced users may replace `public/birthday-cake-transparent.png` with another transparent PNG.
4. Preview every stage on desktop and mobile with `npm run dev`.
5. Run `npm run build` before publishing.

Use compressed WebP or AVIF photos where possible. Never commit private photos to a public repository; keep a private customized copy for real recipients.

The included `noindex` metadata asks search engines not to list a deployment, but it is not access control. Anyone with the URL can still open it.
