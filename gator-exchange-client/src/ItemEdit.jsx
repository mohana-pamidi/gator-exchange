import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ItemEdit({ show, onClose, userEmail, item }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        hourlyRate: '',
        startDate: '',
        endDate: ''
    })
    const [existingImages, setExistingImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState([])

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description,
                hourlyRate: item.hourlyRate,
                startDate: item.availableDates.startDate.split('T')[0],
                endDate: item.availableDates.endDate.split('T')[0]
            })
            setExistingImages(item.images || [])
        }
    }, [item])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const totalImages = existingImages.length + files.length
        
        if (totalImages > 10) {
            alert('Maximum 10 images allowed in total')
            return
        }

        setNewImages(files)
        
        // create preview URLs
        const previewUrls = files.map(file => URL.createObjectURL(file))
        setPreview(previewUrls)
    }

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index))
    }

    const removeNewImage = (index) => {
        const updatedNewImages = newImages.filter((_, i) => i !== index)
        const updatedPreview = preview.filter((_, i) => i !== index)
        setNewImages(updatedNewImages)
        setPreview(updatedPreview)
        
        // update file input
        const fileInput = document.getElementById('edit-images')
        if (fileInput) {
            const dt = new DataTransfer()
            updatedNewImages.forEach(file => dt.items.add(file))
            fileInput.files = dt.files
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataToSend = new FormData()
            
            // add form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key])
            })
            
            // add user email
            formDataToSend.append('ownerEmail', userEmail)
            
            // add existing images as JSON string
            formDataToSend.append('existingImages', JSON.stringify(existingImages))
            
            // add new images
            newImages.forEach(image => {
                formDataToSend.append('images', image)
            })

            const response = await axios.put(
                `http://localhost:3001/api/items/${item._id}`, 
                formDataToSend, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (response.data.success) {
                alert('Item updated successfully!')
                // reset form
                setFormData({
                    name: '',
                    description: '',
                    hourlyRate: '',
                    startDate: '',
                    endDate: ''
                })
                setExistingImages([])
                setNewImages([])
                setPreview([])
                onClose()
            }
        } catch (error) {
            console.error('Error updating listing:', error)
            if (error.response) {
                alert(`Failed to update listing: ${error.response.data.error || error.response.statusText}`)
            } else {
                alert('Failed to update listing. Please check your connection and try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (!show || !item) return null

    return (
        <div className="modal-overlay" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px', 
                width: '90%', 
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Edit Your Item</h3>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={onClose}
                        style={{ border: 'none', background: 'none', fontSize: '20px' }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Item Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description *</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($) *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="hourlyRate"
                            name="hourlyRate"
                            step="0.01"
                            min="0"
                            value={formData.hourlyRate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="startDate" className="form-label">Available From *</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="endDate" className="form-label">Available Until *</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Current Images:</label>
                            <div className="d-flex flex-wrap gap-2">
                                {existingImages.map((image, index) => (
                                    <div key={index} className="position-relative">
                                        <img 
                                            src={image.url} 
                                            alt={`Existing ${index + 1}`}
                                            style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                objectFit: 'cover', 
                                                borderRadius: '5px' 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute"
                                            style={{ 
                                                top: '-5px', 
                                                right: '-5px', 
                                                width: '20px', 
                                                height: '20px',
                                                padding: '0',
                                                fontSize: '12px'
                                            }}
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    <div className="mb-3">
                        <label htmlFor="edit-images" className="form-label">
                            Add New Images (Max {10 - existingImages.length} more)
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="edit-images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {preview.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">New Image Preview:</label>
                            <div className="d-flex flex-wrap gap-2">
                                {preview.map((url, index) => (
                                    <div key={index} className="position-relative">
                                        <img 
                                            src={url} 
                                            alt={`New Preview ${index + 1}`}
                                            style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                objectFit: 'cover', 
                                                borderRadius: '5px' 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute"
                                            style={{ 
                                                top: '-5px', 
                                                right: '-5px', 
                                                width: '20px', 
                                                height: '20px',
                                                padding: '0',
                                                fontSize: '12px'
                                            }}
                                            onClick={() => removeNewImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ItemEdit
