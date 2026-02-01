import debugUpdateUI from './debug/debugUpdateUI';
import init from './init';
import render from './3_render/render';
import virtualBuildIndex from './2_virtual/virtualBuildIndex';
import virtualizeDOM from './1_virtualize/virtualizeDOM';
import { virtualizeSelection } from './1_virtualize/virtualizeSelection';

document.addEventListener('DOMContentLoaded', () => {
  // const editor = document.getElementById('editor') as HTMLDivElement | null;
  // const boldBtn = document.getElementById('boldBtn') as HTMLButtonElement | null;

  // console.log(document.querySelector('#editor')?.innerHTML);
  const state = init('#editor', {
    bold: { selector: '#boldBtn' },
  });
  // @ts-ignore
  window.state = state;
  // @ts-ignore
  window.virtualizeDOM = virtualizeDOM;
  // @ts-ignore
  window.virtualBuildIndex = virtualBuildIndex;
  // @ts-ignore
  window.virtualizeSelection = virtualizeSelection;
  // @ts-ignore
  window.render = render;
  debugUpdateUI(state);
  console.log(state);
});
