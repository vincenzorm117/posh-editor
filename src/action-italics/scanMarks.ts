import closest from '@/helpers/closest';

const scanMarks = (node: Node, root: HTMLElement): boolean => {
  const parent = closest(node, 'I, EM, .italic');
  return !!(parent && root.contains(parent));
};

export default scanMarks;
