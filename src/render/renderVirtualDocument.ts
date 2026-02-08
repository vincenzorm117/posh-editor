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
    const rootIndex = Array.from(root.parentElement!.childNodes).indexOf(root);
    patch(vState.vTree, vTree, root.parentElement!, rootIndex);
  }

  vState.vTree = vTree;
};

export default renderVirtualDocument;
