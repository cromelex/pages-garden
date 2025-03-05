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
    Component.Breadcrumbs(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.Darkmode(),
    Component.Explorer({
      title: "Home", // title of the explorer component
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["contact"])
        return !omit.has(node.name.toLowerCase())
      },
      sortFn: (a, b) => {
        const nameOrderMap: Record<string, number> = {
          "economics": 100,
          "fatherhood": 200,
          //"fatherhood/paternity-leave": 201,
          //"fatherhood/fatherhood-pt2": 202,
          //"fatherhood/fatherhood-pt1": 203,
          "technology": 300,
          "projects": 400,
          "misc": 700,
          "about": 999,
        }

        let orderA = 0
        let orderB = 0

        if (a.file && a.file.slug) {
          orderA = nameOrderMap[a.file.slug] || 0
        } else if (a.name) {
          orderA = nameOrderMap[a.name] || 0
        }

        if (b.file && b.file.slug) {
          orderB = nameOrderMap[b.file.slug] || 0
        } else if (b.name) {
          orderB = nameOrderMap[b.name] || 0
        }

        return orderA - orderB
      },
    }),
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
    Component.Explorer({
      title: "Home", // title of the explorer component
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["contact"])
        return !omit.has(node.name.toLowerCase())
      },
      sortFn: (a, b) => {
        const nameOrderMap: Record<string, number> = {
          "economics": 100,
          "fatherhood": 200,
          //"fatherhood/paternity-leave": 201,
          //"fatherhood/fatherhood-pt2": 202,
          //"fatherhood/fatherhood-pt1": 203,
          "technology": 300,
          "projects": 400,
          "misc": 700,
          "about": 999,
        }

        let orderA = 0
        let orderB = 0

        if (a.file && a.file.slug) {
          orderA = nameOrderMap[a.file.slug] || 0
        } else if (a.name) {
          orderA = nameOrderMap[a.name] || 0
        }

        if (b.file && b.file.slug) {
          orderB = nameOrderMap[b.file.slug] || 0
        } else if (b.name) {
          orderB = nameOrderMap[b.name] || 0
        }

        return orderA - orderB
      },
    }),
  ],
  right: [
    Component.Search(),
  ],
}
