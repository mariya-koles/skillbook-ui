import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, message, buttonText = 'OK', children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {title && <h2 className="modal-title">{title}</h2>}
                {children}
                {buttonText && (
                    <button className="modal-button" onClick={onClose}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Modal; 