import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  const vState = init('#editor', {
    parsingOptions: {
      trimDocWhiteSpace: true,
      shrinkConsecutiveSpaces: true,
      convertNewlinesToSpaces: true,
      removeWhiteSpaceOnlyBlocks: true,
    },
  });

  // @ts-ignore
  window.state = vState;

  // Listener: Bold Button Click
  document.querySelector('#boldBtn')?.addEventListener('click', () => {
    vState.actions.bold.apply(vState);
  });
});
