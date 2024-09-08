# vite-plugin-css-classnames

vite plugin to extract the classnames from a css-import with `?classnames` suffix

## Usage

**index.module.css**

```css
.big {
  text-transform: uppercase;
}
.mistqke {
  display: flex;
}
```

**index.ts**

```tsx
import classnames from "./index.module.css?classnames"
console.log(classnames) // ["big", "mistqke"]
```

## Types

If you want to get proper types (`string[]`) for `import classnames from "./index.module.css?classnames"`, you have to add `vite-plugin-css-classnames` to the `types` property of the tsconfig:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "vite-plugin-css-classnames"]
  }
}
```
