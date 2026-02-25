import { useState, useEffect } from 'react';
import api from '../api';
import { Package, ShoppingBag, TrendingUp, RefreshCcw, LayoutDashboard, Search } from 'lucide-react';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Revenue', value: `$${orders.reduce((acc, o) => acc + o.total_amount, 0).toFixed(2)}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg Order Value', value: `$${orders.length ? (orders.reduce((acc, o) => acc + o.total_amount, 0) / orders.length).toFixed(2) : '0.00'}`, icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">Monitor sales, inventory, and order fulfillment</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-gray-800 text-xl">Order Management</h3>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['all', 'pending', 'shipping', 'delivered'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-extrabold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Fulfillment Details</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Access Status</th>
                                <th className="px-6 py-4">Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4 h-16 bg-white/50"></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-600">ORD-{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{order.shipping_address}</p>
                                        </td>
                                        <td className="px-6 py-4 font-extrabold text-indigo-600">${order.total_amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                                            {new Date(order.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No matching orders found in the database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
