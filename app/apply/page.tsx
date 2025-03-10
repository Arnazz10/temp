'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoanApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Financial Information
    annualIncome: '',
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    yearsEmployed: '',
    
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    loanTerm: '',
    
    // Credit Information
    creditScore: '',
    existingDebts: '',
    monthlyExpenses: '',
    
    // Additional Information
    otherInfo: '',
    agreeToTerms: false
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.address) newErrors.address = 'Address is required';
    } else if (step === 2) {
      if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.employerName) newErrors.employerName = 'Employer name is required';
      if (!formData.yearsEmployed) newErrors.yearsEmployed = 'Years employed is required';
    } else if (step === 3) {
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
      if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    } else if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock Firebase functionality
      // In a real app, this would save to Firebase
      
      // Generate mock AI prediction score
      const aiPredictionScore = Math.floor(Math.random() * 100);
      const initialStatus = aiPredictionScore > 70 ? 'Likely Approved' : 'Under Review';

      // Mock data saving
      const mockApplicationId = 'LOAN-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the application ID for reference
      setApplicationId(mockApplicationId);
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting loan application:', error);
      setErrors({ submit: 'There was an error processing your application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple function to generate AI explanation text
  const generateAIExplanation = (score: number) => {
    if (score > 85) {
      return "Based on your strong financial profile, steady income, and excellent credit history, our AI system predicts a high likelihood of loan approval.";
    } else if (score > 70) {
      return "Your application shows good financial stability. The AI system recommends approval with standard terms.";
    } else if (score > 50) {
      return "Our AI analysis indicates moderate risk. Additional verification may be required before final approval.";
    } else {
      return "Based on the provided information, our AI system has identified several risk factors that require manual review by our team.";
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'}`}
                initial={false}
                animate={{ scale: currentStep === step ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step}
              </motion.div>
              <div className="text-xs mt-2 text-center">
                {step === 1 ? 'Personal' : 
                 step === 2 ? 'Financial' : 
                 step === 3 ? 'Loan Details' : 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex h-2 mt-4 mb-6">
          <div className="absolute top-0 h-2 bg-gray-300 w-full rounded"></div>
          <motion.div 
            className="absolute top-0 h-2 bg-blue-600 rounded" 
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep - 1) * 33.33}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>
    );
  };

  // Success screen after submission
  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Your application has been received and is being processed by our AI system.</p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6 inline-block">
            <p className="font-medium">Application ID: <span className="text-blue-600">{applicationId}</span></p>
          </div>
          
          <div className="max-w-lg mx-auto text-left bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="font-bold text-gray-700 mb-2">AI Initial Assessment</h3>
            <p className="text-gray-600">{generateAIExplanation(Math.floor(Math.random() * 100))}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">You will receive updates on your application status via email. You can also check the status anytime by logging into your dashboard.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                annualIncome: '',
                employmentStatus: '',
                employerName: '',
                jobTitle: '',
                yearsEmployed: '',
                loanAmount: '',
                loanPurpose: '',
                loanTerm: '',
                creditScore: '',
                existingDebts: '',
                monthlyExpenses: '',
                otherInfo: '',
                agreeToTerms: false
              });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Application
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-blue-600">Loan Application</h1>
        <p className="text-gray-600 mt-2">Our AI-powered system will analyze your application in real-time</p>
      </motion.div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <motion.div 
            key="step1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div 
            key="step2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Annual Income ($)</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.annualIncome ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Employment Status</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.employmentStatus ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                </select>
                {errors.employmentStatus && <p className="text-red-500 text-xs mt-1">{errors.employmentStatus}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Employer Name</label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.employerName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.employerName && <p className="text-red-500 text-xs mt-1">{errors.employerName}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Years Employed</label>
                <input
                  type="number"
                  name="yearsEmployed"
                  value={formData.yearsEmployed}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.yearsEmployed ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.yearsEmployed && <p className="text-red-500 text-xs mt-1">{errors.yearsEmployed}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Monthly Expenses ($)</label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Existing Debts ($)</label>
                <input
                  type="number"
                  name="existingDebts"
                  value={formData.existingDebts}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Credit Score (if known)</label>
                <input
                  type="number"
                  name="creditScore"
                  value={formData.creditScore}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="300"
                  max="850"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div 
            key="step3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Loan Amount ($)</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Loan Purpose</label>
                <select
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.loanPurpose ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select</option>
                  <option value="Home Purchase">Home Purchase</option>
                  <option value="Auto Loan">Auto Loan</option>
                  <option value="Education">Education</option>
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Home Improvement">Home Improvement</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
                {errors.loanPurpose && <p className="text-red-500 text-xs mt-1">{errors.loanPurpose}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Loan Term (years)</label>
                <select
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.loanTerm ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                  <option value="7">7 years</option>
                  <option value="10">10 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
                {errors.loanTerm && <p className="text-red-500 text-xs mt-1">{errors.loanTerm}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Additional Information (Optional)</label>
              <textarea
                name="otherInfo"
                value={formData.otherInfo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded h-32"
                placeholder="Please provide any additional information that might help us evaluate your application..."
              ></textarea>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div 
            key="step4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Review & Submit</h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                <p><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</p>
                <p><span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Annual Income:</span> ${formData.annualIncome}</p>
                <p><span className="font-medium">Employment Status:</span> {formData.employmentStatus}</p>
                <p><span className="font-medium">Employer:</span> {formData.employerName}</p>
                <p><span className="font-medium">Job Title:</span> {formData.jobTitle}</p>
                <p><span className="font-medium">Years Employed:</span> {formData.yearsEmployed}</p>
                <p><span className="font-medium">Monthly Expenses:</span> ${formData.monthlyExpenses}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Loan Amount:</span> ${formData.loanAmount}</p>
                <p><span className="font-medium">Loan Purpose:</span> {formData.loanPurpose}</p>
                <p><span className="font-medium">Loan Term:</span> {formData.loanTerm} years</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`mr-2 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                />
                <span className="text-gray-700">I confirm that all information provided is accurate and complete. I understand that this information will be used for AI-powered loan eligibility assessment.</span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handlePreviousStep}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Previous
            </motion.button>
          )}
          
          {currentStep < 4 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleNextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Application'}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;