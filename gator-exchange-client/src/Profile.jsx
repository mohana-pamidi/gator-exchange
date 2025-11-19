import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Save, Eye, EyeOff, Edit, X } from 'lucide-react'

function Profile() {
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    })
    const [editMode, setEditMode] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        
        if (!email) {
            navigate('/login')
            return
        }
        
        setUserData({
            name: name || '',
            email: email || ''
        })
    }, [navigate])

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleEditClick = () => {
        console.log('Edit button clicked, entering edit mode')
        setEditMode(true)
        setError('')
        setSuccess('')
    }

    const handleCancelClick = () => {
        console.log('Cancel button clicked')
        // Reset to original values
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        setUserData({
            name: name || '',
            email: email || ''
        })
        setNewPassword('')
        setConfirmPassword('')
        setEditMode(false)
        setError('')
        setSuccess('')
    }

    const handleSaveClick = async () => {
        console.log('Save button clicked')
        setError('')
        setSuccess('')
        setLoading(true)

        // Validate if changing password
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
            // Prepare update data
            const updateData = {
                email: userData.email,
                name: userData.name
            }

            // Only include password if it's being changed
            if (newPassword && newPassword.trim() !== '') {
                updateData.password = newPassword
            }

            console.log('Sending update request:', updateData)

            const response = await axios.put(
                'http://localhost:3001/profile/update', 
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log('Update response:', response.data)

            if (response.data.success) {
                // Update localStorage with new name
                localStorage.setItem('userName', userData.name)
                
                setSuccess('Profile updated successfully!')
                setEditMode(false)
                setNewPassword('')
                setConfirmPassword('')
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('')
                }, 3000)
            }
        } catch (err) {
            console.error('Update error:', err)
            console.error('Error response:', err.response?.data)
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation Bar */}
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

            {/* Profile Content */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                         style={{ 
                                             width: '100px', 
                                             height: '100px', 
                                             backgroundColor: '#0021A5',
                                             color: 'white'
                                         }}>
                                        <User size={48} />
                                    </div>
                                    <h2 className="fw-bold mb-1">My Profile</h2>
                                    <p className="text-muted">Manage your account information</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        {success}
                                        <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                                    </div>
                                )}

                                {/* Profile Form - NOT wrapped in <form> to prevent accidental submission */}
                                <div>
                                    {/* Name Field */}
                                    <div className="mb-4">
                                        <label htmlFor="name" className="form-label fw-semibold">
                                            <User size={16} className="me-2" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="name"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            required
                                            style={editMode ? {} : { backgroundColor: '#f8f9fa' }}
                                        />
                                    </div>

                                    {/* Email Field (Read-only - Username) */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            <Mail size={16} className="me-2" />
                                            UFL Email (Username)
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            name="email"
                                            value={userData.email}
                                            disabled
                                            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                        />
                                        <small className="text-muted">
                                            ⚠️ Email cannot be changed as it's your username
                                        </small>
                                    </div>

                                    {/* Password Section - Only show in edit mode */}
                                    {editMode && (
                                        <>
                                            <hr className="my-4" />
                                            <h5 className="mb-3 fw-semibold">Change Password (Optional)</h5>
                                            <p className="text-muted small mb-3">
                                                Leave these fields blank if you don't want to change your password.
                                            </p>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label fw-semibold">
                                                    <Lock size={16} className="me-2" />
                                                    New Password
                                                </label>
                                                <div className="position-relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="form-control form-control-lg"
                                                        id="newPassword"
                                                        placeholder="Enter new password (optional)"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{ textDecoration: 'none', zIndex: 10 }}
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                                    <Lock size={16} className="me-2" />
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control form-control-lg"
                                                    id="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-grid gap-2">
                                        {!editMode ? (
                                            <button
                                                type="button"
                                                className="btn btn-lg"
                                                style={{ backgroundColor: '#FA4616', color: 'white', borderColor: '#FA4616' }}
                                                onClick={handleEditClick}
                                            >
                                                <Edit size={20} className="me-2" />
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-lg"
                                                    style={{ backgroundColor: '#0021A5', color: 'white', borderColor: '#0021A5' }}
                                                    disabled={loading}
                                                    onClick={handleSaveClick}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={20} className="me-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-lg"
                                                    onClick={handleCancelClick}
                                                    disabled={loading}
                                                >
                                                    <X size={20} className="me-2" />
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Account Info */}
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
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile