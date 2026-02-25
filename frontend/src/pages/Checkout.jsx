import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, CreditCard } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, fetchCart } = useCart();
    const [address, setAddress] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', { shipping_address: address });
            setIsSuccess(true);
            fetchCart();
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            console.error('Checkout error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-2xl shadow-xl border border-gray-100">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                <p className="text-gray-500 mb-8">Thank you for your order. We've sent a confirmation email with all the details.</p>
                <div className="text-sm text-gray-400">Redirecting you to the home page...</div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800">No items to checkout</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-medium">Go back to shop</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Complete Your Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                            Shipping Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Delivery Address</label>
                                <textarea
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House No, Street, City, ZIP Code"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-32 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-indigo-600" />
                            Payment Method
                        </h3>
                        <div className="p-4 border-2 border-indigo-600 bg-indigo-50 rounded-lg flex items-center gap-4">
                            <div className="bg-indigo-600 text-white p-2 rounded-md">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-indigo-900">Demo Credit Card</p>
                                <p className="text-xs text-indigo-700">Ends in 4242 (Secured payment gateway)</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                        {loading ? 'Validating Payment...' : `Pay $${cartTotal.toFixed(2)} Now`}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Order Review</h3>
                        <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded-md border border-gray-50" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.product.name}</h4>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                        <p className="font-bold text-indigo-600">${item.product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-100">
                                <span>Total Price</span>
                                <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
