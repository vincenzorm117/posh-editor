import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  // @ts-ignore
  window.state = init('#editor', {
    parsingOptions: {
      trimDocWhiteSpace: true,
      shrinkConsecutiveSpaces: true,
      convertNewlinesToSpaces: true,
      removeWhiteSpaceOnlyBlocks: true,
    },
  });
});
