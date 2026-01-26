import virtualApplyMarksInRange from './virtualApplyMarksInRange';

const virtualApplyBold = (state: State) => {
  const { virtualSelection } = state;

  if (!virtualSelection) return state;
  // If selection is collapsed, do nothing. TODO: expand to apply/remove bold mark
  if (virtualSelection.isCollapsed) {
    return state;
  }
  // Check if selection is already bolded
  const isBolded = virtualSelection.marks?.bold !== 'mixed'
  // Apply or remove bold mark based on current state
  virtualApplyMarksInRange(state, { bold: !isBolded });
};

export default virtualApplyBold;
