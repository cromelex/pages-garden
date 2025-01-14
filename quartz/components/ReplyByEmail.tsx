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
