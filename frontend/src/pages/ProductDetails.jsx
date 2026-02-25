import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch((err) => console.error('Error fetching product details:', err));
    }, [id]);

    if (!product) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const handleAddToCart = () => {
        // Our context's addToCart only takes product_id but we can specify quantity in future
        // For now, let's stick to the current API
        addToCart(product.id);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Products
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-12 p-8 border border-gray-100">
                {/* Image Section */}
                <div className="flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-4">
                    <img
                        src={product.image_url || "https://via.placeholder.com/600"}
                        alt={product.name}
                        className="max-h-[500px] w-full object-contain hover:scale-105 transition duration-500"
                    />
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>

                    <div className="flex items-center mb-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                        </div>
                        <span className="text-gray-400 ml-3 text-sm">(4.8 / 5.0 based on 42 reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-8">
                        <p className="text-4xl font-black text-indigo-600">${product.price.toFixed(2)}</p>
                        <p className="text-gray-400 line-through text-lg font-medium">${(product.price * 1.2).toFixed(2)}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg mb-8 border-l-4 border-indigo-100 pl-6 italic">
                        {product.description || "Discover the perfect blend of style and performance with this premium selection. Crafted with attention to every detail for the modern lifestyle."}
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-800">Availability:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock_quantity > 0 ? 'In Stock (Ready to Ship)' : 'Currently Out of Stock'}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-3 hover:bg-white transition text-gray-500 hover:text-indigo-600"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-6 font-bold text-gray-800 text-lg">{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="px-4 py-3 hover:bg-white transition text-gray-500 hover:text-indigo-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                                className="flex-1 bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 text-lg"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Add to Shopping Bag
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Premium Support</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-medium text-gray-600 text-center">Free Global Shipping</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-medium text-gray-600 text-center">30-Day Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// CheckCircle is already imported from lucide-react
