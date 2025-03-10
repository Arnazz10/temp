"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Edit2, Save, X, Camera, Check } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { db, auth, storage } from "../firebase/config"; // Adjust the import path as needed

export default function ProfilePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    accountNumber: "",
    memberSince: "",
    accountStatus: "Active",
    lastLogin: "",
    accountType: "Standard",
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: "ID Proof", uploadDate: "", fileUrl: "" },
    { id: 2, name: "Bank Statement", uploadDate: "", fileUrl: "" },
    { id: 3, name: "Income Proof", uploadDate: "", fileUrl: "" },
    { id: 4, name: "Address Proof", uploadDate: "", fileUrl: "" },
    { id: 5, name: "Tax Returns", uploadDate: "", fileUrl: "" },
    { id: 6, name: "Employment Letter", uploadDate: "", fileUrl: "" },
  ]);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  // Fetch user data from Firestore
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        
        // Set user profile data
        setUserData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          address: data.address || "",
          accountNumber: data.accountNumber || `#${Math.floor(10000000 + Math.random() * 90000000)}`,
          memberSince: data.memberSince || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          accountStatus: data.accountStatus || "Active",
          lastLogin: data.lastLogin || new Date().toLocaleString(),
          accountType: data.accountType || "Standard",
        });
        
        // Set profile image if exists
        if (data.profileImageUrl) {
          setProfileImage(data.profileImageUrl);
        }
        
        // Fetch documents if they exist
        if (data.documents) {
          setDocuments(prevDocs => 
            prevDocs.map(doc => {
              const matchingDoc = data.documents.find(d => d.name === doc.name);
              if (matchingDoc) {
                return { ...doc, ...matchingDoc };
              }
              return doc;
            })
          );
        }
      } else {
        // Create a new user document if it doesn't exist
        const newUser = {
          fullName: auth.currentUser?.displayName || "",
          email: auth.currentUser?.email || "",
          phone: "",
          dateOfBirth: "",
          address: "",
          accountNumber: `#${Math.floor(10000000 + Math.random() * 90000000)}`,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          accountStatus: "Active",
          lastLogin: new Date().toLocaleString(),
          accountType: "Standard",
          documents: documents,
        };
        
        await setDoc(userRef, newUser);
        setUserData(newUser);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Handle Profile Image Upload
  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && auth.currentUser) {
      try {
        setUploadingProfile(true);
        
        // Create a reference to the storage location with a timestamp to avoid caching issues
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}_${timestamp}`);
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const imageUrl = await getDownloadURL(storageRef);
        
        // Update Firestore with the new image URL
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { profileImageUrl: imageUrl });
        
        // Update local state
        setProfileImage(imageUrl);
        setUploadSuccess(true);
        setUploadingProfile(false);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        setUploadingProfile(false);
      }
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = async (id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file && auth.currentUser) {
        try {
          setUploadingDocument(id);
          
          const docToUpdate = documents.find(doc => doc.id === id);
          if (!docToUpdate) return;
          
          // Create a reference to the storage location with timestamp to avoid caching
          const timestamp = new Date().getTime();
          const storageRef = ref(storage, `user_documents/${auth.currentUser.uid}/${docToUpdate.name}_${timestamp}`);
          
          // Upload the file
          await uploadBytes(storageRef, file);
          
          // Get the download URL
          const fileUrl = await getDownloadURL(storageRef);
          
          // Update local state
          const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const updatedDocs = documents.map(doc => {
            if (doc.id === id) {
              return {
                ...doc,
                uploadDate: today,
                fileUrl
              };
            }
            return doc;
          });
          
          setDocuments(updatedDocs);
          
          // Update Firestore
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { 
            documents: updatedDocs.map(doc => ({
              id: doc.id,
              name: doc.name,
              uploadDate: doc.uploadDate,
              fileUrl: doc.fileUrl
            }))
          });
          
          setUploadSuccess(true);
          setUploadingDocument(null);
        } catch (error) {
          console.error("Error uploading document:", error);
          setUploadingDocument(null);
        }
      }
    };
    
    fileInput.click();
  };

  // View document
  const viewDocument = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  // Save user data
  const handleSaveChanges = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          ...userData,
          lastUpdated: new Date().toISOString()
        });
        
        setIsEditing(false);
        setUploadSuccess(true);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
          >
            <Check className="mr-2 h-5 w-5" />
            Upload successful!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6 text-center"
      >
        <div className="relative w-28 h-28 mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-full h-full rounded-full overflow-hidden shadow-lg"
          >
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Profile Upload Button - Moved outside the image */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4"
          >
            <label
              htmlFor="profileUpload"
              className={`inline-flex items-center px-4 py-2 rounded-md shadow cursor-pointer transition-all
                ${uploadingProfile 
                  ? 'bg-gray-400 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {uploadingProfile ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Update Photo
                </>
              )}
            </label>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
              disabled={uploadingProfile}
            />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-4">{userData.fullName}</h2>
        <p className="text-gray-500">Account {userData.accountNumber}</p>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6 mt-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
            >
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md shadow hover:bg-gray-400 transition"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveChanges}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700 transition"
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </motion.button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(userData).map(([key, value]) =>
            key !== "accountNumber" &&
            key !== "memberSince" &&
            key !== "accountStatus" &&
            key !== "lastLogin" &&
            key !== "accountType" ? (
              <motion.div 
                key={key}
                whileHover={isEditing ? { scale: 1.02 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="text"
                  value={value}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    isEditing ? "border-gray-300" : "border-gray-100 bg-gray-100"
                  }`}
                />
              </motion.div>
            ) : null
          )}
        </div>
      </motion.div>

      {/* Uploaded Documents */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6 mt-6"
      >
        <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`border ${doc.fileUrl ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg p-4`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <FileText className={`h-6 w-6 ${doc.fileUrl ? 'text-green-500' : 'text-blue-500'}`} />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.uploadDate ? `Uploaded on ${doc.uploadDate}` : "Not uploaded yet"}
                  </p>
                </div>
              </div>
              
              <div className="flex mt-2 space-x-2">
                {doc.fileUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => viewDocument(doc.fileUrl)}
                    className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDocumentUpload(doc.id)}
                  disabled={uploadingDocument === doc.id}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition flex items-center justify-center
                    ${uploadingDocument === doc.id 
                      ? 'bg-gray-300 text-gray-500' 
                      : doc.fileUrl 
                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  {uploadingDocument === doc.id ? (
                    <>
                      <div className="mr-1 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      {doc.fileUrl ? 'Update' : 'Upload'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Upload, FileText, Edit2, Save, X } from "lucide-react";

// export default function ProfilePage() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileImage, setProfileImage] = useState("/default-avatar.png");
//   const [userData, setUserData] = useState({
//     fullName: "John Smith",
//     email: "john.smith@example.com",
//     phone: "(555) 123-4567",
//     dateOfBirth: "January 15, 1985",
//     address: "123 Main Street, City, State 12345",
//     accountNumber: "#12345678",
//     memberSince: "January 2023",
//     accountStatus: "Active",
//     lastLogin: "Today, 9:30 AM",
//     accountType: "Premium",
//   });

//   const [documents] = useState([
//     { id: 1, name: "ID Proof", uploadDate: "Jan 15, 2024" },
//     { id: 2, name: "Bank Statement", uploadDate: "Jan 10, 2024" },
//     { id: 3, name: "Income Proof", uploadDate: "Jan 05, 2024" },
//     { id: 4, name: "Address Proof", uploadDate: "Dec 28, 2023" },
//     { id: 5, name: "Tax Returns", uploadDate: "Dec 20, 2023" },
//     { id: 6, name: "Employment Letter", uploadDate: "Dec 15, 2023" },
//   ]);

//   // Handle Profile Image Upload
//   const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfileImage(imageUrl);
//     }
//   };

//   // Handle Document Upload
//   const handleDocumentUpload = (id: number) => {
//     alert(`Upload functionality for document ID: ${id} would be implemented here.`);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-4xl mx-auto py-12 px-6"
//     >
//       {/* Profile Header */}
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-xl shadow-md p-6 text-center"
//       >
//         <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden shadow-lg">
//           <img src= "/me.jpg" alt="Profile" className="w-full h-full object-cover" />
//           {isEditing && (
//             <>
//               <label
//                 htmlFor="profileUpload"
//                 className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition"
//               >
//                 <Upload className="h-5 w-5 text-white" />
//               </label>
//               <input
//                 id="profileUpload"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleProfileUpload}
//               />
//             </>
//           )}
//         </div>
//         <h2 className="text-2xl font-semibold mt-4">{userData.fullName}</h2>
//         <p className="text-gray-500">Account {userData.accountNumber}</p>
//       </motion.div>

//       {/* Personal Information */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="bg-white rounded-xl shadow-md p-6 mt-6"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Personal Information</h3>
//           {!isEditing ? (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
//             >
//               <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
//             </button>
//           ) : (
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md shadow hover:bg-gray-400 transition"
//               >
//                 <X className="h-4 w-4 mr-2" /> Cancel
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700 transition"
//               >
//                 <Save className="h-4 w-4 mr-2" /> Save Changes
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Object.entries(userData).map(([key, value]) =>
//             key !== "accountNumber" &&
//             key !== "memberSince" &&
//             key !== "accountStatus" &&
//             key !== "lastLogin" &&
//             key !== "accountType" ? (
//               <div key={key}>
//                 <label className="block text-sm font-medium text-gray-700 capitalize">
//                   {key.replace(/([A-Z])/g, " $1").trim()}
//                 </label>
//                 <input
//                   type="text"
//                   value={value}
//                   disabled={!isEditing}
//                   onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
//                   className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                     isEditing ? "border-gray-300" : "border-gray-100 bg-gray-100"
//                   }`}
//                 />
//               </div>
//             ) : null
//           )}
//         </div>
//       </motion.div>

//       {/* Uploaded Documents */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="bg-white rounded-xl shadow-md p-6 mt-6"
//       >
//         <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {documents.map((doc) => (
//             <motion.div
//               key={doc.id}
//               whileHover={{ scale: 1.05 }}
//               transition={{ type: "spring", stiffness: 100 }}
//               className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
//             >
//               <div className="flex items-center space-x-3">
//                 <FileText className="h-6 w-6 text-blue-500" />
//                 <div>
//                   <p className="font-medium">{doc.name}</p>
//                   <p className="text-xs text-gray-500">Uploaded on {doc.uploadDate}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleDocumentUpload(doc.id)}
//                 className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition flex items-center"
//               >
//                 <Upload className="h-4 w-4 mr-1" />
//                 Upload
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }




// 'use client';

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { User, FileText, Shield, Bell, CreditCard, Settings, Upload, Check, Clock, AlertTriangle } from 'lucide-react';

// // import Image from 'next/image';

// export default function ProfilePage() {
//   const [activeTab, setActiveTab] = useState('personal-info');
//   const [profileCompletion] = useState(75);
//   const [userData, setUserData] = useState({
//     fullName: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     dateOfBirth: '1990-01-01',
//     employmentStatus: 'Full-time employed',
//     annualIncome: '$75,000',
//     currentAddress: '123 Main Street',
//     city: 'New York',
//     stateZip: 'NY 10001',
//     creditScore: '700-749',
//     memberSince: 'January 2024',
//     accountId: '#12345789',
//     isVerified: true
//   });

//   const [documents] = useState([
//     { id: 1, type: 'ID Verification', status: 'verified', description: 'Valid driver\'s license or passport', uploadDate: 'Jan 15, 2024' },
//     { id: 2, type: 'Income Proof', status: 'verified', description: 'Latest pay stub or W2', uploadDate: 'Jan 15, 2024' },
//     { id: 3, type: 'Address Proof', status: 'pending', description: 'Utility bill', uploadDate: 'Jan 10, 2024' },
//     { id: 4, type: 'Bank Statements', status: 'pending', description: '3 months of statements', uploadDate: 'Jan 10, 2024' },
//     { id: 5, type: 'Tax Returns', status: 'required', description: 'Most recent tax return', uploadDate: null }
//   ]);

//   const [loanStatus] = useState({
//     currentStep: 1,
//     steps: [
//       { id: 1, name: 'Application Submitted', completed: true },
//       { id: 2, name: 'Document Verification', completed: false },
//       { id: 3, name: 'Credit Assessment', completed: false },
//       { id: 4, name: 'Final Review', completed: false },
//       { id: 5, name: 'Approve', completed: false }
//     ]
//   });

//   const handleUploadDocument = (documentId: string | number) => {
//     // This would typically open a file picker and handle the upload
//     alert(`Upload functionality for document ID: ${documentId} would be implemented here.`);
//   };
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1 
//       } 
//     }
//   };
  
//   // const itemVariants = {
//   //   hidden: { y: 20, opacity: 0 },
//   //   visible: { 
//   //     y: 0, 
//   //     opacity: 1,
//   //     transition: { type: 'spring', stiffness: 100 }
//   //   }
//   // };

//   // Function to get status badge color
//   const getStatusColor = (status: string): string => {
//     const statusMap: Record<string, string> = {
//       verified: "bg-green-100 text-green-800",
//       pending: "bg-yellow-100 text-yellow-800",
//       required: "bg-red-100 text-red-800",
//     };
//     return statusMap[status] || "bg-gray-100 text-gray-800"; // Default case
//   };
  
//   // Function to get status icon
//   const getStatusIcon = (status: string): React.ReactNode => { // ✅ Use React.ReactNode
//     const iconMap: Record<string, React.ReactNode> = {
//       verified: <Check className="h-4 w-4 text-green-600" />,
//       pending: <Clock className="h-4 w-4 text-yellow-600" />,
//       required: <AlertTriangle className="h-4 w-4 text-red-600" />,
//     };
//     return iconMap[status] || null; // Default case
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Sidebar */}
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           variants={containerVariants}
//           className="lg:w-1/4"
//         >
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
//             <div className="relative mx-auto w-24 h-24 mb-4">
//               <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
//                 <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
//                   {userData.fullName.split(' ').map(n => n[0]).join('')}
//                 </div>
//               </div>
//               {userData.isVerified && (
//                 <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
//                   <Check className="h-4 w-4 text-white" />
//                 </div>
//               )}
//             </div>
//             <h2 className="text-xl font-semibold">{userData.fullName}</h2>
//             <p className="text-gray-600 text-sm">{userData.email}</p>
//             <button className="mt-4 inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md">
//               <Upload className="h-4 w-4 mr-2" />
//               Upload New Photo
//             </button>
//           </div>

//           <nav className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <ul>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('personal-info')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'personal-info' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <User className={`h-5 w-5 mr-3 ${activeTab === 'personal-info' ? 'text-white' : 'text-blue-500'}`} />
//                   Personal Information
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('documents')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'documents' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <FileText className={`h-5 w-5 mr-3 ${activeTab === 'documents' ? 'text-white' : 'text-blue-500'}`} />
//                   Document Management
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('security')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'security' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <Shield className={`h-5 w-5 mr-3 ${activeTab === 'security' ? 'text-white' : 'text-blue-500'}`} />
//                   Security Settings
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('notifications')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'notifications' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <Bell className={`h-5 w-5 mr-3 ${activeTab === 'notifications' ? 'text-white' : 'text-blue-500'}`} />
//                   Notifications
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('loan-preferences')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'loan-preferences' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <CreditCard className={`h-5 w-5 mr-3 ${activeTab === 'loan-preferences' ? 'text-white' : 'text-blue-500'}`} />
//                   Loan Preferences
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveTab('account-settings')}
//                   className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition ${activeTab === 'account-settings' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`}
//                 >
//                   <Settings className={`h-5 w-5 mr-3 ${activeTab === 'account-settings' ? 'text-white' : 'text-blue-500'}`} />
//                   Account Settings
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </motion.div>

//         {/* Main Content */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="lg:w-3/4"
//         >
//           {/* Profile Completion Bar */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-medium">Profile Completion</h3>
//               <span className="text-blue-600 font-medium">{profileCompletion}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
//             </div>
//           </div>

//           {/* Personal Information Tab */}
//           {activeTab === 'personal-info' && (
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Personal Information</h2>
//                 <div className="text-sm text-gray-500">
//                   <span className="mr-2">Account ID: {userData.accountId}</span>
//                   <span>Member since: {userData.memberSince}</span>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="flex items-center">
//                     <input 
//                       type="text" 
//                       value={userData.fullName}
//                       onChange={(e) => setUserData({...userData, fullName: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <Check className="h-5 w-5 text-green-500 ml-2" />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Email Address</label>
//                   <div className="flex items-center">
//                     <input 
//                       type="email" 
//                       value={userData.email}
//                       onChange={(e) => setUserData({...userData, email: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <Check className="h-5 w-5 text-green-500 ml-2" />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <input 
//                     type="tel" 
//                     value={userData.phone}
//                     onChange={(e) => setUserData({...userData, phone: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                   <input 
//                     type="date" 
//                     value={userData.dateOfBirth}
//                     onChange={(e) => setUserData({...userData, dateOfBirth: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Employment Status</label>
//                   <select 
//                     value={userData.employmentStatus}
//                     onChange={(e) => setUserData({...userData, employmentStatus: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option>Full-time employed</option>
//                     <option>Part-time employed</option>
//                     <option>Self-employed</option>
//                     <option>Unemployed</option>
//                     <option>Retired</option>
//                     <option>Student</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Annual Income</label>
//                   <input 
//                     type="text" 
//                     value={userData.annualIncome}
//                     onChange={(e) => setUserData({...userData, annualIncome: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Current Address</label>
//                   <input 
//                     type="text" 
//                     value={userData.currentAddress}
//                     onChange={(e) => setUserData({...userData, currentAddress: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">City</label>
//                   <input 
//                     type="text" 
//                     value={userData.city}
//                     onChange={(e) => setUserData({...userData, city: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">State/ZIP</label>
//                   <input 
//                     type="text" 
//                     value={userData.stateZip}
//                     onChange={(e) => setUserData({...userData, stateZip: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Credit Score Range</label>
//                   <input 
//                     type="text" 
//                     value={userData.creditScore}
//                     onChange={(e) => setUserData({...userData, creditScore: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               <div className="mt-8 flex justify-end">
//                 <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Documents Tab */}
//           {activeTab === 'documents' && (
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold mb-6">Required Documents</h2>
              
//               <div className="space-y-4">
//                 {documents.map((doc) => (
//                   <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start space-x-3">
//                         <div className="flex-shrink-0 pt-1">
//                           <FileText className="h-6 w-6 text-blue-500" />
//                         </div>
//                         <div>
//                           <div className="flex items-center mb-1">
//                             <h3 className="font-medium text-gray-900 mr-2">{doc.type}</h3>
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
//                               {getStatusIcon(doc.status)}
//                               <span className="ml-1 capitalize">{doc.status}</span>
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600">{doc.description}</p>
//                           {doc.uploadDate && (
//                             <p className="text-xs text-gray-500 mt-1">Uploaded on {doc.uploadDate}</p>
//                           )}
//                         </div>
//                       </div>
                      
//                       <button
//                         onClick={() => handleUploadDocument(doc.id)}
//                         className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition flex items-center"
//                       >
//                         <Upload className="h-4 w-4 mr-1" />
//                         Upload Document
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Loan Status Section - Visible in all tabs */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
//             <h2 className="text-xl font-semibold mb-6">Loan Application Status</h2>
            
//             <div className="relative">
//               <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
//                 <div style={{ width: `${(loanStatus.currentStep / loanStatus.steps.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
//               </div>
              
//               <div className="flex justify-between">
//                 {loanStatus.steps.map((step) => (
//                   <div key={step.id} className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id <= loanStatus.currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
//                       {step.id}
//                     </div>
//                     <p className="text-xs text-center mt-2 max-w-[70px]">{step.name}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }