import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300 border border-gray-100 flex flex-col h-full">
            <Link to={`/products/${product.id}`} className="block overflow-hidden h-48">
                <img
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-indigo-600 truncate">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 capitalize">{product.category}</p>

                <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => addToCart(product.id)}
                        className="w-full bg-indigo-600 text-white flex items-center justify-center gap-2 py-2 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                    <Link
                        to={`/products/${product.id}`}
                        className="block text-center text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-2"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
