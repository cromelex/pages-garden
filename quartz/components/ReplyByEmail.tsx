import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface ReplyByEmailOptions {
  username?: string
  domain?: string
}

// Default options will be used if not provided in the layout file
const defaultOptions: ReplyByEmailOptions = {
  username: "Y29udGFjdA==", // "contact" in base64
  domain: "ZGFuc2dhcmRlbi5ldQ==" // "dansgarden.eu" in base64
}

const ReplyByEmail: QuartzComponent = ({ fileData, displayClass, username, domain }: QuartzComponentProps & ReplyByEmailOptions) => {
  const title = fileData.frontmatter?.title

  // Use provided values or defaults
  const encodedPart1 = username || defaultOptions.username
  const encodedPart2 = domain || defaultOptions.domain

  if (title && title !== "Home" && title !== "About me" && title !== "Contact me") {
    return (
      <div class="center-wrapper">
      <button
      class={classNames(displayClass, "reply-by-email-button")}
      data-username={encodedPart1}
      data-domain={encodedPart2}
      data-title={encodeURIComponent(title)}
      >
      Reply by email
      </button>
      </div>
    )
  } else if (title === "Contact me") { // Different text for the "Contact me" page
    return (
      <div class="center-wrapper">
      <button
      class={classNames(displayClass, "reply-by-email-button")}
      data-username={encodedPart1}
      data-domain={encodedPart2}
      data-title="Contact form"
      >
      Contact me by email
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

// Script that works with SPA navigation
ReplyByEmail.beforeDOMLoaded = `
// Function to attach email button handlers
function attachEmailHandlers() {
  document.querySelectorAll('.reply-by-email-button').forEach(function(button) {
    // Remove existing event listeners first to prevent duplicates
    button.removeEventListener('click', handleEmailButtonClick);
    // Add fresh event listener
    button.addEventListener('click', handleEmailButtonClick);
  });
}

// Handler function for the email button click
function handleEmailButtonClick(e) {
  e.preventDefault();

  // Get data attributes
  const username = atob(this.getAttribute('data-username'));
  const domain = atob(this.getAttribute('data-domain'));
  const title = this.getAttribute('data-title');

  // Create email address and mailto link
  const email = username + '@' + domain;
  const mailtoLink = 'mailto:' + email + '?subject=' + title;

  // Open email client
  window.location.href = mailtoLink;
}

// Initial attachment when the page loads
document.addEventListener('DOMContentLoaded', attachEmailHandlers);

// Re-attach handlers after SPA navigation
document.addEventListener('nav', function() {
  // Small delay to ensure the new buttons are in the DOM
  setTimeout(attachEmailHandlers, 10);
});
`

export default ((opts?: ReplyByEmailOptions) => {
  // Component constructor that accepts options
  const component: QuartzComponent = (props) => {
    return ReplyByEmail({
      ...props,
      username: opts?.username,
      domain: opts?.domain
    })
  }

  // Pass through the CSS and beforeDOMLoaded
  component.css = ReplyByEmail.css
  component.beforeDOMLoaded = ReplyByEmail.beforeDOMLoaded

  return component
}) satisfies QuartzComponentConstructor
