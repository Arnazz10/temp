"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      const user = res.user;

      // ✅ Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ✅ Store user details in session storage
        sessionStorage.setItem("user", JSON.stringify({ uid: user.uid, ...userData }));
      } else {
        console.error("User data not found in Firestore");
      }

      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 -m-20"
    >
      <div className="bg-white shadow-xl rounded-lg p-6 w-96">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-blue-500 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0V8m0 4v4m-8-4V8m0 4v4" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-center text-sm mb-4">Sign in to continue</p>

        {/* Input Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <label className="block text-gray-700 text-sm font-medium">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />

          <label className="block text-gray-700 text-sm font-medium mt-3">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />

          <div className="flex justify-end mt-2">
            <button className="text-blue-500 text-sm hover:underline">Forgot Password?</button>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white p-3 mt-4 rounded-lg hover:bg-blue-500"
          >
            Sign In
          </button>
        </motion.div>

        {/* Alternative Sign-in Methods */}
        <div className="mt-4 text-center text-gray-500 text-sm">Or continue with</div>
        <div className="flex justify-center gap-4 mt-3">
          <button className="flex items-center gap-2 border p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35 11.1H12v2.67h5.5c-.53 2.3-2.56 3.94-5.5 3.94A6.9 6.9 0 015.14 12a6.9 6.9 0 017.86-7.1c1.78 0 3.33.64 4.56 1.73l1.9-1.89A9.8 9.8 0 0012 2a10 10 0 00-10 10 10 10 0 0010 10c5.18 0 9.68-3.94 9.68-10 0-.67-.08-1.33-.2-1.9z"></path>
            </svg>
            Google
          </button>
          <button className="flex items-center gap-2 border p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.43 2c-1.45 0-2.95.8-3.71 2.1-.76-1.3-2.26-2.1-3.71-2.1-2.65 0-4.5 2.23-4.5 5.3 0 3.8 3.48 6.9 7.71 10.2 4.23-3.3 7.71-6.4 7.71-10.2 0-3.07-1.85-5.3-4.5-5.3z"></path>
            </svg>
            Apple
          </button>
        </div>

        {/* Sign Up Redirect */}
        <p className="text-gray-500 text-sm text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/sign-up")}
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default SignIn;
