import runFn from '@/helpers/runFn';
import createVirtualTreeText from './createVirtualTreeText';
import { MARK_TYPE_TO_TAG } from '@/constants';

const createVirtualTreeElement = (
  inline: VirtualInline,
  actions: Record<string, VirtualAction>,
): VirtualTreeElement => {
  const props = (Object.entries(inline.marks) as VirtualMarkEntries)
    // Filter only active marks
    .filter(([, isActive]) => isActive)
    // Get only mark types
    .map(([mark]) => mark)
    .reduce((marks, mark) => {
      return runFn(actions[mark].renderMarks!, marks);
    }, {} as VirtualTreeElementProps);

  return {
    type: 'element',
    tag: 'SPAN',
    props,
    children: [createVirtualTreeText(inline)],
  };
};

export default createVirtualTreeElement;
