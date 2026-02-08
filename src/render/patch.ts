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

  // Grab children
  const oldChildren = oldNode.children;
  const newChildren = newNode.children;
  // Index-based diffing can cause issues when nodes are reordered, so we first try to match by id
  const oldChildrenById = new Map<
    string,
    { vNode: VirtualTreeNode; index: number }
  >();
  oldChildren.forEach((vNode, index) =>
    oldChildrenById.set(vNode.id, { vNode, index }),
  );
  // Keep track of which old children have been matched to avoid duplicates
  const usedChildren = new Set<number>();

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    let oldChild = oldChildren[i];

    if (oldChild && newChild.id == oldChild.id) {
      patch(oldChild, newChild, domNode, i);
      continue;
    }

    let match;
    if (oldChildrenById.has(newChild.id)) {
      match = oldChildrenById.get(newChild.id);
    } else if (oldChild) {
      match = { vNode: oldChild, index: i };
    }

    if (match && usedChildren.has(match.index)) match = null;

    if (match) {
      usedChildren.add(match.index);

      const matchNode = domNode.childNodes[match.index];
      const currNode = domNode.childNodes[i];
      if (matchNode && matchNode != currNode) {
        domNode.insertBefore(matchNode, currNode);
      }
      patch(match.vNode, newChild, domNode, i);
    } else {
      usedChildren.add(i);
      domNode.insertBefore(createDomNode(newChild), domNode.childNodes[i]);
    }
  }

  while (domNode.childNodes.length > newChildren.length) {
    domNode.removeChild(domNode.lastChild!);
  }
};

export default patch;
