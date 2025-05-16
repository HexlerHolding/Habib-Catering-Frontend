import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
//import baseurl from env
const API_URL = import.meta.env.VITE_API_URL; // Add this environment variable


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/user/contact`, formData);
      toast.success('Message sent and saved successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4 text-text">Contact Us</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="p-2  rounded focus:outline-text focus:outline-2 outline-1 outline-text/50 "
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="p-2 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="p-2 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded"
          rows="5"
          required
        ></textarea>
        <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-secondary)] font-semibold cursor-pointer rounded-md hover:bg-primary/80 transition-colors hover:brightness-105">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;