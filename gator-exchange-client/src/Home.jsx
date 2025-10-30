import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Home()
{
    const location = useLocation()
    const navigate = useNavigate()
    const userName = location.state?.userName || 'User'
    const userId = location.state?.userId

    const goToProfile = () => {
        navigate('/profile', { state: { userId } })
    }

    return(
        <div className="container-fluid vh-100">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Gator Exchange</a>
                    <div className="d-flex align-items-center">
                        <span className="me-3">Welcome, <strong>{userName}</strong></span>
                        <button 
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={goToProfile}
                        >
                            <i className="bi bi-person-circle me-1"></i>
                            My Profile
                        </button>
                        <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => navigate('/login')}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-body text-center py-5">
                                <h1 className="display-4 mb-4">Welcome to Gator Exchange!</h1>
                                <p className="lead text-muted mb-4">
                                    Your marketplace for buying and selling items within the UF community
                                </p>
                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-primary btn-lg">
                                        Browse Items
                                    </button>
                                    <button className="btn btn-success btn-lg">
                                        Post Item
                                    </button>
                                    <button 
                                        className="btn btn-info btn-lg"
                                        onClick={goToProfile}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;