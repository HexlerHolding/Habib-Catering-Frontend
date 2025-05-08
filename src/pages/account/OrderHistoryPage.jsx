import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';

const OrderHistoryPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    console.log("OrderHistoryPage mounted - Auth state:", isAuthenticated);
  }, [isAuthenticated]);

  // Function to determine status styling
  const getStatusStyle = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-accent/20 text-accent';
    }
  };

  // Sample order data with the statuses matching the provided images
  const orders = [
    {
      id: '080525-25481',
      restaurant: 'Cheezious - F-10 Islamabad',
      date: 'May 8, 03:22pm',
      items: [
        { name: '1 Chicken Mushroom', price: 690 }
      ],
      total: 690,
      status: 'PREPARING'
    },
    {
      id: '080424-12345',
      restaurant: 'Cheezious - F-8 Islamabad',
      date: 'May 6, 01:15pm',
      items: [
        { name: '1 Beef Special', price: 750 },
        { name: '1 Garlic Bread', price: 250 }
      ],
      total: 1000,
      status: 'DELIVERED'
    },
    {
      id: '080323-54321',
      restaurant: 'Cheezious - E-11 Islamabad',
      date: 'May 4, 07:45pm',
      items: [
        { name: '2 Chicken Fajita', price: 1380 },
        { name: '1 Cheese Sticks', price: 450 }
      ],
      total: 1830,
      status: 'CANCELED'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-background border border-text/10 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-text/10 p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{order.restaurant}</h3>
                  <span className={`px-2 py-1 text-xs inline-flex items-center font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text/60">{order.date}</div>
                  <div className="text-sm text-text/60">Rs. {order.total}</div>
                </div>
              </div>
              
              <div className="p-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm">Rs. {item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-3 pt-3 border-t border-text/10">
                  <span className="font-bold">Total (incl. VAT)</span>
                  <span className="font-bold text-text">Rs. {order.total}</span>
                </div>
              </div>
              
              <div className="p-4 bg-text/5 border-t border-text/10 flex justify-center">
                <Link 
                  to={`/account/orders/${order.id}`}
                  className="text-text hover:underline font-medium text-center block w-full"
                >
                  TRACK ORDER
                </Link>
              </div>
            </div>
          ))}
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
