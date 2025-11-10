import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ItemDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        if (!email) {
            navigate('/login')
            return
        }
        setUserEmail(email)
        setUserName(name || '')
        
        fetchItemDetails()
    }, [id])

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/items/${id}`)
            setItem(response.data)
        } catch (error) {
            console.error('Error fetching item details:', error)
            alert('Failed to load item details')
        } finally {
            setLoading(false)
        }
    }

    const handleRentItem = () => {
        if (!item) return

        // don't allow users to message themselves
        if (userEmail === item.ownerEmail) {
            alert('You cannot rent your own item')
            return
        }

        // navigate to messages page (messaging feature to be implemented)
        navigate('/messages', {
            state: {
                ownerEmail: item.ownerEmail,
                ownerName: item.ownerName,
                itemId: item._id,
                itemName: item.name
            }
        })
    }

    const nextImage = () => {
        if (item && item.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
        }
    }

    const prevImage = () => {
        if (item && item.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">Item not found</div>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>
                    Back to Home
                </button>
            </div>
        )
    }

    return (
        <div className="container mt-4 mb-5">
            <button className="btn btn-outline-primary mb-3" onClick={() => navigate('/home')}>
                ← Back to Listings
            </button>

            <div className="row">
                {/* Image Carousel */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="position-relative">
                            {item.images && item.images.length > 0 ? (
                                <>
                                    <img
                                        src={item.images[currentImageIndex].url}
                                        alt={item.name}
                                        className="card-img-top"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    
                                    {item.images.length > 1 && (
                                        <>
                                            <button
                                                className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                                                onClick={prevImage}
                                                style={{ opacity: 0.7 }}
                                            >
                                                ‹
                                            </button>
                                            <button
                                                className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                                                onClick={nextImage}
                                                style={{ opacity: 0.7 }}
                                            >
                                                ›
                                            </button>
                                            
                                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                                                <span className="badge bg-dark">
                                                    {currentImageIndex + 1} / {item.images.length}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div 
                                    className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                    style={{ height: '400px' }}
                                >
                                    <span className="text-muted">No image available</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnail strip */}
                        {item.images && item.images.length > 1 && (
                            <div className="card-body">
                                <div className="d-flex gap-2 overflow-auto">
                                    {item.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`img-thumbnail ${index === currentImageIndex ? 'border-primary' : ''}`}
                                            style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                borderWidth: index === currentImageIndex ? '3px' : '1px'
                                            }}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Item Details */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">{item.name}</h2>
                            
                            <div className="mb-3">
                                <h3 className="text-primary">${item.hourlyRate}/hour</h3>
                            </div>

                            <div className="mb-3">
                                <h5>Description</h5>
                                <p className="card-text">{item.description}</p>
                            </div>

                            <div className="mb-3">
                                <h5>Availability</h5>
                                <p className="card-text">
                                    <strong>From:</strong> {formatDate(item.availableDates.startDate)}<br />
                                    <strong>Until:</strong> {formatDate(item.availableDates.endDate)}
                                </p>
                            </div>

                            <div className="mb-3">
                                <h5>Owner</h5>
                                <p className="card-text">
                                    <strong>{item.ownerName || 'Unknown'}</strong><br />
                                    <small className="text-muted">{item.ownerEmail}</small>
                                </p>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    Listed on: {formatDate(item.createdAt)}
                                </small>
                            </div>

                            {userEmail !== item.ownerEmail && (
                                <button 
                                    className="btn btn-success btn-lg w-100"
                                    onClick={handleRentItem}
                                >
                                    <i className="bi bi-chat-dots me-2"></i>
                                    Rent this item
                                </button>
                            )}

                            {userEmail === item.ownerEmail && (
                                <div className="alert alert-info">
                                    This is your listing
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemDetail
