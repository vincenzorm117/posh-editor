import React from 'react';
import { useRichTextEditor } from '../../context/RichTextEditorContext';
import './FloatingMenu.css';

const FloatingMenu = () => {
  const { isVisible, position, commands } = useRichTextEditor();

  if (!isVisible) return null;

  return (
    <div
      className="floating-menu"
      style={{ left: position.x, top: position.y }}
    >
      {commands.map((command) => (
        <button
          key={command.name}
          onClick={() => command.execute()}
          title={command.label}
        >
          {command.icon}
        </button>
      ))}
    </div>
  );
};

export default FloatingMenu;