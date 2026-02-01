import render from '../3_render/render';
import { clamp } from '../helpers/clamp';
import virtualBuildIndex from '../2_virtual/virtualBuildIndex';
import virtualizeDOM from '../1_virtualize/virtualizeDOM';
import { virtualizeSelection } from '../1_virtualize/virtualizeSelection';
import debugUpdateUI from '../debug/debugUpdateUI';

const attachListenerInput = (state: State) => {
  const editorElement = state.editor.element;

  editorElement.addEventListener('input', (event: Event) => {
    state.virtualDocument = virtualizeDOM(state.editor.element);
    state.virtualIndex = virtualBuildIndex(state);
    const vSel = virtualizeSelection(state);

    state.virtualSelection = {
      ...vSel,
      anchor: clamp(vSel.anchor ?? 0, 0, state.virtualIndex?.globalLength ?? 0),
      focus: clamp(vSel.focus ?? 0, 0, state.virtualIndex?.globalLength ?? 0),
    };

    render(state);
    debugUpdateUI(state);
  });
};
export default attachListenerInput;
