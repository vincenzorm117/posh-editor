import runFn from '@/helpers/runFn';
import renderVirtualDocument from './renderVirtualDocument';
import renderVirtualSelection from './renderVirtualSelection';

const render = (vState: VirtualState) => {
  runFn(vState.hooks.preRender, vState);
  renderVirtualDocument(vState);
  renderVirtualSelection(vState);
  runFn(vState.hooks.postRender, vState);
};

export default render;
