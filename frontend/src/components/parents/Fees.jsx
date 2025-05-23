import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../stores/useAuthStore'; // assuming this provides token

export default function FeePayment() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    // fetch pending fees for this parent
    axios
      .get('http://localhost:5000/api/parent/fetchFees', {
      })
      .then((res) => setFees(res.data))
      .catch(console.error);
  }, [token]);

  const handlePay = async (fee) => {
    setLoading(true);
    try {
      // 1) Initiate payment
      const { data } = await axios.post(
        `http://localhost:5000/api/fees/pay/${fee._id}`,
      );

      // 2) Load checkout
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert('Failed to load Razorpay SDK');
        setLoading(false);
        return;
      }

      const options = {
        key: data.razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: 'Your School Name',
        description: `Fee for Roll No ${fee.student.RollNumber}`,
        order_id: data.orderId,
        handler: async (response) => {
          // Optionally verify on client
          await axios.post(
            'http://localhost:5000/api/fees/verify-payment',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              feeId: fee._id
            },
          );
          // Refresh pending fees
          const res = await axios.get('http://localhost:5000/api/parent/fetchFees', {
          });
          setFees(res.data);
        },
        prefill: {
          name: fee.student.userId?.name || '',
          email: fee.student.userId?.email || '',
          contact: fee.student.phoneNumber || ''
        },
        theme: { color: '#47B881' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Unable to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pending Fee Challans</h2>
      {fees.length === 0 ? (
        <div className="alert alert-success">No pending fees!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fees.map((fee) => (
            <div key={fee._id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Roll No: {fee.student.RollNumber}</h3>
                <p>Amount: ₹{fee.amount}</p>
                <p>Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePay(fee)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
