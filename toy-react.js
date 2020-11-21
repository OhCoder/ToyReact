// All wrapper class inside api need the same name with the DOM api,
// like root, setAttribute, appendChild if need.
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(component) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
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

  get root() {
    if (!this.render) {
      console.error('you need to add render function!!');
      return null;
    }

    if (!this._root) {
      this._root = this.render().root;
    }

    return this._root;
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
  if (!component.root) {
    return null;
  }

  parentElement.appendChild(component.root);
}
