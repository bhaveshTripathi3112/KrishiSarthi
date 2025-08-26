import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import App from './App'

// ✅ Keep named imports where you actually exported them as named
import { Home } from './components/Home/Home'
import { Login } from './components/Login/Login'
import { Signup } from './components/SignUp/SignUp'
import { About } from './components/About/About'
import { Scanner } from './components/PlantDisease/Scanner'
import { CropRecommendation } from './components/CropRecommendation/CropRecommendation'
import { Chatbot } from './components/Chatbot/Chatbot'

// ✅ Import default for Contacts.jsx
import ContactPage from './components/Contacts/Contacts'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="scanner" element={<Scanner />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="about" element={<About />} />
      <Route path="chatbot" element={<Chatbot />} />
      <Route path="crop-recommendation" element={<CropRecommendation />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)