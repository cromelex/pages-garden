import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface ReplyByEmailOptions {
  email: string
  includeTitles?: string[]
  excludeTitles?: string[]
  buttonLabel?: string
}

const defaultOptions: Partial<ReplyByEmailOptions> = {
  includeTitles: [],
  excludeTitles: [],
  buttonLabel: "Reply by email"
}

const ReplyByEmail: QuartzComponent = ({
  fileData,
  displayClass,
  email,
  includeTitles,
  excludeTitles,
  buttonLabel
}: QuartzComponentProps & ReplyByEmailOptions) => {
  const title = fileData.frontmatter?.title

  const encodedEmail = btoa(email)

  const includeList = includeTitles || defaultOptions.includeTitles
  const excludeList = excludeTitles || defaultOptions.excludeTitles
  const label = buttonLabel || defaultOptions.buttonLabel

  // Display logic:
  // 1. If includeTitles is not empty, only show on those pages
  // 2. If includeTitles is empty, show on all pages except those in excludeTitles
  const shouldDisplay = title && (
    (includeList.length > 0 && includeList.includes(title)) ||
    (includeList.length === 0 && !excludeList.includes(title))
  )

  if (shouldDisplay) {
    return (
      <div class="center-wrapper">
        <button
          class={classNames(displayClass, "reply-by-email-button")}
          data-email={encodedEmail}
          data-title={encodeURIComponent(title)}
          onclick={`
            const encodedEmail = this.getAttribute('data-email');
            const email = atob(encodedEmail);
            const title = this.getAttribute('data-title');
            const mailtoLink = 'mailto:' + email + '?subject=' + title;
            window.location.href = mailtoLink;
            return false;
          `}
        >
          {label}
        </button>
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
  cursor: pointer;
  border: none;
  font-size: 1rem;
  font-family: inherit;
}

.reply-by-email-button:hover {
  transform: scale(1.05);
}
`

export default ((opts?: ReplyByEmailOptions) => {
  if (!opts?.email) {
    throw new Error("ReplyByEmail component requires an email parameter")
  }
  
  const component: QuartzComponent = (props) => {
    return ReplyByEmail({
      ...props,
      email: opts.email,
      includeTitles: opts?.includeTitles,
      excludeTitles: opts?.excludeTitles,
      buttonLabel: opts?.buttonLabel
    })
  }

  component.css = ReplyByEmail.css

  return component
}) satisfies QuartzComponentConstructor