const renderSelectionLine = (
  block: VirtualBlock,
  blockIndex: VirtualBlockIndex,
  selStart: number,
  selEnd: number,
) => {
  const { start, end } = blockIndex;

  if (end < selStart || selEnd < start) {
    return undefined;
  }

  return block.inlines.map((inline, j) => {
    const { start, end } = blockIndex.inlines[j];

    if (end < selStart) {
      return '&nbsp;'.repeat(inline.text.length);
    }

    if (selEnd < start) {
      return '';
    }

    const cutStart = Math.max(selStart - start, 0);
    const cutEnd = Math.min(selEnd - start, inline.text.length);

    let selectionLine = '';
    if (selStart === selEnd) {
      if (cutEnd === inline.text.length) {
        return '&nbsp;'.repeat(cutStart);
      } else {
        return '&nbsp;'.repeat(cutStart) + '^';
      }
    } else {
      if (0 < cutStart) {
        selectionLine += '&nbsp;'.repeat(cutStart);
      }

      selectionLine += '^'.repeat(cutEnd - cutStart);
    }

    return selectionLine;
  });
};

export default renderSelectionLine;
