import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Star } from 'lucide-react'
import { createRating, getItemRatings } from "./api/ratings";

function ItemDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' })
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        const id = localStorage.getItem('userId')

        setUserEmail(email || '')
        setUserName(name || '')
        setUserId(id || '')
        
        fetchItemDetails()
        fetchReviews()
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

    const fetchReviews = async () => {
        try {
            const data = await getItemRatings(id)
            setReviews(data)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            setReviewMessage({ type: 'danger', text: 'Please select a rating.' })
            return
        }
        setIsSubmittingReview(true)
        setReviewMessage({ type: '', text: '' })

        try {
            await createRating({
                listingId: item._id,
                rating,
                comment
            })
            setReviewMessage({ type: 'success', text: 'Review submitted successfully!' })
            setRating(0)
            setComment('')
            fetchItemDetails()
            fetchReviews()
        } catch (error) {
            const errorMessage = error.msg || error.message || 'Failed to submit review.'
            setReviewMessage({ type: 'danger', text: errorMessage })
        } finally {
            setIsSubmittingReview(false)
        }
    }

    const handleRentItem = () => {
        if (!item) return
        if (userEmail === item.ownerEmail) {
            alert('You cannot rent your own item')
            return
        }
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
            year: 'numeric', month: 'short', day: 'numeric'
        })
    }

    if (loading) return <div className="container mt-5 text-center">Loading...</div>
    if (!item) return <div className="container mt-5">Item not found</div>

    const ownerId = item.owner?._id || item.owner;
    const isOwner = userId === ownerId;

    return (
        <div className="container mt-4 mb-5">
            <button className="btn btn-outline-primary mb-3" onClick={() => navigate('/home')}>
                ← Back to Listings
            </button>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="position-relative">
                            {item.images && item.images.length > 0 ? (
                                <img src={item.images[currentImageIndex].url} alt={item.name} className="card-img-top" style={{ height: '400px', objectFit: 'cover' }} />
                            ) : (
                                <div className="card-img-top bg-light" style={{ height: '400px' }}>No Image</div>
                            )}
                            {item.images && item.images.length > 1 && (
                                <>
                                    <button className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2" onClick={prevImage} style={{ opacity: 0.7 }}>‹</button>
                                    <button className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2" onClick={nextImage} style={{ opacity: 0.7 }}>›</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">{item.name}</h2>
                            <h3 className="text-primary mb-3">${item.hourlyRate}/hour</h3>
                            
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
                                    <span 
                                        onClick={() => navigate(`/profile/${item.owner._id}`)} 
                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0021A5' }}
                                    >
                                        <strong>{item.ownerName || 'Unknown'}</strong>
                                    </span>

                                    
                                    {item.owner && item.owner.ratingCount > 0 ? (
                                        <span className="ms-2">
                                            <Star size={16} fill="#f39c12" stroke="#f39c12" style={{ display: 'inline', marginTop: '-4px' }}/> 
                                            <span className="fw-bold ms-1">{item.owner.averageRating?.toFixed(1)}</span>
                                            <span className="text-muted ms-1 small">({item.owner.ratingCount})</span>
                                        </span>
                                    ) : (
                                        <span className="ms-2 small text-muted fst-italic">
                                            (No reviews yet)
                                        </span>
                                    )}
                                    
                                    <br />
                                    <strong> {item.owner.isOrganization ? 'Organization' : 'UFL Student'}</strong>
                                    <br />
                                    <small> {item.ownerEmail}</small>
                                </p>
                            </div>

                            {!isOwner && (
                                <button className="btn btn-success btn-lg w-100 mb-4" onClick={handleRentItem}>
                                    <i className="bi bi-chat-dots me-2"></i> Rent this item
                                </button>
                            )}

                            {isOwner && (
                                <div className="alert alert-info">This is your listing</div>
                            )}

                            {userId && !isOwner && (
                                <div className="card mt-4">
                                    <div className="card-body bg-light">
                                        <h5 className="card-title">Leave a Review</h5>
                                        {reviewMessage.text && (
                                            <div className={`alert alert-${reviewMessage.type} py-2`}>{reviewMessage.text}</div>
                                        )}
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="mb-3">
                                                <label className="form-label">Your Rating</label>
                                                <div className="d-flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star} size={24} className="me-1" style={{ cursor: 'pointer' }}
                                                            fill={(hoverRating || rating) >= star ? '#f39c12' : 'none'}
                                                            stroke={(hoverRating || rating) >= star ? '#f39c12' : '#6c757d'}
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <textarea 
                                                    className="form-control" rows="3" placeholder="Write a comment..."
                                                    value={comment} onChange={(e) => setComment(e.target.value)} disabled={isSubmittingReview}
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary" disabled={isSubmittingReview || rating === 0}>
                                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h4 className="mb-0">Recent Reviews</h4>
                        </div>
                        <div className="card-body">
                            {reviews.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="list-group-item px-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className="fw-bold me-2"
                                                        onClick={() => review.reviewer && navigate(`/profile/${review.reviewer._id}`)}
                                                        style={{ 
                                                            cursor: review.reviewer ? 'pointer' : 'default',
                                                            color: review.reviewer ? '#0021A5' : 'inherit',
                                                            textDecoration: review.reviewer ? 'underline' : 'none'
                                                        }}
                                                    >
                                                        {review.reviewer?.name || 'User'}
                                                    </div>
                                                    
                                                    <div className="d-flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} size={14} 
                                                                fill={i < review.rating ? "#f39c12" : "none"} 
                                                                stroke={i < review.rating ? "#f39c12" : "#ccc"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <p className="mb-0 text-muted">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted fst-italic mb-0">No reviews yet. Be the first to rent and review!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemDetail