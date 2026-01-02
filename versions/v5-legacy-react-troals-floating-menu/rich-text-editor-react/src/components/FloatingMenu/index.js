import React from 'react';
import './FloatingMenu.css';

const FloatingMenu = ({ isVisible, position, onCommand }) => {
  if (!isVisible) return null;

  const handleCommand = (command) => {
    onCommand(command);
  };

  return (
    <div
      className="floating-menu"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button onClick={() => handleCommand('bold')}><strong>B</strong></button>
      <button onClick={() => handleCommand('italic')}><em>I</em></button>
      <button onClick={() => handleCommand('underline')}><u>U</u></button>
      <button onClick={() => handleCommand('strikeThrough')}><s>S</s></button>
      <button onClick={() => handleCommand('insertUnorderedList')}>• List</button>
      <button onClick={() => handleCommand('insertOrderedList')}>1. List</button>
    </div>
  );
};

export default FloatingMenu;