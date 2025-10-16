import { useState } from 'react'
import { Link } from "react-router-dom";

function Signup()
{
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded" style={{ width: '400px' }}>
                <h2>Register</h2>
                <form>
                <div className="mb-3">
                    <label htmlFor="Name">
                        <strong>Name</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Email">
                        <strong>Eamil</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Email"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Password">
                        <strong>Password</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Password"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                    />
                </div>

                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Register 
                </button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    login
                </Link>
                
            </div>
        </div>
    );
}

export default Signup; 
