import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  // const editor = document.getElementById('editor') as HTMLDivElement | null;
  // const boldBtn = document.getElementById('boldBtn') as HTMLButtonElement | null;

  // console.log(document.querySelector('#editor')?.innerHTML);
  const state = init('#editor', {
    bold: { selector: '#boldBtn' },
  });
  // @ts-ignore
  window.state = state;
  console.log(state);
});
