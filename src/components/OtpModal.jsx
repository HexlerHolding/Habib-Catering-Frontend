import { useState } from 'react';

const OtpModal = ({ isOpen, onClose, onSubmit, phone, loading }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/[^\d]/g, ''));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }
    onSubmit(otp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-modal/50 ">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2">Enter OTP</h2>
        <p className="mb-4 text-sm text-text/70">We sent an OTP to <span className="font-semibold">{phone}</span></p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring"
            placeholder="Enter OTP"
            autoFocus
          />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded bg-text/10 hover:bg-text/20 cursor-pointer text-text/70 font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded bg-primary hover:bg-primary/80 hover:brightness-105 text-secondary cursor-pointer font-semibold "
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
