import React from 'react';

const HandleDelete = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="add-button"  onClick={onConfirm}>Yes</button>
        <button className="add-button" onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default HandleDelete;
