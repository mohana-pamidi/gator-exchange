import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ItemListing from './ItemListing'
import ItemCard from './ItemCard'
import { useLocation, useNavigate } from 'react-router-dom'

function Home() {
    const [showModal, setShowModal] = useState(false)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        // get user email from login state or localStorage
        const email = location.state?.email || localStorage.getItem('userEmail')
        const name = location.state?.name || localStorage.getItem('userName')
        
        if (!email) {
            // if no user is logged in, redirect them to login
            navigate('/login')
            return
        }
        
        setUserEmail(email)
        setUserName(name)
        localStorage.setItem('userEmail', email) // store for future use
        if (name) {
            localStorage.setItem('userName', name) // store name for future use
        }
        fetchItems()
    }, [location, navigate])

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/items/all')
            setItems(response.data)
        } catch (error) {
            console.error('Error fetching items:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleModalClose = () => {
        setShowModal(false)
        fetchItems() // refresh the items after adding new one
    }

    const handleLogout = () => {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mt-4">
            {/* Header */}            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Gator Exchange</h2>
                    <p className="text-muted">Welcome back, {userName}!</p>
                </div>
                <div>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        List an Item
                    </button>
                    <button 
                        className="btn btn-outline-secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Items Grid */}
            <div className="row">
                <div className="col-12">
                    <h4 className="mb-3">Available Items</h4>
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No items listed yet. Be the first to list an item!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-wrap gap-3">
                            {items.map((item) => (
                                <ItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Item Listing Modal */}
            <ItemListing 
                show={showModal} 
                onClose={handleModalClose}
                userEmail={userEmail}
            />
        </div>
    )
}

export default Home;
