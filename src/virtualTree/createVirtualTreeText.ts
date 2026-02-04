import hasMarks from '@/utils/hasMarks';

const createVirtualTreeText = (inline: VirtualInline): VirtualTreeText => {
  return {
    type: 'text',
    text: inline.text,
  };
};

export default createVirtualTreeText;
