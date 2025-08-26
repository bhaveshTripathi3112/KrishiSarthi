import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import { Home } from './components/Home/Home'
// import { Scanner } from './components/PlantDisease/Scanner'
import { Contact } from './components/Contacts/Contacts'
import { About } from './components/About/About'




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="home" element={<Home />} />
   
      {/* <Route path="scanner" element={<Scanner />} /> */}
      <Route path="contact" element={<Contact />} />
      <Route path="about" element={<About />} />  
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <RouterProvider router={router} />
    
  </StrictMode>
)