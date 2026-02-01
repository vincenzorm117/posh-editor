import virtualApplyBold from '../2_virtual/virtualApplyBold';
import render from '../3_render/render';

const attachListenerKeydown = (state: State) => {
  const editor = state.editor.element!;
  // Keyboard shortcut (Ctrl/Cmd + B)
  editor.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      virtualApplyBold(state);
      render(state);
    }
  });
};

export default attachListenerKeydown;
