import devirtualizeSelection from '../devirtualizeSelection';
import domCreateNode from './domCreateNode';
import patch from './patch';
import vDocToVTree from '../vDocToVTree';
import virtualBuildIndex from '../virtualBuildIndex';

function render(state: State): void {
  const newTree = vDocToVTree(state.virtualDocument!);
  const editorElement = state.editor.element;

  // If no existing virtualTree, replace HTML
  if (!state.virtualTree) {
    const newChildren = (newTree?.children ?? []).map(domCreateNode);
    editorElement.replaceChildren(...newChildren);
  } else {
    const oldChildren = state.virtualTree.children ?? [];
    const newChildren = newTree.children ?? [];

    for (let i = 0; i < newChildren.length; i++) {
      patch(editorElement, oldChildren[i], newChildren[i], i);
    }

    while (editorElement.childNodes.length > newChildren.length) {
      editorElement.removeChild(editorElement.lastChild!);
    }
  }

  state.virtualTree = newTree;
  state.virtualIndex = virtualBuildIndex(state);

  devirtualizeSelection(state);
}

export default render;
