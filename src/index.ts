import fs from "fs/promises"
import postcss from "postcss"
import selectorParser from "postcss-selector-parser"
import type { PluginOption } from "vite"

declare global {
  //@ts-expect-error If someone knows how to do this with declaration files: make a PR please 🙏
  module "*.css?classnames" {
    /** Array of classnames present in the given css-file. */
    const classnames: string[]
    export default classnames
  }
}

const IDENTIFIER_SUFFIX = "?classnames"
const USE_PROXY_SUFFIX = true
const PROXY_SUFFIX = USE_PROXY_SUFFIX ? ".classnames" : ""
const PREFIX = '\0classname-import-proxy"'

function encodeId(id: string) {
  return PREFIX + id + PROXY_SUFFIX
}
function decodeId(id: string) {
  return id.slice(
    PREFIX.length,
    PROXY_SUFFIX ? -PROXY_SUFFIX.length : undefined,
  )
}

export default function (): PluginOption {
  return {
    name: "css-classnames",
    enforce: "pre",

    async resolveId(source, importer) {
      if (
        !source.endsWith(".css" + IDENTIFIER_SUFFIX) &&
        !source.endsWith(`.css?used&${IDENTIFIER_SUFFIX}`)
      ) {
        return
      }

      const originalSource = source.split("?")[0]!
      const resolved = (await this.resolve(originalSource, importer))?.id

      return resolved ? encodeId(resolved) : null
    },

    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return
      }

      const path = decodeId(id)
      const css = await fs.readFile(path, { encoding: "utf8" })

      const classNames = new Set<string>()

      await postcss([
        {
          postcssPlugin: "extract-class-names",
          Rule(rule) {
            selectorParser((selectors) =>
              selectors.walkClasses((node) => {
                classNames.add(node.value)
              }),
            ).processSync(rule.selector)
          },
        },
      ]).process(css, { from: path })

      return `export default ${JSON.stringify(Array.from(classNames))};`
    },
  }
}
