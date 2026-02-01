import { MARK_TYPES } from '../constants';
import closest from '@helpers/closest';

const determineMarksFromNode = (
  node: Node,
  root: HTMLElement,
): VirtualMarks => {
  const marks = {} as VirtualMarks;

  for (const { name, tags } of MARK_TYPES) {
    const parent = closest(node, tags.join(','));
    if (parent && root.contains(parent)) {
      marks[name] = true;
    }
  }

  return marks;
};

export default determineMarksFromNode;
