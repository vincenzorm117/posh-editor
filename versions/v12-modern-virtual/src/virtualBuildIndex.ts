const virtualBuildIndex = (state: State): VirtualIndex => {
  const blocks = [];
  const inlineById = new Map();
  let globalPosition = 0;
  const virtualBlocks = state.virtualDocument?.blocks ?? [];

  for (let blockIndex = 0; blockIndex < virtualBlocks.length; blockIndex++) {
    const block = virtualBlocks[blockIndex];
    let blockPosition = 0;
    const virtualInlineIndexes = [];

    const virtualBlockIndex = {
      blockIndex,
      id: block.id,
      globalPosition,
    };

    for (
      let inlineIndex = 0;
      inlineIndex < block.children.length;
      inlineIndex++
    ) {
      const inline = block.children[inlineIndex];
      const virtualInlineIndex = {
        blockIndex,
        inlineIndex,
        globalPosition,
        blockPosition,
        length: inline.text.length,
        id: inline.id,
      };

      inlineById.set(inline.id, virtualInlineIndex);
      virtualInlineIndexes.push(virtualInlineIndex);

      blockPosition += inline.text.length;
      globalPosition += inline.text.length;
    }

    blocks.push({
      ...virtualBlockIndex,
      length: blockPosition,
      inlines: virtualInlineIndexes,
    });

    globalPosition += +1;
  }

  return {
    blocks,
    inlineById,
    globalLength: Math.max(0, globalPosition - 1),
  };
};

export default virtualBuildIndex;
