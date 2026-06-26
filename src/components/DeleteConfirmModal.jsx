import React from 'react';
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import '../css/vehicle/VehicleModal.css';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  vehicleName = 'this vehicle'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="delete-title">Delete Vehicle</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <FaExclamationTriangle className="warning-icon" />
            <h3>Are you sure?</h3>
            <p>
              You are about to delete <strong>"{vehicleName}"</strong>.
            </p>
            <p className="warning-text">
              This action cannot be undone. All data associated with this vehicle will be permanently removed.
            </p>
          </div>
        </div>

        <div className="modal-footer delete-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : 'Delete Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;