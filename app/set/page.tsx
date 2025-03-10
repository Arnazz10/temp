'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, CreditCard,} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [ setNotifications] = useState({
    appUpdates: true,
    loanApplicationUpdates: true,
    documentVerification: true,
    promotionalOffers: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30 minutes',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [ setLoanPreferences] = useState({
    autoPayments: true,
    paymentReminders: true,
    defaultPaymentMethod: 'Bank Account',
    statementDelivery: 'Email',
    interestRateAlerts: true,
    refinancingOffers: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleToggle = (category, setting) => {
    if (category === 'notifications') {
      setNotifications(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    } else if (category === 'security') {
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    } else if (category === 'loans') {
      setLoanPreferences(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Password validation would go here
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('security')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('loan-preferences')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'loan-preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Loan Preferences
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('security', 'twoFactorAuth')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} 
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Login Notifications</h3>
                      <p className="text-sm text-gray-600">Receive alerts when someone logs into your account</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('security', 'loginNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${securitySettings.loginNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${securitySettings.loginNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                      />
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Session Timeout</h3>
                    <p className="text-sm text-gray-600 mb-3">Automatically log out after period of inactivity</p>
                    <select 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({...prev, sessionTimeout: e.target.value}))}
                      className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                    </select>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div> 
        </div> 
        </div>)
} 