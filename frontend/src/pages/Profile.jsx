import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Package, User, Mail, Shield, Calendar, MapPin } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/orders')
                .then(res => setOrders(res.data))
                .catch(err => console.error('Error fetching orders:', err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Please log in to view your profile.</h2>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100 flex flex-col md:flex-row">
                <div className="bg-indigo-600 p-8 md:w-1/3 flex flex-col items-center justify-center text-white">
                    <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/30">
                        <User className="w-16 h-16" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">{user.full_name}</h1>
                    <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 border border-white/10">
                        {user.role} Member
                    </span>
                </div>

                <div className="p-8 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Status</p>
                            <p className="text-gray-800 font-medium capitalize">Active / Verified</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                            <p className="text-gray-800 font-medium">January 2025</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pref. Currency</p>
                            <p className="text-gray-800 font-medium">USD ($)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-4">
                    Your Order History
                </h2>
                <div className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-lg hover:border-indigo-100 group">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition duration-300">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-gray-900 text-lg tracking-tight">ORDER #{order.id}</span>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">PLACED ON {new Date(order.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block font-black text-2xl text-indigo-600">${order.total_amount.toFixed(2)}</span>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-50 pt-4 flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">Shipping to:</span>
                                <span className="text-gray-400 italic line-clamp-1">{order.shipping_address}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
