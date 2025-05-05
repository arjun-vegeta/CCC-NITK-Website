import React from 'react';

const NoteBox = ({ children }) => {
  return (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        boxSizing: 'border-box',
        width: '75%',
        maxWidth: '75%',
      }}
      className="note-box"
    >
      {children}
    </div>
  );
};

export default NoteBox;
