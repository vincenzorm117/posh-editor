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

  // Listener: Italics Button Click
  document.querySelector('#italicsBtn')?.addEventListener('click', () => {
    vState.actions.italics.apply(vState);
  });

  // Listener: Underline Button Click
  document.querySelector('#underlineBtn')?.addEventListener('click', () => {
    vState.actions.underline.apply(vState);
  });
});
