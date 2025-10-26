import React from "react"
import Layout from "./components/Layout.jsx"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Menu from "./pages/Menu.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Layout>
    )
}
