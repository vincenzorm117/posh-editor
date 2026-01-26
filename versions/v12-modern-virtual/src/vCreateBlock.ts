import uid from './helpers/uid';

const vCreateBlock = (tag: string, children: any[] = []): VirtualBlock => {
  return {
    type: 'element',
    id: uid(),
    tag,
    children,
  };
};

export default vCreateBlock;
