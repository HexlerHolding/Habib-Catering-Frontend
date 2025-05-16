import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { TITLE } from '../data/globalText';
import { CONTACT_INFO } from '../data/globalText';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    // Always scroll to top when MenuPage mounts
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="bg-background min-h-screen mt-9">      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Go Back Arrow */}
        <button
          className="flex items-center ml-1 text-primary cursor-pointer hover:text-accent font-medium mb-4 px-2 py-1 rounded transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-text">Privacy Policy</h1>
        
        <div className="bg-background rounded-lg shadow-md p-5 md:p-8">
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Introduction</h2>
            <p className="mb-4 text-text">
              At {TITLE}, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website or use our mobile application.
            </p>
            <p className="mb-4 text-text">
              Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that 
              you have read, understood, and agree to be bound by all the terms outlined in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Information We Collect</h2>
            <p className="mb-3 text-text">We may collect information about you in various ways, including:</p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                <span className="font-medium">Personal Data:</span> Name, email address, telephone number, delivery address, and payment information.
              </li>
              <li className="mb-2">
                <span className="font-medium">Account Information:</span> Login credentials, order history, and preferences.
              </li>
              <li className="mb-2">
                <span className="font-medium">Usage Data:</span> Information about how you interact with our website, application, and services.
              </li>
              <li className="mb-2">
                <span className="font-medium">Device Information:</span> IP address, browser type, device type, and operating system.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">How We Use Your Information</h2>
            <p className="mb-3 text-text">We may use the information we collect about you for various purposes:</p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">To process and deliver your orders</li>
              <li className="mb-2">To maintain your account and provide customer support</li>
              <li className="mb-2">To personalize your experience and deliver targeted content and offers</li>
              <li className="mb-2">To improve our website, products, and services</li>
              <li className="mb-2">To send promotional communications and newsletters</li>
              <li className="mb-2">To ensure the security of our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Cookies and Similar Technologies</h2>
            <p className="mb-4 text-text">
              We use cookies and similar tracking technologies to collect and track information about your browsing activities. 
              You can set your browser to refuse all or some browser cookies, but this may affect certain features of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Data Security</h2>
            <p className="mb-4 text-text">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Third-Party Disclosure</h2>
            <p className="mb-4 text-text">
              We may share your information with third-party service providers to perform services on our behalf, 
              such as payment processing, delivery services, data analysis, and customer service. We ensure these 
              third parties use your information only for the specific purpose and maintain appropriate security measures.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Your Rights</h2>
            <p className="mb-3 text-text">Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">Access and review your personal information</li>
              <li className="mb-2">Correct inaccuracies in your personal information</li>
              <li className="mb-2">Request deletion of your personal information</li>
              <li className="mb-2">Object to the processing of your personal information</li>
              <li className="mb-2">Request restrictions on the processing of your personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Contact Us</h2>
            <p className="mb-4 text-text">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-primary/20 p-4 rounded-lg text-text">
              <p className="font-medium">{TITLE} Customer Service</p>
              <p>Email: {CONTACT_INFO.email}</p>
              <p>Phone: {CONTACT_INFO.phone}</p>
              <p>Address: {CONTACT_INFO.address}</p>
            </div>
          </section>
        </div>
        
       
      </div>
    </div>
  );
};

export default PrivacyPolicy;
