import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaPhone, FaLink } from "react-icons/fa";
// import { TITLE } from "../data/globalText";
import { CONTACT_INFO } from "../data/globalText";

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
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-text">
          Privacy Policy
        </h1>
        <div className="bg-background rounded-lg shadow-md p-5 md:p-8">
          <section className="mb-8">
            <p className="mb-4 text-text">Effective Date: {CONTACT_INFO.effectiveDate}</p>
            <p className="mb-4 text-text">
              Website:
              <Link
                to="https://www.habibcatering.com"
                className="text-text hover:underline focus:underline ml-1"
              >
                {CONTACT_INFO.website}
              </Link>
            </p>
            <p className="mb-4 text-text">
              Email:
              <Link
                to="mailto:habibcateringinc@gmail.com"
                className="text-text hover:underline focus:underline ml-1"
              >
             {CONTACT_INFO.email}
              </Link>
            </p>
            <p className="mb-4 text-text">
              Phone:
              <Link
                to="tel:(732)719-8742"
                className="text-text hover:underline focus:underline ml-1"
              >
           {CONTACT_INFO.phone}
              </Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              Introduction
            </h2>
            <p className="mb-4 text-text">
              At Habib Catering, we value your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you visit our
              website or interact with us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                <span className="font-medium">Contact Information:</span> Your
                name, phone number, email address, and physical address
              </li>
              <li className="mb-2">
                <span className="font-medium">Order Information:</span> Details
                related to your catering inquiries and purchases
              </li>
              <li className="mb-2">
                <span className="font-medium">Payment Information:</span>{" "}
                Billing information (processed securely via third-party
                providers)
              </li>
              <li className="mb-2">
                <span className="font-medium">Technical Information:</span> IP
                address, browser type, device information, and usage behavior
              </li>
              <li className="mb-2">
                <span className="font-medium">Marketing Preferences:</span>{" "}
                Information related to your opt-in choices for SMS or email
                updates
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              2. How We Use Your Information
            </h2>
            <p className="mb-4 text-text">
              We use your personal information to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                Fulfill and manage orders and catering services
              </li>
              <li className="mb-2">
                Respond to inquiries and provide customer support
              </li>
              <li className="mb-2">
                Send updates, offers, and promotional communications (if you
                have opted in)
              </li>
              <li className="mb-2">
                Improve our website, services, and customer experience
              </li>
              <li className="mb-2">
                Comply with legal and regulatory requirements
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              3. Sharing of Information
            </h2>
            <p className="mb-4 text-text">
              We do not sell or rent your personal information to third parties.
            </p>
            <p className="mb-4 text-text">We may share limited data with:</p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                Trusted service providers who assist in hosting, payment
                processing, email/SMS delivery, or customer service
              </li>
              <li className="mb-2">
                Legal or regulatory authorities, if required by law
              </li>
            </ul>
            <p className="mb-4 text-text">
              SMS consent is not shared with third parties or affiliates for
              marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              4. SMS and Email Communications
            </h2>
            <p className="mb-4 text-text">
              If you opt in to receive SMS or email communications from us, we
              may send updates about orders, promotions, or events.
            </p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                You can opt out of SMS at any time by replying “STOP.”
              </li>
              <li className="mb-2">
                You can unsubscribe from email using the link at the bottom of
                any marketing email.
              </li>
            </ul>
            <p className="mb-4 text-text">
              We do not share your SMS consent with third parties or affiliates
              for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              5. Your Rights and Choices
            </h2>
            <p className="mb-4 text-text">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-text">
              <li className="mb-2">
                Request access to the personal information we hold about you
              </li>
              <li className="mb-2">Update or correct your information</li>
              <li className="mb-2">Opt out of marketing communications</li>
              <li className="mb-2">
                Request deletion of your data, subject to legal obligations
              </li>
            </ul>
            <p className="mb-4 text-text">
              To exercise your rights, please contact us at:
            </p>
            <div className="bg-primary/20 p-4 rounded-lg text-text break-words">
              <Link
                to="mailto:habibcateringinc@gmail.com"
                className="font-medium flex items-center break-all hover:underline focus:underline"
              >
                <FaEnvelope className="mr-2" />
               {CONTACT_INFO.email}
              </Link>
              <Link
                to="tel:(732)719-8742"
                className="flex items-center hover:underline focus:underline"
              >
                <FaPhone className="mr-2" />
                {CONTACT_INFO.phone}
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              6. Security
            </h2>
            <p className="mb-4 text-text">
              We implement appropriate technical and organizational measures to
              protect your data from unauthorized access, alteration, or
              disclosure. While no online service is 100% secure, we strive to
              protect your personal information to the best of our ability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              7. Changes to This Policy
            </h2>
            <p className="mb-4 text-text">
              We may update this Privacy Policy from time to time. The latest
              version will always be available at:
            </p>
            <p className="mb-4 text-text flex items-center">
              <FaLink className="mr-2" />
              www.habibcatering.com/privacy-policy
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">
              8. Accessibility
            </h2>
            <p className="mb-4 text-text">
              We make our Privacy Policy easily accessible from the footer of
              every page and on any form where personal information is
              requested. We encourage all visitors to review this policy to
              understand how their data is used.
            </p>
          </section>

          <section>
            <p className="mb-4 text-text">
              We respect your privacy. View our Privacy Policy to learn how we
              collect, use, and protect your information. SMS consent is never
              shared with third parties or affiliates for marketing purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
