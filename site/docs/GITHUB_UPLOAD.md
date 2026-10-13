# Upload to GitHub

These instructions work for any GitHub account and any repository name.

## Upload through the GitHub website

1. Sign in to GitHub.
2. Select the plus button in the upper-right corner, then select **New repository**.
3. Enter a repository name, such as `birthday-surprise-template`.
4. Add the description: `An animated and customizable birthday surprise website template.`
5. Choose **Public**.
6. Do not add another README, `.gitignore`, or license because they are already included here.
7. Select **Create repository**.
8. On the empty repository page, choose **uploading an existing file**.
9. Extract the supplied GitHub ZIP on your computer.
10. Drag all extracted files and folders into GitHub. Upload the contents, not the outer folder.
11. Enter `Initial release of Birthday Surprise Template` as the commit message.
12. Select **Commit changes**.
13. Open **Settings**, find **Template repository**, and enable it.
14. Open the repository's **About** settings and add your deployed demo address as the website.

## Enable the website preview

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open the **Actions** tab.
4. Select **Deploy website preview**.
5. Select **Run workflow**, keep `main` selected, and run it.
6. Wait for the workflow to show a green check.
7. Open the Pages address shown at the top of **Settings → Pages**.

Future commits to `main` will update this preview automatically.

GitHub shows the final repository, download, issue, template, and Pages links automatically. The Pages link works after the deployment workflow succeeds. The **Use this template** button appears after **Template repository** is enabled.

## Recommended repository topics

Add these topics in the repository's About section:

`birthday`, `birthday-website`, `react`, `vite`, `typescript`, `animation`, `surprise`, `template`
