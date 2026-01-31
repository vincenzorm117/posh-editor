import getVirtualSelectionMarks from './getVirtualSelectionMarks';

const virtualIsBolded = (state: State): boolean => {
  const marks = getVirtualSelectionMarks(state);
  return marks.bold === 'true';
};

export default virtualIsBolded;
