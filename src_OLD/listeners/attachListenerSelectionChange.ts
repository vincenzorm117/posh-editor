import debugUpdateUI from '../debug/debugUpdateUI';
import { virtualizeSelection } from '../1_virtualize/virtualizeSelection';

function attachListenerSelectionChange(state: State) {
  // Update button state on selection change
  document.addEventListener('selectionchange', () => {
    state.virtualSelection = virtualizeSelection(state);
    debugUpdateUI(state);
  });
}
export default attachListenerSelectionChange;
