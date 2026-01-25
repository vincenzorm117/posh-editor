import render from '../render';
import virtualApplyMarksInRange from './virtualApplyMarksInRange';
import virtualIsBolded from './virtualIsBolded';

const virtualApplyBold = (state: State) => {
  const { virtualSelection } = state;

  if (!virtualSelection) return state;
  // If selection is collapsed, do nothing. TODO: expand to apply/remove bold mark
  if (virtualSelection.isCollapsed) {
    return state;
  }
  // Check if selection is already bolded
  const isBolded = virtualIsBolded(state);
  // Apply or remove bold mark based on current state
  virtualApplyMarksInRange(state, { bold: !isBolded });
};

export default virtualApplyBold;
