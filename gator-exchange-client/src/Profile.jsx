import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:3001/profile/${userId}`)
            .then(result => {
                setUserData({
                    name: result.data.name,
                    email: result.data.email,
                    password: '' // Don't display password
                });
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setMessage({ type: 'danger', text: 'Failed to load profile data' });
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleUpdate = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate passwords match if changing password
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'danger', text: 'Passwords do not match!' });
            return;
        }

        // Prepare update data
        const updateData = {
            email: userData.email
        };

        // Only include password if it's being changed
        if (newPassword) {
            updateData.password = newPassword;
        }

        axios.put(`http://localhost:3001/profile/${userId}`, updateData)
            .then(result => {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                setNewPassword('');
                setConfirmPassword('');
                // Update local state with new data
                setUserData({
                    ...userData,
                    email: result.data.user.email
                });
            })
            .catch(err => {
                console.log(err);
                setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
            });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: '', text: '' });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Profile Settings</h3>
                        </div>
                        <div className="card-body p-4">
                            {message.text && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                    {message.text}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setMessage({ type: '', text: '' })}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleUpdate}>
                                {/* Username - Read Only */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <i className="bi bi-person-fill me-2"></i>Username
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={userData.name}
                                        disabled
                                    />
                                    <small className="text-muted">Username cannot be changed</small>
                                </div>

                                {/* Email - Editable */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <i className="bi bi-envelope-fill me-2"></i>Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                                {/* Password Change Section */}
                                {isEditing && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="bi bi-lock-fill me-2"></i>New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Leave blank to keep current password"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">
                                                <i className="bi bi-lock-fill me-2"></i>Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="d-flex gap-2 justify-content-end">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => navigate('/home')}
                                            >
                                                Back to Home
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Profile
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                            >
                                                Save Changes
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;