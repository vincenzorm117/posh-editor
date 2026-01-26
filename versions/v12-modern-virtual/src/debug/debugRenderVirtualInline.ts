const debugRenderVirtualInline = (inline: VirtualInline): string => {
  if (inline?.marks?.bold) {
    return `<b class="text-[red]">${inline.text}</b>`;
  }

  return inline.text;
};

export default debugRenderVirtualInline;
