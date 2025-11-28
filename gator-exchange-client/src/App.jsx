import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./Login"
import Home from "./Home"
import Profile from "./Profile"
import LandingPage from "./LandingPage"
import ItemDetail from "./ItemDetail"
import Messages from "./Messages"
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        
        {/* Protected Routes (require login) */}
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/item/:id" element={<ItemDetail />}></Route>
        <Route path="/messages" element={<Messages />}></Route>
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  ) 
}

export default App
