import React, { useState, useEffect } from 'react';
import '../css/vehicle/VehicleModal.css';
import { FaSpinner , FaPlus } from "react-icons/fa";
const VehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  amenities = [],
  vehicle = null,
  title = 'Vehicle',
  submitText = 'Submit'
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Name *</label>
                <input
                  type="text"
                  name="veichle_name"
                  value={formData.veichle_name}
                  onChange={handleChange}
                  placeholder="Enter vehicle name"
                  className={errors.veichle_name ? 'error' : ''}
                />
                {errors.veichle_name && <span className="error-text">{errors.veichle_name}</span>}
              </div>

              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="compeny_name"
                  value={formData.compeny_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={errors.compeny_name ? 'error' : ''}
                />
                {errors.compeny_name && <span className="error-text">{errors.compeny_name}</span>}
              </div>

              <div className="form-group">
                <label>Vehicle Number *</label>
                <input
                  type="text"
                  name="veichle_number"
                  value={formData.veichle_number}
                  onChange={handleChange}
                  placeholder="e.g., KA01AB1234"
                  className={errors.veichle_number ? 'error' : ''}
                />
                {errors.veichle_number && <span className="error-text">{errors.veichle_number}</span>}
              </div>

              <div className="form-group">
                <label>Price per KM (₹) *</label>
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
                {errors.price_per_km && <span className="error-text">{errors.price_per_km}</span>}
              </div>

              <div className="form-group">
                <label>Number of Seats *</label>
                <input
                  type="number"
                  name="total_number_of_sheat"
                  value={formData.total_number_of_sheat}
                  onChange={handleChange}
                  placeholder="4"
                  min="1"
                  className={errors.total_number_of_sheat ? 'error' : ''}
                />
                {errors.total_number_of_sheat && <span className="error-text">{errors.total_number_of_sheat}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="veichle_description"
                  value={formData.veichle_description}
                  onChange={handleChange}
                  placeholder="Vehicle description"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Amenities * (Minimum 2)</label>
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
              </div>

              <div className="form-group full-width">
                <label>Vehicle Images</label>
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
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active Vehicle
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;