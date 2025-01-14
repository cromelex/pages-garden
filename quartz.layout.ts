import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "About": "https://dansgarden.eu/about#about-this-site",
      "Contact": "https://dansgarden.eu/contact",
      "RSS": "https://dansgarden.eu/rss",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.Darkmode(),
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Home", // title of the explorer component
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["contact"])
        return !omit.has(node.name.toLowerCase())
      },
      sortFn: (a, b) => {
        if ((!a.file && !b.file) || (a.file && b.file)) {
          return a.displayName.localeCompare(b.displayName)
        }
        if (a.file && !b.file) {
          return -1
        } else {
          return 1
        }
      },
    })),
  ],
  afterBody: [
    Component.ReplyByEmail(),
  ],
  right: [
    Component.Search(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.Darkmode(),
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Home", // title of the explorer component
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["contact"])
        return !omit.has(node.name.toLowerCase())
      },
      sortFn: (a, b) => {
        if ((!a.file && !b.file) || (a.file && b.file)) {
          return a.displayName.localeCompare(b.displayName)
        }
        if (a.file && !b.file) {
          return -1
        } else {
          return 1
        }
      },
    })),
  ],
  right: [
    Component.Search(),
  ],
}
