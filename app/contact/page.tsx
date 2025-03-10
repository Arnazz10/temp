'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: '',
  });

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Your message has been sent! We\'ll get back to you soon.',
    });
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormStatus(prev => ({ ...prev, submitted: false }));
    }, 5000);
  };

  // FAQ data
  const faqs = [
    {
      question: "How does the AI determine my loan eligibility?",
      answer: "Our AI evaluates multiple factors including your credit history, income stability, existing debt, and payment behavior. The model has been trained on thousands of past loan applications to identify patterns that indicate likelihood of repayment."
    },
    {
      question: "How long does the loan approval process take?",
      answer: "With our AI-powered system, most applications receive an initial decision within minutes. For more complex cases, it may take up to 24 hours as some factors might require additional verification."
    },
    {
      question: "What documents do I need to provide for loan verification?",
      answer: "Typically, you'll need to provide proof of identity (government ID), proof of address (utility bill), proof of income (pay stubs or tax returns), and bank statements from the last 3 months. Additional documents may be requested based on your specific situation."
    },
    {
      question: "Can I appeal if my loan application is rejected?",
      answer: "Yes, you can appeal a rejection within 30 days. Our system allows you to provide additional information or documentation that might improve your application. Each appeal is reviewed by both our AI system and a human specialist."
    },
    {
      question: "How secure is my financial information in the system?",
      answer: "We employ bank-level encryption and security protocols. Your data is encrypted both in transit and at rest. We comply with all relevant data protection regulations and never share your information with unauthorized third parties."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our AI-powered loan system? Our team is here to help. 
          Choose your preferred way to reach us.
        </p>
      </motion.div>

      {/* Contact Methods Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8 mb-16"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-gray-600 mb-4">Talk to our customer support team</p>
          <a href="tel:+18001234567" className="text-blue-600 font-medium hover:underline">
            +1 (800) 123-4567
          </a>
          <p className="text-sm text-gray-500 mt-2">
            Mon-Fri: 8am - 8pm ET
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-gray-600 mb-4">Send us an email anytime</p>
          <a href="mailto:support@ailoan.example.com" className="text-green-600 font-medium hover:underline">
            support@ailoan.example.com
          </a>
          <p className="text-sm text-gray-500 mt-2">
            We respond within 24 hours
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">Chat with our support agents</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Start Live Chat
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Available 24/7
          </p>
        </motion.div>
      </motion.div>

      {/* Contact Form and FAQs Section */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="How can we help you?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide details about your inquiry..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </button>
          </form>
          
          {formStatus.submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-md ${
                formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {formStatus.message}
            </motion.div>
          )}
        </motion.div>
        
        {/* FAQs Accordion */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      activeAccordion === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {activeAccordion === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-gray-50"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Office Location Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Visit Our Office</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <p className="text-gray-700">
              <strong>Headquarters:</strong> 123 Finance Street, Tech Plaza<br />
              San Francisco, CA 94103, USA
            </p>
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
            {/* This would typically be a Google Map or similar */}
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive Map Would Go Here</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}