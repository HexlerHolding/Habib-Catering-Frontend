import React from 'react';
import { FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

// Mock order data
const orders = [
  {
    id: 'ORD-12345',
    date: '2023-05-15',
    total: 39.97,
    status: 'delivered',
    items: [
      { id: 1, name: 'Classic Margherita', quantity: 1, price: 11.99 },
      { id: 7, name: 'Cheese Fries', quantity: 2, price: 13.98 },
    ]
  },
  {
    id: 'ORD-12346',
    date: '2023-05-10',
    total: 26.98,
    status: 'in-transit',
    items: [
      { id: 4, name: 'Classic Cheeseburger', quantity: 2, price: 19.98 },
      { id: 8, name: 'Soft Drinks', quantity: 3, price: 7.47 }
    ]
  },
  {
    id: 'ORD-12347',
    date: '2023-05-05',
    total: 33.96,
    status: 'processing',
    items: [
      { id: 2, name: 'Pepperoni', quantity: 1, price: 13.99 },
      { id: 5, name: 'BBQ Bacon Burger', quantity: 1, price: 12.99 },
      { id: 9, name: 'Chocolate Brownie', quantity: 1, price: 6.99 }
    ]
  }
];

// Status icon component
const StatusIcon = ({ status }) => {
  switch (status) {
    case 'delivered':
      return <FaCheckCircle className="text-green-500" />;
    case 'in-transit':
      return <FaTruck className="text-primary" />;
    case 'processing':
      return <FaClock className="text-accent" />;
    default:
      return null;
  }
};

// Status label formatting
const formatStatus = (status) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'in-transit':
      return 'On the Way';
    case 'processing':
      return 'Processing';
    default:
      return status;
  }
};

const OrderHistoryPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-text">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text/50">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-text/10 rounded-lg overflow-hidden">
              {/* Order header */}
              <div className="bg-text/5 p-4 flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="font-medium text-text">{order.id}</h3>
                  <p className="text-sm text-text/50">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={order.status} />
                  <span className="font-medium text-text">{formatStatus(order.status)}</span>
                </div>
              </div>
              
              {/* Order items */}
              <div className="p-4">
                <ul className="divide-y divide-text/10">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="text-text">{item.name}</span>
                        <span className="text-text/50 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-text font-medium">Rs. {item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-4 border-t border-text/10 flex justify-between items-center">
                  <span className="text-text font-medium">Total</span>
                  <span className="text-accent font-bold text-xl">Rs. {order.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Order actions */}
              <div className="bg-text/5 p-4 flex justify-end">
                <button className="bg-primary text-text px-4 py-2 rounded font-medium">
                  Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
