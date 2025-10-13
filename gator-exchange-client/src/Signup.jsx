import { useState } from 'react'

function Signup()
{
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 style={{ width: '400px' }}">
                <h2>Register</h2>
                <form>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Name</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        name="email"
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Register 
                </button>
                <p>Already have an account?</p>
                <button className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    login
                </button>
                </form>
            </div>
        </div>
    );
}

export default Signup; 
