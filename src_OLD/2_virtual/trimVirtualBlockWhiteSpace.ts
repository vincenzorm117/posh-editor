/**
 * Trims leading whitespace from the first inline element and trailing whitespace
 * from the last inline element within a virtual block.
 *
 * @param block - The virtual block whose inline children will have whitespace trimmed
 * @returns The modified virtual block with trimmed whitespace on boundary inline elements
 *
 * @remarks
 * If the block has no children, it is returned unchanged.
 * This function mutates the text property of the first and last inline children.
 *
 * @example
 * ```typescript
 * const block = {
 *   children: [
 *     { text: '  Hello' },
 *     { text: 'World  ' }
 *   ]
 * };
 * const trimmed = trimVirtualBlockWhiteSpace(block);
 * // block.children[0].text is now 'Hello'
 * // block.children[1].text is now 'World'
 * ```
 */
const trimVirtualBlockWhiteSpace = (block: VirtualBlock): VirtualBlock => {
  if (block.children.length === 0) {
    return block;
  }
  // Trim left side of first inline
  const firstInline = block.children[0];
  firstInline.text = firstInline.text.replace(/^\s+/g, '');
  // Trim right side of last inline
  const lastInline = block.children[block.children.length - 1];
  lastInline.text = lastInline.text.replace(/\s+$/g, '');

  return block;
};

export default trimVirtualBlockWhiteSpace;
