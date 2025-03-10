"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const user = sessionStorage.getItem("user");

    if (!user) {
      router.push("/sign-in"); // Redirect to Sign-In if not logged in
    } else {
      // Add slight delay for smooth transition
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [router]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          className="text-blue-600 font-semibold text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col md:flex-row items-center gap-12"
        >
          <motion.div variants={slideUp} className="md:w-1/2">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-blue-600">AI-Powered</span> Loan Decisions
              Made Simple
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Get faster, fairer loan approvals powered by advanced artificial
              intelligence. Our system ensures accurate decisions while
              eliminating human bias.
            </motion.p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex gap-4 flex-wrap"
            >
              <Link href="/apply">
                <motion.button
                  variants={staggerItem}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Apply for Loan
                </motion.button>
              </Link>
              <Link href="/explainability" className="inline-block">
                <motion.button
                  variants={staggerItem}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(219, 234, 254, 0.4)",
                  }}
                  className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex gap-12 mt-12"
            >
              {[
                { label: "Accuracy Rate", value: "93%" },
                { label: "Avg. Processing", value: "24h" },
                { label: "Loans Processed", value: "10,000+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="stats-card"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 bg-blue-100 rounded-full z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-100 rounded-full z-0"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <Image
                  src="/1.jpg"
                  alt="Loan AI"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-7xl mx-auto px-6 py-20 text-center"
        >
          <motion.h2
            variants={slideUp}
            className="text-4xl font-bold mb-4 text-gray-900"
          >
            Our Services
          </motion.h2>
          <motion.p
            variants={slideUp}
            className="text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Choose the financing option that works best for your specific needs
          </motion.p>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Personal Loan",
                desc: "Quick personal loans with flexible repayment options.",
                icon: "💰",
              },
              {
                title: "Business Loan",
                desc: "Grow your business with our adaptive financing solutions.",
                icon: "🏢",
              },
              {
                title: "Fast Loan",
                desc: "Get instant approval with minimal documentation.",
                icon: "⚡",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
                <Link href="/explainability" className="inline-block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-6 text-blue-600 font-medium"
                  >
                    Learn more →
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* How We Work Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="bg-gradient-to-b from-white to-blue-50 py-20"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              variants={slideUp}
              className="text-4xl font-bold mb-4 text-gray-900"
            >
              How We Work
            </motion.h2>
            <motion.p
              variants={slideUp}
              className="text-gray-600 max-w-2xl mx-auto mb-12"
            >
              Our streamlined process makes getting a loan quick and easy
            </motion.p>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {[
                {
                  title: "Application",
                  desc: "Fill out our simple online application form in just minutes.",
                  number: "01",
                },
                {
                  title: "Documentation & Verification",
                  desc: "Submit required documents for quick verification.",
                  number: "02",
                },
                {
                  title: "Credit Assessment",
                  desc: "Our AI rapidly evaluates your credit profile with fairness.",
                  number: "03",
                },
                {
                  title: "Loan Approval",
                  desc: "Get your loan approved and funds disbursed to your account.",
                  number: "04",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-all duration-500" />
                  <div className="relative z-10">
                    <span className="text-6xl font-bold text-blue-100 absolute -top-6 -left-2">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-blue-600 mb-3 relative">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 relative">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="bg-white py-20"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <motion.div variants={slideUp} className="md:w-1/2 relative">
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-100 rounded-full z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <Image
                  src="/2.jpg"
                  alt="About Us"
                  width={400}
                  height={200}
                  className="rounded-2xl shadow-xl object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div variants={slideUp} className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                About Us
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We are committed to providing innovative financial solutions
                that empower individuals and businesses. Our AI-driven approach
                ensures seamless lending experiences for all customers, with a
                focus on fairness, speed, and transparency.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our team combines financial expertise with cutting-edge
                technology to revolutionize the lending industry.
              </p>
              <Link href="/about">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Read More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section - New addition */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="bg-blue-600 py-16"
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h2
              variants={slideUp}
              className="text-3xl font-bold mb-6 text-white"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              variants={slideUp}
              className="text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Apply today and experience the future of lending with our
              AI-powered platform.
            </motion.p>
            <motion.button
              variants={staggerItem}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(255, 255, 255, 0.2)",
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              Apply Now
            </motion.button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-gray-900 py-12 text-center text-gray-400">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
              <div>
                <h3 className="text-white font-semibold mb-4">AI-LoanPro</h3>
                <p className="text-gray-400">
                  Innovative AI-powered lending solutions for everyone.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-400">info@ailoanpro.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800">
              <p>
                © {new Date().getFullYear()} AI-LoanPro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AnimatePresence>
  );
}
