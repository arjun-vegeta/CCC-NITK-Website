import React from 'react';

const NoteBox = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--note-box-bg)', // Background color will adapt based on the mode
        borderLeft: '4px solid var(--note-box-border)', // Border color will adapt based on the mode
        padding: '10px',
        margin: '15px 0',
        borderRadius: '5px',
        fontSize: '1rem',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Optional glossy effect shadow
      }}
    >
      {children}
    </div>
  );
};

export default NoteBox;
