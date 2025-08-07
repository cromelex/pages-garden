import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "About": "https://dansgarden.eu/about",
      "Contact": "https://dansgarden.eu/contact",
      "RSS": "https://dansgarden.eu/rss",
      "Buy me a coffee ☕": "https://www.buymeacoffee.com/dansgarden"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Home", // title of the explorer component
      filterFn: (node) => {
        // exclude files with the tag "explorerexclude"
        return node.data.tags.includes("explorerexclude") !== true
      },
    })
  ],
  afterBody: [
    Component.ReplyByEmail({
      email: "contact@dansgarden.eu",
      // includeTitles: ["Welcome to Quartz 4"], // You can specify which page titles to include or comment out the line to include on all pages
      excludeTitles: ["Home", "About me"],
      buttonLabel: "✉️ Reply by email"
    }),
  ],
  right: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
                   grow: true,
        },
      ],
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 4,
        title: "Recently Updated Notes",
        showTags: false
      }),
      condition: (props: QuartzComponentProps) => props.fileData.slug == "index",
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Home", // title of the explorer component
      filterFn: (node) => {
        // exclude files with the tag "explorerexclude"
        return node.data.tags.includes("explorerexclude") !== true
      },
    })
  ],
  right: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
                   grow: true,
        },
      ],
    }),
  ],
}
