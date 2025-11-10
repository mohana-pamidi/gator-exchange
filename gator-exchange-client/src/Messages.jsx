import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Messages() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        if (!email) {
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="container mt-5">
            <div className="text-center">
                {/* temporary placeholder for Messages page */}
                <h2>Direct Messaging</h2>
                <div className="alert alert-info mt-4" role="alert">
                    <h4 className="alert-heading">Coming Soon!</h4>
                    <p>The messaging feature is currently under development.</p>
                </div>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/home')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    )
}

export default Messages
