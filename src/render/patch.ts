import areVirtualTreeNodesDifferent from '@/virtualTree/areVirtualTreeNodesDifferent';
import createDomNode from './createDomNode';
import updateDomAttributes from './updateDomAttributes';

const patch = (
  oldNode: VirtualTreeNode,
  newNode: VirtualTreeNode,
  parent: Node,
  index: number,
) => {
  let domNode = parent.childNodes[index];

  if (!oldNode) {
    parent.appendChild(createDomNode(newNode));
    return;
  }

  if (!newNode) {
    parent.removeChild(domNode);
    return;
  }

  if (areVirtualTreeNodesDifferent(oldNode, newNode)) {
    parent.replaceChild(createDomNode(newNode), domNode);
    return;
  }

  if (newNode.type == 'text') {
    if (newNode.text != (oldNode as VirtualTreeText).text) {
      domNode.nodeValue = newNode.text;
    }
    return;
  }

  oldNode = oldNode as VirtualTreeElement;
  newNode = newNode as VirtualTreeElement;

  updateDomAttributes(
    oldNode as VirtualTreeElement,
    newNode as VirtualTreeElement,
    domNode as HTMLElement,
  );

  // TODO: need better algorithm
  const oldChildren = oldNode.children;
  const newChildren = newNode.children;

  for (let i = 0; i < newChildren.length; i++) {
    patch(oldChildren[i], newChildren[i], domNode, i);
  }

  while (domNode.childNodes.length > newChildren.length) {
    domNode.removeChild(domNode.lastChild!);
  }
};

export default patch;
