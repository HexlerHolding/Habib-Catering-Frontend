import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, you'd fetch the order data based on the orderId
  useEffect(() => {
    console.log(`Fetching order details for order ID: ${orderId}`);
    
    // Simulating API call with timeout
    setTimeout(() => {
      // Mock data based on the screenshot
      const mockOrder = {
        id: orderId || '080525-25481',
        status: 'PREPARING', // Can be: 'PLACED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED'
        estimatedArrival: '60 mins',
        deliveryAddress: 'E-10, Islamabad, Islamabad Capital Territory',
        paymentMethod: 'Cash on Delivery',
        items: [
          { name: '1 Chicken Mushroom', price: 690 }
        ],
        total: 690,
        restaurant: {
          name: `${TITLE} - F-10 Islamabad`,
          address: 'Plot no 2-D Sector F-10 Islamabad'
        }
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
        <p className="text-text/50 mb-4">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/account/orders" className="text-primary font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Helper function to determine which steps are completed
  const isStepCompleted = (step) => {
    const statusOrder = ['PLACED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED'];
    const orderStatusIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(step);
    
    return stepIndex <= orderStatusIndex;
  };

  // Helper to get progress bar width based on current status
  const getProgressWidth = () => {
    switch (order.status) {
      case 'PLACED':
        return 'w-1/4';
      case 'PREPARING':
        return 'w-2/4';
      case 'ON_THE_WAY':
        return 'w-3/4';
      case 'DELIVERED':
        return 'w-full';
      default:
        return 'w-1/4';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/account/orders" className="text-text hover:underline font-medium flex items-center">
          <FiArrowLeft className="h-5 w-5 mr-1" />
          Back to Orders
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Track My Order <span className="text-primary">({order.id})</span></h1>

      <div className="bg-background border border-text/10 rounded-lg shadow-sm mb-6">
        <div className="p-5">
          <h2 className="text-xl font-semibold mb-1">{order.estimatedArrival}</h2>
          <p className="text-text/60 mb-4">Estimated Arrival</p>

          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-text/10">
              <div className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary ${getProgressWidth()}`}></div>
            </div>
            <div className="flex justify-between text-xs text-text/40 mt-1">
              <span className="font-medium">PLACED</span>
              <span className="font-medium">PREPARING</span>
              <span className="font-medium">ON THE WAY</span>
              <span className="font-medium">DELIVERED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border border-text/10 rounded-lg shadow-sm mb-6">
        <div className="flex items-center p-5 border-b border-text/10">
          <div className="flex-1">
            <h3 className="font-medium">Deliver to</h3>
            <p className="text-text/70">{order.deliveryAddress}</p>
          </div>
          <div className="text-green-500">
            <FiCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center p-5">
          <div className="flex-1">
            <h3 className="font-medium">Payment Method</h3>
            <p className="text-text/70">{order.paymentMethod}</p>
          </div>
          <div className="text-green-500">
            <FiCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-background border border-text/10 rounded-lg shadow-sm">
        <div className="p-5">
          <h3 className="font-medium mb-4">Bill Summary</h3>
          
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-3">
              <span>{item.name}</span>
              <span>$ {item.price}</span>
            </div>
          ))}
          
          <div className="flex justify-between mt-4 pt-4 border-t border-text/10">
            <span className="font-medium">Total (incl. VAT)</span>
            <span className="font-medium text-primary">$ {order.total}</span>
          </div>
        </div>
      </div>

      {order.status !== 'DELIVERED' && order.status !== 'CANCELED' && (
        <div className="mt-6">
          <button className="w-full bg-text hover:bg-text/80 hover:brightness-105 text-secondary py-3 rounded-lg font-medium">
            CANCEL ORDER
          </button>
        </div>
      )}

      {order.status === 'DELIVERED' && (
        <div className="mt-6 text-center">
          <p className="text-green-500 font-medium">Your order has been delivered successfully!</p>
        </div>
      )}

      {order.status === 'CANCELED' && (
        <div className="mt-6 text-center">
          <p className="text-red-500 font-medium">This order has been canceled.</p>
        </div>
      )}

      {order.restaurant && (
        <div className="mt-6 p-5 bg-background border border-text/10 rounded-lg shadow-sm">
          <h3 className="font-medium mb-1">Order From</h3>
          <p className="text-text/70">{order.restaurant.address}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;