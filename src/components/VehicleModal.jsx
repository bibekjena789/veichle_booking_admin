import React, { useState, useEffect } from 'react';
import '../css/vehicle/VehicleModal.css';
import { FaSpinner, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import vehicleService from '../api/vehicles';

const VehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  amenities = [],
  vehicle = null,
  title = 'Vehicle',
  submitText = 'Submit',
  isViewMode = false,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState({
    veichle_name: '',
    veichle_description: '',
    price_per_km: '',
    total_number_of_sheat: '',
    veichle_number: '',
    compeny_name: '',
    is_active: true,
    amenities: [],
    images: []
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        veichle_name: vehicle.veichle_name || '',
        veichle_description: vehicle.veichle_description || '',
        price_per_km: vehicle.price_per_km || '',
        total_number_of_sheat: vehicle.total_number_of_sheat || '',
        veichle_number: vehicle.veichle_number || '',
        compeny_name: vehicle.compeny_name || '',
        is_active: vehicle.is_active !== undefined ? vehicle.is_active : true,
        amenities: vehicle.amenities?.map(a => a.id) || [],
        images: []
      });
      setSelectedAmenities(vehicle.amenities?.map(a => a.id) || []);
      
      if (vehicle.images) {
        setPreviewImages(vehicle.images.map(img => ({
          id: img.id,
          url: img.image,
          isExisting: true
        })));
      }
    } else {
      resetForm();
    }
  }, [vehicle, isOpen]);

  const resetForm = () => {
    setFormData({
      veichle_name: '',
      veichle_description: '',
      price_per_km: '',
      total_number_of_sheat: '',
      veichle_number: '',
      compeny_name: '',
      is_active: true,
      amenities: [],
      images: []
    });
    setSelectedAmenities([]);
    setPreviewImages([]);
    setDeleteImageIds([]);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      is_active: value === 'active'
    }));
    if (errors.is_active) {
      setErrors(prev => ({ ...prev, is_active: null }));
    }
  };

  // Quick status toggle for view mode
  const handleQuickStatusToggle = async () => {
    if (!vehicle) return;
    
    setIsUpdatingStatus(true);
    try {
      const formData = new FormData();
      formData.append('is_active', !formData.is_active ? 'true' : 'false');
      
      const result = await vehicleService.updateVehicle(vehicle.id, formData);
      if (result.success) {
        // Update the local state
        setFormData(prev => ({
          ...prev,
          is_active: !prev.is_active
        }));
        // Refresh the vehicle data
        if (onSubmit) {
          // Call a refresh callback if provided
          onSubmit({ is_active: !formData.is_active });
        }
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenityId)) {
        return prev.filter(id => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    
    setPreviewImages(prev => [...prev, ...newImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    const image = previewImages[index];
    if (image.isExisting && image.id) {
      setDeleteImageIds(prev => [...prev, image.id]);
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return; // Don't submit in view mode
    
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.veichle_name) newErrors.veichle_name = 'Vehicle name is required';
    if (!formData.price_per_km) newErrors.price_per_km = 'Price per km is required';
    if (!formData.total_number_of_sheat) newErrors.total_number_of_sheat = 'Number of seats is required';
    if (!formData.veichle_number) newErrors.veichle_number = 'Vehicle number is required';
    if (!formData.compeny_name) newErrors.compeny_name = 'Company name is required';
    if (selectedAmenities.length < 2) newErrors.amenities = 'Minimum 2 amenities are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(file => {
          submitData.append('images', file);
        });
      } else if (key === 'amenities') {
        selectedAmenities.forEach(id => {
          submitData.append('amenities', id);
        });
      } else if (key === 'is_active') {
        submitData.append(key, formData[key] ? 'true' : 'false');
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (deleteImageIds.length > 0) {
      deleteImageIds.forEach(id => {
        submitData.append('delete_image_ids', id);
      });
    }

    const result = await onSubmit(submitData);
    if (result && result.errors) {
      setErrors(result.errors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isViewMode ? 'view-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isViewMode ? 'Vehicle Details' : title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Status Banner - Always visible in View Mode */}
            {isViewMode && (
              <div className="status-banner">
                <div className="status-banner-content">
                  <div className="status-display">
                    <span className="status-label">Current Status:</span>
                    <span className={`status-value ${formData.is_active ? 'active' : 'inactive'}`}>
                      {formData.is_active ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  {/* Status toggle button - Always visible in view mode */}
                  <button
                    type="button"
                    className={`status-toggle-btn ${formData.is_active ? 'active' : 'inactive'}`}
                    onClick={handleQuickStatusToggle}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <FaSpinner className="spinner-small" />
                    ) : (
                      <>
                        {formData.is_active ? (
                          <>
                            <FaTimesCircle /> Mark as Inactive
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Mark as Active
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
                <p className="status-hint">
                  {formData.is_active 
                    ? 'This vehicle is currently available for bookings' 
                    : 'This vehicle is currently unavailable for bookings'}
                </p>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Name {!isViewMode && '*'}</label>
                {isViewMode ? (
                  <p className="view-value">{formData.veichle_name || 'N/A'}</p>
                ) : (
                  <input
                    type="text"
                    name="veichle_name"
                    value={formData.veichle_name}
                    onChange={handleChange}
                    placeholder="Enter vehicle name"
                    className={errors.veichle_name ? 'error' : ''}
                  />
                )}
                {errors.veichle_name && <span className="error-text">{errors.veichle_name}</span>}
              </div>

              <div className="form-group">
                <label>Company Name {!isViewMode && '*'}</label>
                {isViewMode ? (
                  <p className="view-value">{formData.compeny_name || 'N/A'}</p>
                ) : (
                  <input
                    type="text"
                    name="compeny_name"
                    value={formData.compeny_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className={errors.compeny_name ? 'error' : ''}
                  />
                )}
                {errors.compeny_name && <span className="error-text">{errors.compeny_name}</span>}
              </div>

              <div className="form-group">
                <label>Vehicle Number {!isViewMode && '*'}</label>
                {isViewMode ? (
                  <p className="view-value">{formData.veichle_number || 'N/A'}</p>
                ) : (
                  <input
                    type="text"
                    name="veichle_number"
                    value={formData.veichle_number}
                    onChange={handleChange}
                    placeholder="e.g., KA01AB1234"
                    className={errors.veichle_number ? 'error' : ''}
                  />
                )}
                {errors.veichle_number && <span className="error-text">{errors.veichle_number}</span>}
              </div>

              <div className="form-group">
                <label>Price per KM (₹) {!isViewMode && '*'}</label>
                {isViewMode ? (
                  <p className="view-value">₹{formData.price_per_km || '0'}</p>
                ) : (
                  <input
                    type="number"
                    name="price_per_km"
                    value={formData.price_per_km}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={errors.price_per_km ? 'error' : ''}
                  />
                )}
                {errors.price_per_km && <span className="error-text">{errors.price_per_km}</span>}
              </div>

              <div className="form-group">
                <label>Number of Seats {!isViewMode && '*'}</label>
                {isViewMode ? (
                  <p className="view-value">{formData.total_number_of_sheat || '0'}</p>
                ) : (
                  <input
                    type="number"
                    name="total_number_of_sheat"
                    value={formData.total_number_of_sheat}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    className={errors.total_number_of_sheat ? 'error' : ''}
                  />
                )}
                {errors.total_number_of_sheat && <span className="error-text">{errors.total_number_of_sheat}</span>}
              </div>

              {/* Status Field - Only for Admin in Edit Mode */}
              {!isViewMode && isAdmin && (
                <div className="form-group">
                  <label>Status *</label>
                  <div className="status-toggle-group">
                    <button
                      type="button"
                      className={`status-toggle-btn active ${formData.is_active ? 'selected' : ''}`}
                      onClick={() => handleStatusChange('active')}
                    >
                      <FaCheckCircle className="status-icon" />
                      Active
                    </button>
                    <button
                      type="button"
                      className={`status-toggle-btn inactive ${!formData.is_active ? 'selected' : ''}`}
                      onClick={() => handleStatusChange('inactive')}
                    >
                      <FaTimesCircle className="status-icon" />
                      Inactive
                    </button>
                  </div>
                  {errors.is_active && <span className="error-text">{errors.is_active}</span>}
                  <small className="status-hint">
                    <FaCheckCircle className="hint-icon" /> 
                    {formData.is_active ? 'Vehicle is currently active and available' : 'Vehicle is currently inactive and unavailable'}
                  </small>
                </div>
              )}

              {/* Status Display for View Mode */}
              {isViewMode && (
                <div className="form-group">
                  <label>Status</label>
                  <p className={`view-value status-display-text ${formData.is_active ? 'active' : 'inactive'}`}>
                    {formData.is_active ? '🟢 Active' : '🔴 Inactive'}
                  </p>
                </div>
              )}

              <div className="form-group full-width">
                <label>Description</label>
                {isViewMode ? (
                  <p className="view-value description">{formData.veichle_description || 'No description provided'}</p>
                ) : (
                  <textarea
                    name="veichle_description"
                    value={formData.veichle_description}
                    onChange={handleChange}
                    placeholder="Vehicle description"
                    rows="3"
                  />
                )}
              </div>

              <div className="form-group full-width">
                <label>Amenities {!isViewMode && '* (Minimum 2)'}</label>
                {isViewMode ? (
                  <div className="view-amenities">
                    {formData.amenities && formData.amenities.length > 0 ? (
                      selectedAmenities.map((id) => {
                        const amenity = amenities.find(a => a.id === id);
                        return amenity ? (
                          <span key={id} className="amenity-tag">{amenity.amenity}</span>
                        ) : null;
                      })
                    ) : (
                      <p className="view-value">No amenities</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="amenities-grid">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.id}
                          type="button"
                          className={`amenity-chip ${selectedAmenities.includes(amenity.id) ? 'selected' : ''}`}
                          onClick={() => handleAmenityToggle(amenity.id)}
                        >
                          {selectedAmenities.includes(amenity.id) ? '✓' : ''} {amenity.amenity}
                        </button>
                      ))}
                    </div>
                    {errors.amenities && <span className="error-text">{errors.amenities}</span>}
                  </>
                )}
              </div>

              <div className="form-group full-width">
                <label>Vehicle Images</label>
                {isViewMode ? (
                  <div className="view-images">
                    {previewImages.length > 0 ? (
                      <div className="image-preview-grid">
                        {previewImages.map((img, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={img.url} alt={`Vehicle ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="view-value">No images</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="image-upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                      <div className="upload-placeholder">
                        <FaPlus />
                        <p>Upload Images (Max 10, 3MB each)</p>
                      </div>
                    </div>
                    {previewImages.length > 0 && (
                      <div className="image-preview-grid">
                        {previewImages.map((img, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={img.url} alt={`Vehicle ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : submitText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;