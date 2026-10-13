# Beginner Customization Tutorial

This guide assumes you have never edited a React project before.

## What you should edit

Open `src/config.ts`. This is the main customization file. You may change:

- `recipientName`: the birthday person's name
- `senderName`: your name inside the surprise
- `recipientAge`: the age displayed on the cake stage
- `yearsTogether`: the number used in the relationship question
- `distanceLabel`, `senderCity`, and `recipientCity`
- `openingLine` and `openingNote`
- Every paragraph inside `letter`
- `galleryImages` and `memoryImages`

Keep quotation marks, commas, brackets, and file extensions in place. Text must remain between matching quotation marks.

## Replacing photos

The easiest method is to replace:

- `public/demo/portrait-1.png`
- `public/demo/portrait-2.png`
- `public/demo/portrait-3.png`
- `public/demo/portrait-4.png`

Keep the filenames exactly the same. Use portrait-oriented, compressed images. The sixteen-photo reel automatically repeats these four demo paths; advanced users can put sixteen unique paths in `galleryImages`.

The opening stage uses the transparent `public/demo/portrait-cutout.png`. Replace it only with another transparent portrait cutout, keeping the filename unchanged.

Never upload private recipient photos to a public GitHub repository. Make the personalized repository private, or replace photos only in the private deployment copy.

## Replacing the cake

The included `public/birthday-cake-transparent.png` is a reusable transparent cake and does not need to be changed. If you intentionally replace it, use a transparent PNG with the same filename and keep empty space above the cake so the animated flames have room.

## What not to edit

Do not change or remove:

- `LICENSE`
- `NOTICE`
- `src/creator.ts`
- Creator credits rendered by `CreatorCredit`
- The canonical repository link

These identify the original template and help users find updates. The MIT License legally requires the copyright and permission notice to remain in copies or substantial portions. Because the source is public, code cannot technically make attribution impossible to remove; compliance ultimately depends on the person redistributing it.

Do not edit animation components unless you understand React, TypeScript, Motion, GSAP, and responsive CSS. Incorrect JSX punctuation or removed class names can break a stage.

## Previewing your changes

Install Node.js, open a terminal inside the project folder, and run:

```bash
npm install
npm run dev
```

Open the local address printed in the terminal. Test every stage, the mute control, mobile layout, letter, wish, and finale.

## Creating production files

```bash
npm run build
```

The deployable website will be created inside `dist`. Upload the contents of `dist` to your hosting document root.

## Common mistakes

- Uploading the editable source instead of the contents of `dist`
- Deleting a quote or comma in `src/config.ts`
- Using image filenames with different capitalization
- Publishing real photos in a public repository
- Removing the license or original creator attribution
- Expecting `noindex` to work as password protection
