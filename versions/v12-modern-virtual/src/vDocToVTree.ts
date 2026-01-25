import { CHAR_ZERO_WIDTH_SPACE } from './constants';

function vH(
  tag: string,
  props: Record<string, any> = {},
  key: string,
  children: VirtualTreeNode[] = [],
): VirtualTreeElement {
  return {
    type: 'element',
    tag,
    props,
    children,
    key,
  };
}

function vT(text: string): VirtualTreeText {
  return {
    type: 'text',
    text: text ?? '',
  };
}

const vDocToVTree = (vDoc: VirtualDocument): VirtualTree => {
  const blockNodes = vDoc.blocks.map((block) =>
    vH(
      block.tag,
      { 'data-id': block.id },
      block.id,
      block.children.map((inline) => {
        const text =
          inline.text.length === 0 ? CHAR_ZERO_WIDTH_SPACE : inline.text;

        const tag = inline.marks['bold'] == true ? 'b' : 'span';

        return vH(tag, { 'data-id': inline.id }, inline.id, [vT(text)]);
      }),
    ),
  );

  return vH('div', {}, 'root', blockNodes) as VirtualTree;
};

export default vDocToVTree;
