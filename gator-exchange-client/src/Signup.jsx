import { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showResend, setShowResend] = useState(false)
    const [resendMessage, setResendMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setShowResend(false)
        setResendMessage('')

        // Client-side validation for UFL email
        if (!email.endsWith('@ufl.edu')) {
            setError('Please use your UFL GatorMail (@ufl.edu)')
            return
        }

        axios.post('http://localhost:3001/register', {name, email, password})
        .then(result => {
            console.log(result)
            if (result.data.success) {
                setSuccess(result.data.message)
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
        })
        .catch(err => {
            console.log(err)
            const errorData = err.response?.data
            
            if (errorData?.needsVerification) {
                setError(errorData.message)
                setShowResend(true)
            } else {
                setError(errorData?.message || 'Registration failed. Please try again.')
            }
        })
    }

    const handleResendVerification = () => {
        setResendMessage('')
        
        axios.post('http://localhost:3001/resend-verification', {email})
        .then(result => {
            console.log(result)
            if (result.data.success) {
                setResendMessage(result.data.message)
            }
        })
        .catch(err => {
            console.log(err)
            setResendMessage(err.response?.data?.message || 'Failed to resend email')
        })
    }


    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded" style={{ width: '400px' }}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="Name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="Name"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="Email">
                            <strong>UFL Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="yourname@ufl.edu"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <small className="text-muted">Must be a @ufl.edu email address</small>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="Password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="Password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2" role="alert">
                            {error}
                        </div>
                    )}

                    {showResend && (
                        <div className="mb-3">
                            <button 
                                type="button" 
                                className="btn btn-info w-100 rounded-0"
                                onClick={handleResendVerification}
                            >
                                Resend Verification Email
                            </button>
                        </div>
                    )}

                    {resendMessage && (
                        <div className="alert alert-info py-2" role="alert">
                            {resendMessage}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success py-2" role="alert">
                            {success}
                            <br />
                            <small>Redirecting to login...</small>
                        </div>
                    )}

                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register 
                    </button>
                </form>
                <p className="mt-3">Already have an account?</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;
