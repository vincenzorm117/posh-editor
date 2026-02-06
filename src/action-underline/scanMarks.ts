import closest from '@/helpers/closest';

const scanMarks = (node: Node, root: HTMLElement): boolean => {
  const parent = closest(node, 'U, .underline');
  return !!(parent && root.contains(parent));
};

export default scanMarks;
