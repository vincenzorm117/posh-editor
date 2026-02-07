import renderSelectionLine from './renderSelectionLine';

const renderDebugDocument = (state: VirtualState) => {
  const { vDoc, vSel } = state;

  const textBlocks = vDoc.blocks.map((block) =>
    block.inlines.map((inline) => {
      const classes = Object.entries(inline.marks)
        .filter(([, isActive]) => isActive)
        .map(([mark]) => {
          if (mark === 'italics') return 'italic';
          if (mark === 'bold') return 'text-[red] font-bold';
          if (mark === 'underline') return 'underline';
          return mark; // For any other dynamic marks, use the mark name as class
        })
        .join(' ');

      return `<span class="${classes}">${inline.text}</span>`;
    }),
  );

  if (!vSel.isInEditor) {
    return textBlocks
      .map((block) => `<p class="whitespace-pre">${block.join('')}</p>`)
      .join('');
  }

  const selStart = Math.min(vSel.start, vSel.end);
  const selEnd = Math.max(vSel.start, vSel.end);

  const selectionLineByBlocks = vDoc.blocks.map((block, blockIndex) =>
    renderSelectionLine(
      block,
      state.vIndex.blocks[blockIndex],
      selStart,
      selEnd,
    ),
  );

  return textBlocks.reduce((acc, block, i) => {
    if (selectionLineByBlocks[i]) {
      return (
        acc +
        `<p class="whitespace-pre">${block.join('')}</p><p class="whitespace-pre text-[pink]">${selectionLineByBlocks[i].join('')}</p>`
      );
    }
    return acc + `<p class="whitespace-pre">${block.join('')}</p>`;
  }, '');
};

export default renderDebugDocument;
