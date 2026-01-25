import { virtualizeSelection } from './virtualizeSelection';

function attachListenerSelectionChange(state: State) {
  // Update button state on selection change
  document.addEventListener('selectionchange', () => {
    state.virtualSelection = virtualizeSelection(state);
  });
}
export default attachListenerSelectionChange;
