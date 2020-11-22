const RENDER_TO_DOM = Symbol('render to dom');
// All wrapper class inside api need the same name with the DOM api if need,
// like root, setAttribute, appendChild.
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(component) {
    const range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(component) {
    this.children.push(component);
  }

  [RENDER_TO_DOM](range) {
    this.render()[RENDER_TO_DOM](range);
  }
}

export function createElement(type, attributes, ...children) {
  let elem;
  if (typeof type === 'string') {
    elem = new ElementWrapper(type);
  } else {
    elem = new type;
  }

  for (let p in attributes) {
    elem.setAttribute(p, attributes[p]);
  }

  const insertChildren = children => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      if ((typeof child === 'object') && (child instanceof Array)) {
        insertChildren(child);
      } else {
        elem.appendChild(child);
      }
    }
  }

  insertChildren(children);

  return elem;
}

export function render(component, parentElement) {
  const range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}
