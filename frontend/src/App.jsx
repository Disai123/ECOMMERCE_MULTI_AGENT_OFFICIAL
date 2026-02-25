import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AIWidget from './components/AIWidget';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                                <Route path="/products/:id" element={<ProductDetails />} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                        <AIWidget />
                        <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
                            &copy; 2025 E-Shop Agent. Built with ❤️ and AI.
                        </footer>
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
