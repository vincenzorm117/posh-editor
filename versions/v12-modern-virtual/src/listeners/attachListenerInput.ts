import render from '../render';
import { clamp } from '../helpers/clamp';
import virtualBuildIndex from '../virtualBuildIndex';
import virtualizeDOM from '../virtualizeDOM';
import { virtualizeSelection } from '../virtualizeSelection';
import updateUI from '../updateUI';

const attachListenerInput = (state: State) => {
  const editorElement = state.editor.element;

  let str = '';

  editorElement.addEventListener('input', (event: Event) => {
    const { data } = event as InputEvent;
    str += data ?? '';
    console.log(str);

    const vSel = virtualizeSelection(state);
    state.virtualDocument = virtualizeDOM(state.editor.element);
    state.virtualIndex = virtualBuildIndex(state);

    state.virtualSelection = {
      ...vSel,
      anchor: clamp(vSel.anchor ?? 0, 0, state.virtualIndex?.globalLength ?? 0),
      focus: clamp(vSel.focus ?? 0, 0, state.virtualIndex?.globalLength ?? 0),
    };

    render(state);
    updateUI(state);
  });
};
export default attachListenerInput;
