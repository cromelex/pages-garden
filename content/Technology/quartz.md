---
publish: true
title: Quartz customisation
created: 2025-01-11
modified: 2025-01-12
---
# Quartz customisation
[Quartz](https://quartz.jzhao.xyz/) ([GitHub](https://github.com/jackyzha0/quartz)) is the *tool* used to create this website.  
I have done a number of modifications to different components of Quartz, in order to better suit my use and my preferences. 
The repo history makes it a bit hard to track all the changes, so I I've decided to add those code snippets here, almost like a changelog.

### Display both modified and created date
11-01-2025 ▪ Each post/note now displays the last update date in addition to the created date, whereas the original code only allowed me to display one of them.

`ContentMeta.tsx`
```tsx
      // Display modified and created date
      if (fileData.dates) {
        segments.push("Last Update: " + fileData.dates.modified.toDateString() + " ▪ ")
        segments.push("Created: " + fileData.dates.created.toDateString() + " ▪ ")
      }
```



### Display alt-text as caption for images 
08-01-2025 ▪ Modified the Obsidian flavoured markdown component to automatically add a caption to any image, using the content of the alt-text.

`ofm.ts`
```ts
                // embed cases
                if (value.startsWith("!")) {
                  const baseExt = path.extname(fp).toLowerCase();
                  const ext = baseExt.split("?")[0]; // Remove query string from the extension
                  const url = slugifyFilePath(fp as FilePath);
                  if ([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".webp"].includes(ext)) {
                    const match = wikilinkImageEmbedRegex.exec(alias ?? "")
                    const alt = match?.groups?.alt ?? ""
                    const width = match?.groups?.width ?? "auto"
                    const height = match?.groups?.height ?? "auto"
                  return {
                    type: "html",
                    value: `<figure>
                              <img src="${url}" alt="${alt}" width="${width}" height="${height}">
                              <figcaption>${alt}</figcaption>
                            </figure>`,
                    }
```

### Make content use up more of the screen for wide-screens
06-01-2025 ▪ While the design of the page is responsive by default, I felt that it didn't use enough of the screen when using large screens (ie, wide-screen and 4K monitors). Made a few changes to make sure it uses more of the screen, where possible.

`variables.scss`
```diff
- templateColumns: "#{$sidePanelWidth} auto #{$sidePanelWidth}",
+ templateColumns: "#{$sidePanelWidth} auto 380",
```

`base.scss`
```diff
-  max-width: calc(#{map-get($breakpoints, desktop)} + 300px);
+  max-width: calc(#{map-get($breakpoints, desktop)} + 750px);  
```

### Link the Explorer title to Home, and change colour
20-12-2024 ▪ Modified the Explorer component in order to show the root/index as "Home" on the navigation bar.

`Explorer.tsx`
```diff
-          <h2>{opts.title ?? i18n(cfg.locale).components.explorer.title}</h2>
+         <a href="/"> <h2 style="color: var(--dark);">{opts.title ?? i18n(cfg.locale).components.explorer.title}</h2></a>
```


### Change footer
20-12-2024 ▪ Removed the link to Quartz (it's mentioned and linked to in [[about#About this site]]).  
Added title, CC-BY license, link and logos.


`Footer.tsx`
```diff
-          {i18n(cfg.locale).components.footer.createdWith}{" "}
-          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
+          Dan's Garden © {year}, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> <img
+		  src="/static/cc.svg"
+          alt="Creative Commons CC Icon"
+          width="20"
+          height="20"
+          style={{
+            verticalAlign: "middle", // Aligns with text baseline
+            display: "inline-block",     // Keeps the icon inline
+          }}
+          />
+          <img
+          src="/static/by.svg"
+          alt="Creative Commons BY Icon"
+          width="20"
+          height="20"
+          style={{
+            verticalAlign: "middle", // Aligns with text baseline
+            display: "inline-block",     // Keeps the icon inline
+          }}
+          />          
```


### Added Reply by Email Component
30-12-2024 ▪ Added a "Reply by Email" button under each note, inspired by [Kev Quirk's blog](https://kevquirk.com/blog/it-s-good-to-talk)

Created`ReplyByEmail.tsx`
```tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ReplyByEmail: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title && title !== "Home" && title !== "About me" && title !== "Contact me") {
    const mailtoLink = `mailto:contact@dansgarden.eu?subject=${encodeURIComponent(title)}`;
    return (
      <div class="center-wrapper">
      <a
      href={mailtoLink}
      class={classNames(displayClass, "reply-by-email-button")}
      >
      Reply by email
      </a>
      </div>
    )
  } else {
    return null
  }
}


ReplyByEmail.css = `
.center-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.reply-by-email-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--highlight);
  color: var(--secondary);
  border-radius: 5px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.reply-by-email-button:hover {
  transform: scale(1.05);
}
`

export default (() => ReplyByEmail) satisfies QuartzComponentConstructor
```

Added the new component to `index.ts`
```diff
+import ReplyByEmail from "./ReplyByEmail"
```

Added the new component to `quartz.layout.ts`
```diff
+  afterBody: [
+    Component.ReplyByEmail(),
+  ],
```

### Added links to footer
20-12-2024 ▪ Added links to About, Contact and RSS.

`/rss` is a redirect from `/index.xml`done via Cloudflare.

`quartz.layout.ts`
```diff
// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
+      "About": "https://dansgarden.eu/about#about-this-site",
+      "Contact": "https://dansgarden.eu/contact",
+      "RSS": "https://dansgarden.eu/rss",
    },
```

### Misc custom css adjustments
▪ All the different items are commented within the code.  

`custom.scss`
```scss
@use "./base.scss";

// Adding Inter with ss02
@font-face {
    font-family: InterVariable;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    font-feature-settings: 'liga' 1, 'calt' 1, 'ss02' 1; /* fix for Chrome */
    src: url("/static/fonts/InterVariable.woff2") format("woff2");
}
@font-face {
    font-family: InterVariable;
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
    font-feature-settings: 'liga' 1, 'calt' 1, 'ss02' 1; /* fix for Chrome */
    src: url("/static/fonts/InterVariable-Italic.woff2") format("woff2");
}

//  Change style for footnotes
section[data-footnotes] {
    & > #footnote-label.sr-only {
        font-size: 1.25rem;
        color: var(--dark);
        margin-bottom: -0.75rem;
    }

    & > ol {
        margin-bottom: 2rem;
    }
}


// hide Date if frontmatter contains cssclasses hideDate
body:has(.page-header ~ article.hideDate) .content-meta {
    display: none;
}

// Change style for external links
a {
    &.external {
        text-decoration: underline;
        text-decoration-color: var(--secondary);
        color: var(--darkgray);
        background-color: var(--light);
    }
}

// typography improvements
h1 {
    font-size: 1.75rem;
    margin-top: 2.25rem;
    margin-bottom: 1rem;
    text-align: center;
}

h2 {
    font-size: 1.4rem;
    margin-top: 1.9rem;
    margin-bottom: 1rem;
    color: var(--secondary)

}

h3 {
    font-size: 1.12rem;
    margin-top: 1.62rem;
    margin-bottom: 1rem;
}

h4 {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: -0.5rem;
    color: var(--tertiary)
}

h5 {
    text-indent: 2em;
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: -0.9rem;
}

h6 {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: -0.9rem;
}

// Apply justification to only paragraphs or text elements if needed
p {
    text-align: justify;
}

// center fig caption
figure:has(img) {
    margin-top: -1rem;
    text-align: center;
}

figcaption {
    text-align: center;
    margin-top: -1rem;
    font-style: italic;
    font-size: 0.9rem;
}

// push the darkmode button to the right
button.darkmode {
    position: absolute;
    right: 1rem;
}

```