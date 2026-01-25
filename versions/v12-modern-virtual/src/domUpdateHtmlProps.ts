function domUpdateHtmlProps(
  oldNode: VirtualTreeElement,
  newNode: VirtualTreeElement,
  oldElement: HTMLElement,
) {
  const oldProps = oldNode.props ?? {};
  const newProps = newNode.props ?? {};

  // Remove attributes that don't exist anymroe
  for (const key of Object.keys(oldProps)) {
    if (!newProps.hasOwnProperty(key)) {
      oldElement.removeAttribute(key);
    }
  }

  // Only update the attributes that have changed
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] != value) {
      oldElement.setAttribute(key, value);
    }
  }
}

export default domUpdateHtmlProps;
