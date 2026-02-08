import hasMarks from '@/utils/hasMarks';

const createVirtualTreeText = (inline: VirtualInline): VirtualTreeText => {
  return {
    type: 'text',
    id: inline.id,
    text: inline.text,
  };
};

export default createVirtualTreeText;
