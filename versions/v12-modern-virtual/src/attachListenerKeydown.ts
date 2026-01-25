import virtualApplyBold from './actions/virtualApplyBold';
import render from './render';

const attachListenerKeydown = (state: State) => {
  const editor = state.editor.element!;
  // Keyboard shortcut (Ctrl/Cmd + B)
  editor.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const newState = virtualApplyBold(state);
      state = {
        ...state,
        ...newState,
      };

      render(state);
    }
  });
};

export default attachListenerKeydown;
