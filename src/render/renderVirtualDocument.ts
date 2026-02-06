import createVirtualTree from '@/virtualTree/createVirtualTree';
import createDomNode from './createDomNode';
import patch from './patch';

const renderVirtualDocument = (vState: VirtualState) => {
  const root = vState.editor.element;
  const vTree = createVirtualTree(vState.vDoc, vState.actions);
  // If no oldDoc, replace editor with newDoc render
  if (!vState.vTree) {
    const newChildren = vTree.children.map(createDomNode);
    root.replaceChildren(...newChildren);
  } else {
    const oldChildren = vState.vTree.children;
    const newChildren = vTree.children;

    for (let i = 0; i < newChildren.length; i++) {
      patch(oldChildren[i], newChildren[i], root, i);
    }

    while (root.childNodes.length > newChildren.length) {
      root.removeChild(root.lastChild!);
    }
  }

  vState.vTree = vTree;
};

export default renderVirtualDocument;
