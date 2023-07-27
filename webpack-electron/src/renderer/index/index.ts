import test from "./test";
console.log(test);
function component() {
  const element = document.createElement("div");
  element.innerHTML = "hello webpack!!!";
  return element;
}

document.body.appendChild(component());
