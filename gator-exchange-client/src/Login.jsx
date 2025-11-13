import { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showResend, setShowResend] = useState(false)
    const [showPassword, setShowPassword] = useState(false)                     
    const [resendMessage, setResendMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setShowResend(false)
        setResendMessage('')

        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            console.log(result)
            if (result.data.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(result.data.user))
                navigate('/home', { 
                    state: { 
                        email: result.data.user.email,
                        name: result.data.user.name 
                    } 
                })
            }
        })
        .catch(err => {
            console.log(err)
            const errorData = err.response?.data
            
            if (errorData?.needsVerification) {
                setError(errorData.message)
                setShowResend(true)
            } else {
                setError(errorData?.message || 'Login failed. Please try again.')
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
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="Email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="Password">
                        <strong>Password</strong>
                    </label>
                    <div className="position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="Password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            required
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

                    {error && (
                        <div className="alert alert-warning py-2" role="alert">
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

                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login 
                    </button>
                </form>
                <p className="mt-3">Don't have an account?</p>
                <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default Login;
