import virtualApplyBold from '../actions/virtualApplyBold';
import render from '../render/render';
import debugUpdateUI from '../debug/debugUpdateUI';

function attachListenerBoldBtn(state: State, boldBtnSelector: string) {
  // If no selector defined, skip
  const hasSelector = (boldBtnSelector?.length ?? 0) > 0;
  if (!hasSelector) return;
  // Attach listener
  const boldBtn = document.querySelector(boldBtnSelector) as HTMLElement;
  // If button not found, throw error
  if (!boldBtn) {
    throw new Error(`Bold button not found for selector: ${boldBtnSelector}`);
  }
  // Attach click listener
  boldBtn.addEventListener('click', () => {
    virtualApplyBold(state);
    render(state);
    debugUpdateUI(state);
  });
}

export default attachListenerBoldBtn;
