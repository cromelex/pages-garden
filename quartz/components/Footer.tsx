import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          Dan's Garden © {year}, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> <img
          src="/static/cc.svg"
          alt="Creative Commons CC Icon"
          width="20"
          height="20"
          style={{
            verticalAlign: "middle", // Aligns with text baseline
            display: "inline-block",     // Keeps the icon inline
          }}
          />
          <img
          src="/static/by.svg"
          alt="Creative Commons BY Icon"
          width="20"
          height="20"
          style={{
            verticalAlign: "middle", // Aligns with text baseline
            display: "inline-block",     // Keeps the icon inline
          }}
          />
         </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
