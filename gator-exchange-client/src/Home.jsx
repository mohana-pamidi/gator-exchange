import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ItemListing from './ItemListing'
import ItemEdit from './ItemEdit'
import ItemCard from './ItemCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut, Plus, Menu } from 'lucide-react'

function Home() {
    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const email = location.state?.email || localStorage.getItem('userEmail')
        const name = location.state?.name || localStorage.getItem('userName')
        
        if (!email) {
            navigate('/')
            return
        }
        
        setUserEmail(email)
        setUserName(name)
        localStorage.setItem('userEmail', email)
        if (name) {
            localStorage.setItem('userName', name)
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
        fetchItems()
    }

    const handleEditModalClose = () => {
        setShowEditModal(false)
        setEditingItem(null)
        fetchItems()
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setShowEditModal(true)
    }

    const handleDelete = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/items/${itemId}`, {
                data: { ownerEmail: userEmail }
            })
            
            if (response.data.success) {
                alert('Item deleted successfully')
                fetchItems()
            }
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Failed to delete item. Please try again.')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        navigate('/')
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation Bar */}
            <nav className="navbar navbar-light bg-white border-bottom sticky-top">
                <div className="container-fluid px-4">
                    <div>
                        <h2 className="mb-0 fw-bold" style={{ color: '#0021A5' }}>Gator Exchange</h2>
                        <p className="mb-0 text-muted">Welcome back, {userName}!</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                            style={{ backgroundColor: '#0021A5', borderColor: '#0021A5' }}
                        >
                            <Plus size={18} className="me-1" />
                            List an Item
                        </button>
                        
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary d-flex align-items-center"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <Menu size={20} />
                            </button>
                            {showDropdown && (
                                <div 
                                    className="dropdown-menu dropdown-menu-end show" 
                                    style={{ 
                                        position: 'absolute',
                                        right: 0,
                                        left: 'auto',
                                        top: '100%',
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    <a 
                                        className="dropdown-item d-flex align-items-center" 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            navigate('/profile')
                                        }}
                                    >
                                        <User size={16} className="me-2" />
                                        My Profile
                                    </a>
                                    <hr className="dropdown-divider" />
                                    <a 
                                        className="dropdown-item text-danger d-flex align-items-center" 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleLogout()
                                        }}
                                    >
                                        <LogOut size={16} className="me-2" />
                                        Logout
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {/* Items Section */}
                <div className="row">
                    <div className="col-12">
                        <h4 className="mb-3 fw-semibold">Available Items</h4>
                        {items.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No items listed yet. Be the first to list an item!</p>
                                <button 
                                    className="btn btn-primary mt-3"
                                    onClick={() => setShowModal(true)}
                                >
                                    List an Item
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex flex-wrap gap-3">
                                {items.map((item) => (
                                    <ItemCard 
                                        key={item._id} 
                                        item={item}
                                        userEmail={userEmail}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Listing Modal */}
            <ItemListing 
                show={showModal} 
                onClose={handleModalClose}
                userEmail={userEmail}
            />

            {/* Item Edit Modal */}
            <ItemEdit 
                show={showEditModal}
                onClose={handleEditModalClose}
                userEmail={userEmail}
                item={editingItem}
            />

            {/* Click outside dropdown to close */}
            {showDropdown && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setShowDropdown(false)}
                />
            )}

            <style>{`
                .dropdown-menu.show {
                    display: block;
                    z-index: 1000;
                }
            `}</style>
        </div>
    )
}

export default Home
