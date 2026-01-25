const debugRenderVirtualDocument = (state: State) => {
  try {
    return JSON.stringify({
    type: 'document',
    inlines: state.virtualDocument.blocks.map((block) => ({
      type: 'block',
      inlines: block.children.map((inline) => {
        return {
          type: 'inline',
          text: inline.text.replace(/ /g, '_'),
          marks: inline.marks,
        };
      }),
    })),
  }, null, 2);
  } catch(error) {
    return error instanceof Error ? error.message : String(error);
  }
};

export default debugRenderVirtualDocument;
