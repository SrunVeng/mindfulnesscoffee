import React, { Suspense, lazy } from "react"
import Layout from "./components/Layout.jsx"
import { Routes, Route } from "react-router-dom"
import GallaryPage from "./pages/GallaryPage.jsx";

const Home = lazy(() => import("./pages/Home.jsx"))
const Menu = lazy(() => import("./pages/Menu.jsx"))
const About = lazy(() => import("./pages/About.jsx"))
const Contact = lazy(() => import("./pages/Contact.jsx"))

export default function App() {
    return (
        <Layout>
            <Suspense fallback={<div className="py-12 text-center text-gray-500">Loading…</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallary" element={<GallaryPage />} />
                </Routes>
            </Suspense>
        </Layout>
    )
}
