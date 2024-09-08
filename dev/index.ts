import classnames from "./style.css?classnames"

console.log(classnames)

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <ul>
    ${classnames.map((name) => `<li>${name}</li>`).join("")}
  </ul>
`
