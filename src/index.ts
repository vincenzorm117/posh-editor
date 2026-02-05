import init from './init';

document.addEventListener('DOMContentLoaded', () => {
  // @ts-ignore
  window.state = init('#editor');
});
