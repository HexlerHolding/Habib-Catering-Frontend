import axios from 'axios';
import { useState } from 'react';
//import baseurl from env
const API_URL = import.meta.env.VITE_API_URL; // Add this environment variable


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/user/contact`, formData);
      setStatus('Message sent and saved successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="p-2 border rounded"
          rows="5"
          required
        ></textarea>
        <button type="submit" className="px-6 py-2 bg-[var(--color-green)] text-[var(--color-secondary)] font-semibold rounded-md hover:bg-[var(--color-green-dark)] transition-colors">
          Send Message
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default Contact;