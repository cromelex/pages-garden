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
        { Component: Component.ReaderMode() },
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
    Component.ReplyByEmail(),
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
