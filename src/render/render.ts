import renderVirtualDocument from './renderVirtualDocument';
import renderVirtualSelection from './renderVirtualSelection';

const render = (vState: VirtualState) => {
  renderVirtualDocument(vState);
  renderVirtualSelection(vState);
};

export default render;
