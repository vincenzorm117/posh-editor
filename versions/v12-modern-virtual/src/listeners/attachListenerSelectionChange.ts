import updateUI from '../updateUI';
import { virtualizeSelection } from '../virtualizeSelection';

function attachListenerSelectionChange(state: State) {
  // Update button state on selection change
  document.addEventListener('selectionchange', () => {
    state.virtualSelection = virtualizeSelection(state);
    updateUI(state);
  });
}
export default attachListenerSelectionChange;
