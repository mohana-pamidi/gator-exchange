import React from 'react'

function ItemCard({ item }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <div className="card h-100" style={{ width: '300px' }}>
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
                            Listed by: {item.ownerEmail}
                        </small>
                    </p>
                    {item.images && item.images.length > 1 && (
                        <p className="card-text">
                            <small className="text-muted">
                                +{item.images.length - 1} more images
                            </small>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ItemCard