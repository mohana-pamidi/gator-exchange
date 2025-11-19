import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Shield, Users } from 'lucide-react'

function LandingPage() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
                <div className="container">
                    <a className="navbar-brand fw-bold fs-4" href="/">
                        Gator Exchange
                    </a>
                    
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button 
                            className="btn btn-primary"
                            style={{ backgroundColor: '#0021A5', borderColor: '#0021A5' }}
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-light py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h1 className="display-3 fw-bold mb-4" style={{ color: '#0021A5' }}>
                                Gator Exchange
                            </h1>
                            <p className="lead text-muted mb-4">
                                A way for college students to rent equipment and save effort from buying expensive items.
                            </p>
                            <button 
                                className="btn btn-dark btn-lg px-4"
                                onClick={() => navigate('/register')}
                            >
                                Create Account
                            </button>
                        </div>
                        <div className="col-lg-6">
                            <div className="text-center">
                                <img 
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop" 
                                    alt="DJ Equipment"
                                    className="img-fluid rounded shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Listings Section */}
            <div className="container py-5">
                <h2 className="fw-bold mb-4">Featured Listings</h2>
                <div className="row g-4">
                    {/* Sample Featured Items */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop" 
                                className="card-img-top" 
                                alt="Camera"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Subheading</h5>
                                <p className="card-text text-muted">
                                    Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop" 
                                className="card-img-top" 
                                alt="Audio Equipment"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Subheading</h5>
                                <p className="card-text text-muted">
                                    Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" 
                                className="card-img-top" 
                                alt="DJ Equipment"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Subheading</h5>
                                <p className="card-text text-muted">
                                    Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-light py-5">
                <div className="container">
                    <h2 className="fw-bold mb-5 text-center">Reviews</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <p className="card-text mb-3">"A worthy place of praise"</p>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }}></div>
                                        <div className="ms-3">
                                            <div className="fw-semibold">Name Surname</div>
                                            <small className="text-muted">Position, Company name</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <p className="card-text mb-3">"A fantastic bit of feedback"</p>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }}></div>
                                        <div className="ms-3">
                                            <div className="fw-semibold">Name Surname</div>
                                            <small className="text-muted">Position, Company name</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <p className="card-text mb-3">"A genuinely glowing review"</p>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }}></div>
                                        <div className="ms-3">
                                            <div className="fw-semibold">Name Surname</div>
                                            <small className="text-muted">Position, Company name</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization Login Section */}
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <h2 className="fw-bold mb-3">Organization Login</h2>
                        <p className="text-muted">Gator Exchange</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <button 
                            className="btn btn-dark me-2"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button 
                            className="btn btn-outline-dark"
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 mb-3 mb-md-0">
                            <h5>Gator Exchange</h5>
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-6 col-md-3">
                                    <h6>Topic</h6>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                    </ul>
                                </div>
                                <div className="col-6 col-md-3">
                                    <h6>Topic</h6>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                    </ul>
                                </div>
                                <div className="col-6 col-md-3">
                                    <h6>Topic</h6>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                    </ul>
                                </div>
                                <div className="col-6 col-md-3">
                                    <h6>Topic</h6>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                        <li><a href="#" className="text-white-50 text-decoration-none">Page</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage