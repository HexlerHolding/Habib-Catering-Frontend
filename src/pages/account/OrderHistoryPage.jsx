import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';

const OrderHistoryPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    console.log("OrderHistoryPage mounted - Auth state:", isAuthenticated);
  }, [isAuthenticated]);

  // Sample order data (replace with actual data fetching logic)
  const orders = [
    {
      id: '1001',
      date: '2023-05-15',
      items: 3,
      total: 1250,
      status: 'Delivered'
    },
    {
      id: '1002',
      date: '2023-04-28',
      items: 2,
      total: 850,
      status: 'Delivered'
    },
    {
      id: '1003',
      date: '2023-04-10',
      items: 4,
      total: 1650,
      status: 'Delivered'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-text/20">
            <thead className="bg-text/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/50 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/50 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/50 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/50 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/50 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-text/20">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-text/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs.{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/20 text-accent">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text/50 mb-4">You haven't placed any orders yet.</p>
          <a href="/menu" className="inline-block bg-primary text-secondary px-6 py-2 rounded-lg font-medium">
            Browse Menu
          </a>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
