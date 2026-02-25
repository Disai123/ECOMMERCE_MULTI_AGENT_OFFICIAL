import { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="bg-indigo-600 rounded-2xl p-8 mb-12 text-white flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to ShopEasy</h1>
                <p className="text-xl text-indigo-100 max-w-2xl mb-8">
                    Discover our premium collection of luxury items, now automated with AI for your convenience.
                </p>
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for products, categories..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h2>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg h-80 animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found matching your search.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-indigo-600 font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
