import React from 'react'
import { useNavigate } from 'react-router-dom'

function ItemCard({ item, userEmail, onEdit, onDelete }) {
    const navigate = useNavigate()
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    const isOwner = userEmail === item.ownerEmail

    const handleCardClick = () => {
        navigate(`/item/${item._id}`)
    }

    const handleEdit = (e) => {
        e.stopPropagation() // prevent card click
        onEdit(item)
    }

    const handleDelete = (e) => {
        e.stopPropagation() // prevent card click
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            onDelete(item._id)
        }
    }

    return (
        <div 
            className="card h-100" 
            style={{ width: '300px', cursor: 'pointer' }}
            onClick={handleCardClick}
        >
            {item.images && item.images.length > 0 && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                        src={item.images[0].url} 
                        className="card-img-top" 
                        alt={item.name}
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                        }}
                    />
                </div>
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text flex-grow-1">{item.description}</p>
                <div className="mt-auto">
                    <p className="card-text">
                        <strong>${item.hourlyRate}/hour</strong>
                    </p>
                    <p className="card-text">
                        <small className="text-muted">
                            Available: {formatDate(item.availableDates.startDate)} - {formatDate(item.availableDates.endDate)}
                        </small>
                    </p>
                    <p className="card-text">
                        <small className="text-muted">
                            Listed by: {item.ownerName}
                        </small>
                    </p>
                    {item.images && item.images.length > 1 && (
                        <p className="card-text">
                            <small className="text-muted">
                                +{item.images.length - 1} more images
                            </small>
                        </p>
                    )}
                    
                    {isOwner && (
                        <div className="d-flex gap-2 mt-2">
                            <button 
                                className="btn btn-sm btn-outline-primary flex-grow-1"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger flex-grow-1"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ItemCard