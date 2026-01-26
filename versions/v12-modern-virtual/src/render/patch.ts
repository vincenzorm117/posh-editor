import didVirtualNodeChange from '../didVirtualNodeChange';
import domCreateNode from './domCreateNode';
import domUpdateHtmlProps from './domUpdateHtmlProps';

function patch(
  parent: HTMLElement,
  oldNode: VirtualTreeNode,
  newNode: VirtualTreeNode,
  index: number,
) {
  const oldElement = parent.childNodes[index];

  if (!oldNode) {
    parent.appendChild(domCreateNode(newNode));
    return;
  }

  if (!newNode) {
    parent.removeChild(oldElement);
    return;
  }

  if (!didVirtualNodeChange(oldNode, newNode)) {
    parent.replaceChild(domCreateNode(newNode), oldElement);
    return;
  }

  if (newNode.type === 'text') {
    if (oldElement.nodeValue != newNode.text) {
      oldElement.nodeValue = newNode.text;
    }
    return;
  }

  domUpdateHtmlProps(
    oldNode as VirtualTreeElement,
    newNode as VirtualTreeElement,
    oldElement as HTMLElement,
  );

  oldNode = oldNode as VirtualTreeElement;
  newNode = newNode as VirtualTreeElement;

  const oldChildren = oldNode.children ?? [];
  const newChildren = newNode.children ?? [];

  // Build map of old children by id
  const oldChildrenMap = new Map<
    string,
    { node: VirtualTreeNode; index: number }
  >();
  oldChildren.forEach((node, index) => {
    if ('key' in node) oldChildrenMap.set(node.key!, { node, index });
  });

  // Build set of used old child keys
  const usedOldChildKeys = new Set<string>();

  // TODO: Can swap domIndex in favor for index i?
  let domIndex = 0;

  // Loop through new children and patch
  for (let i = 0; i < newChildren!.length; i++) {
    let newChild = newChildren![i];
    let match = null;

    // Look up corresponding old child with same key
    if (
      newChild.hasOwnProperty('key') &&
      oldChildrenMap.has((newChild as VirtualTreeElement).key!)
    ) {
      match = oldChildrenMap.get((newChild as VirtualTreeElement).key!)!;
    }
    // TODO: Test this line. I think it will be buggy when oldChildren and newChildren have different lengths.
    // else if(oldChildren[i]) {
    //   match = { node: oldChildren[i], index: i };
    // }

    // If match found but already used, discard
    if (
      match &&
      !usedOldChildKeys.has((match.node as VirtualTreeElement).key!)
    ) {
      match = null;
    }

    // If match found, patch
    if (match) {
      // Mark old child as used
      usedOldChildKeys.add((match.node as VirtualTreeElement).key!);
      // Ensure DOM order
      const currentDomChild = oldElement.childNodes[domIndex] ?? null;
      const matchDomChild = oldElement.childNodes[match.index] ?? null;
      if (currentDomChild !== matchDomChild) {
        oldElement.insertBefore(matchDomChild, currentDomChild);
      }
      // patch
      patch(oldElement as HTMLElement, match.node, newChild, domIndex);
    } else {
      // Insert new child
      const matchDomChild = oldElement.childNodes[domIndex] ?? null;
      oldElement.insertBefore(domCreateNode(newChild), matchDomChild);
    }

    domIndex++;
  }

  // Remove extra old nodes
  while (oldElement.childNodes.length > newChildren.length) {
    oldElement.removeChild(oldElement.lastChild!);
  }
}

export default patch;
