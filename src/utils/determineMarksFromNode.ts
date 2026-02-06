import { MARK_TYPES } from '../constants';
import closest from '@helpers/closest';

const determineMarksFromNode = (
  node: Node,
  root: HTMLElement,
  actions: Record<string, VirtualAction>,
): VirtualMarks => {
  const marks = {} as VirtualMarks;

  for (const [name, { scanMarks }] of Object.entries(actions)) {
    if (scanMarks(node, root)) {
      marks[name as VirtualMarkTypes] = true;
    }
  }

  return marks;
};

export default determineMarksFromNode;
