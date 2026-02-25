import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cart, removeFromCart, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-2xl shadow-sm p-12 inline-block max-w-lg border border-gray-100">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet. Let's find some amazing products!</p>
                    <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
                            <img
                                src={item.product.image_url || "https://via.placeholder.com/300"}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-lg mr-6 border border-gray-50"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">{item.product.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">{item.product.category}</p>
                                <div className="text-xl font-bold text-indigo-600">${item.product.price.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-400 uppercase font-bold mb-1">Quantity</span>
                                    <span className="font-bold bg-gray-100 px-4 py-1 rounded-lg text-gray-700">{item.quantity}</span>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Remove from cart"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                                <span>Total</span>
                                <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/checkout"
                        className="w-full bg-indigo-600 text-white py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200 group"
                    >
                        Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/" className="block text-center text-gray-500 text-sm hover:text-indigo-600 mt-4 transition font-medium">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
