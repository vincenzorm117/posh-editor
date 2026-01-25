const virtualBuildIndex = (state: State): VirtualIndex => {
  const blocks = [];
  const inlineById = new Map();
  let globalPosition = 0;
  const virtualBlocks = state.virtualDocument?.blocks ?? [];

  for (let blockIndex = 0; blockIndex < virtualBlocks.length; blockIndex++) {
    const block = virtualBlocks[blockIndex];
    let blockPosition = 0;

    for (
      let inlineIndex = 0;
      inlineIndex < block.children.length;
      inlineIndex++
    ) {
      const inline = block.children[inlineIndex];
      inlineById.set(inline.id, {
        blockIndex,
        inlineIndex,
        globalPosition,
        blockPosition,
        length: inline.text.length,
      });

      blockPosition += inline.text.length;
    }

    blocks.push({
      blockIndex,
      id: block.id,
      globalPosition,
      length: blockPosition,
    });

    globalPosition += blockPosition + 1;
  }

  return {
    blocks,
    inlineById,
    globalLength: Math.max(0, globalPosition - 1),
  };
};

export default virtualBuildIndex;
