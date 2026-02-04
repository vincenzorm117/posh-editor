const updateDomAttributes = (
  oldNode: VirtualTreeElement,
  newNode: VirtualTreeElement,
  domNode: HTMLElement,
) => {
  // Set new node props
  for (const [key, value] of Object.entries(newNode.props)) {
    domNode.setAttribute(key, value);
  }
  // Remove old node props
  for (const key in oldNode.props) {
    if (!newNode.props.hasOwnProperty(key)) {
      domNode.removeAttribute(key);
    }
  }
};

export default updateDomAttributes;
