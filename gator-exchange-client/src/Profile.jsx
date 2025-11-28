import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Save, Edit, X, Star } from 'lucide-react'
import { getUserRatings } from "./api/ratings";

function Profile() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        averageRating: 0,
        ratingCount: 0
    })
    
    const [ratings, setRatings] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfileData = async () => {
            const email = localStorage.getItem('userEmail')
            const name = localStorage.getItem('userName')
            const userId = localStorage.getItem('userId') 

            if (!email) {
                navigate('/login')
                return
            }
            
            setUserData(prev => ({
                ...prev,
                name: name || '',
                email: email || ''
            }))

            if (userId) {
                try {
                    const ratingsData = await getUserRatings(userId)
                    setRatings(ratingsData)

                    if (ratingsData.length > 0) {
                        const count = ratingsData.length
                        const total = ratingsData.reduce((acc, curr) => acc + curr.rating, 0)
                        setUserData(prev => ({
                            ...prev,
                            ratingCount: count,
                            averageRating: (total / count)
                        }))
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }

        fetchProfileData()
    }, [navigate])

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleEditClick = () => {
        setEditMode(true)
        setError('')
        setSuccess('')
    }

    const handleCancelClick = () => {
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        setUserData(prev => ({
            ...prev,
            name: name || '',
            email: email || ''
        }))
        setNewPassword('')
        setConfirmPassword('')
        setEditMode(false)
        setError('')
        setSuccess('')
    }

    const handleSaveClick = async () => {
        setError('')
        setSuccess('')
        setLoading(true)

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match')
                setLoading(false)
                return
            }
            if (newPassword.length < 6) {
                setError('Password must be at least 6 characters long')
                setLoading(false)
                return
            }
        }

        try {
            const updateData = {
                email: userData.email,
                name: userData.name
            }
            if (newPassword && newPassword.trim() !== '') {
                updateData.password = newPassword
            }

            const response = await axios.put(
                'http://localhost:3001/profile/update', 
                updateData,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (response.data.success) {
                localStorage.setItem('userName', userData.name)
                setSuccess('Profile updated successfully!')
                setEditMode(false)
                setNewPassword('')
                setConfirmPassword('')
                setTimeout(() => setSuccess(''), 3000)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <nav className="navbar navbar-dark" style={{ backgroundColor: '#0021A5' }}>
                <div className="container">
                    <button 
                        className="btn btn-outline-light"
                        onClick={() => navigate('/home')}
                    >
                        <ArrowLeft size={20} className="me-2" />
                        Back to Home
                    </button>
                    <span className="navbar-brand fw-bold">
                        <span style={{ color: '#FA4616' }}>Gator</span> Exchange
                    </span>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                         style={{ width: '100px', height: '100px', backgroundColor: '#0021A5', color: 'white' }}>
                                        <User size={48} />
                                    </div>
                                    <h2 className="fw-bold mb-1">My Profile</h2>
                                    
                                    <div className="mt-2">
                                        {userData.ratingCount > 0 ? (
                                            <span className="badge bg-light text-dark border p-2">
                                                <Star size={16} fill="#f39c12" stroke="#f39c12" className="me-1 mb-1"/>
                                                <strong>{userData.averageRating.toFixed(1)}</strong> ({userData.ratingCount} reviews)
                                            </span>
                                        ) : (
                                            <span className="text-muted small">No ratings yet</span>
                                        )}
                                    </div>
                                </div>

                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}

                                <div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold"><User size={16} className="me-2" />Full Name</label>
                                        <input type="text" className="form-control form-control-lg" name="name" value={userData.name} onChange={handleInputChange} disabled={!editMode} style={editMode ? {} : { backgroundColor: '#f8f9fa' }} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold"><Mail size={16} className="me-2" />UFL Email</label>
                                        <input type="email" className="form-control form-control-lg" value={userData.email} disabled style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                                    </div>

                                    {editMode && (
                                        <>
                                            <hr className="my-4" />
                                            <h5 className="mb-3 fw-semibold">Change Password</h5>
                                            <div className="mb-3">
                                                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            </div>
                                            <div className="mb-4">
                                                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            </div>
                                        </>
                                    )}

                                    <div className="d-grid gap-2">
                                        {!editMode ? (
                                            <button className="btn btn-lg" style={{ backgroundColor: '#FA4616', color: 'white' }} onClick={handleEditClick}>
                                                <Edit size={20} className="me-2" /> Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-lg" style={{ backgroundColor: '#0021A5', color: 'white' }} onClick={handleSaveClick} disabled={loading}>
                                                    <Save size={20} className="me-2" /> Save Changes
                                                </button>
                                                <button className="btn btn-outline-secondary btn-lg" onClick={handleCancelClick} disabled={loading}>
                                                    <X size={20} className="me-2" /> Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-top">
                                    <h6 className="text-muted mb-3">Account Information</h6>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <small className="text-muted d-block">Account Type</small>
                                            <strong>UFL Student</strong>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">Status</small>
                                            <span className="badge bg-success">Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-top">
                                    <h5 className="mb-3 fw-bold">Recent Reviews</h5>
                                    {ratings.length > 0 ? (
                                        <div className="d-flex flex-column gap-3">
                                            {ratings.map((review) => (
                                                <div key={review._id} className="p-3 bg-light rounded border">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <div className="d-flex align-items-center mb-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star 
                                                                        key={i} 
                                                                        size={14} 
                                                                        fill={i < review.rating ? "#f39c12" : "none"} 
                                                                        stroke={i < review.rating ? "#f39c12" : "#ccc"}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="mb-1 small fw-bold">{review.listing?.title || "Item"}</p>
                                                            <p className="mb-1 text-muted small">"{review.comment}"</p>
                                                        </div>
                                                        <small className="text-muted fst-italic">
                                                            - {review.reviewer?.name || "User"}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted fst-italic text-center py-3">
                                            You haven't received any reviews yet.
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile