import runFn from '@/helpers/runFn';

const determineMarksFromNode = (
  node: Node,
  root: HTMLElement,
  actions: Record<string, VirtualAction>,
): VirtualMarks => {
  const marks = {} as VirtualMarks;

  // TODO: change this scheme to virtualizeMarks(node, root, marks) where marks can be mutated in one go without a boolean check and we can use the identity function
  for (const [name, { scanMarks }] of Object.entries(actions)) {
    if (runFn(scanMarks, node, root)) {
      marks[name as VirtualMarkTypes] = true;
    }
  }

  return marks;
};

export default determineMarksFromNode;
