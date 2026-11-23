# jodNET

A small personal start page built with Astro and Starlight, using the lane layout and colours from jodNOTES. Switch between Home, Work, or any profiles you add. Each browser remembers its selected profile in a cookie for one year.

## Run locally

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:4321/jodnet/. To check a production build, run `npm run check`, `npm run build`, then `npm run preview`.

## Edit profiles and links

Edit **[src/data/profiles.json](src/data/profiles.json)** locally or with GitHub's file editor. The “Edit your links” link on the page opens this file. Commit changes to `main` to publish them to every browser.

- `defaultProfile`: the profile ID used for a new browser, or when its remembered profile has been removed.
- `profiles`: displayed in array order. Each profile has a unique lowercase `id`, a `name`, a `description`, and a `lanes` array.
- Each lane has a `title` and a `links` array. Each link has a `title` and an `http://` or `https://` `url`.
- Array order controls lane and link order. Add profiles by copying a profile and changing its ID.
- For local file paths, add `"mode": "copy"` to a lane. Its cards copy the exact `url` value instead of navigating. Escape Windows backslashes in JSON, e.g. `"D:\\Sources"`.

The Home profile contains starter links. The Work profile contains a snapshot of the lanes and links from your existing start page. Replace or extend either profile as needed. All configured profiles and links are included in the static website; profiles organise links and do not provide access control.

Invalid configuration stops the build with a message identifying the field. Empty profiles show a prompt to add links. Search matches link titles, addresses, and lane names within the current profile. Links open in new tabs. Without JavaScript, all profiles remain readable.

The `jodnet-profile` cookie contains only the selected profile ID. It is scoped to the site's base path, uses `SameSite=Lax`, and is marked `Secure` on HTTPS. The preference is specific to each browser; the configuration is shared by everyone using the site.

## Publish with GitHub Pages

The site is configured for **https://jod75lab.github.io/jodnet/**.

1. Push this project to the `main` branch of `jod75lab/jodnet`.
2. In the repository, open **Settings → Pages → Build and deployment**, and choose **GitHub Actions** as the source.
3. The **Deploy to GitHub Pages** workflow checks, builds, and publishes the site on pushes to `main`. If the first run happened before Pages was enabled, rerun it from **Actions**. Pull requests are checked and built without publishing.

For a different address, change `site` and `base` in `astro.config.mjs`, or supply `SITE_URL` and `BASE_PATH` when building. Use `BASE_PATH=/` for a custom domain or a root `username.github.io` repository. Update the GitHub links in `astro.config.mjs` and `src/components/Footer.astro` if you move the repository.

GitHub Pages serves the generated `dist/` folder. No server, database, account, or API key is needed.
