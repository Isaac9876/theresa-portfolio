import React, { useState, useEffect, useRef } from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaGraduationCap, FaUser, FaLightbulb, FaCamera, FaPenFancy, FaMicrophone, FaMoon, FaSun, FaEnvelope, FaCalendarAlt, FaFileDownload, FaArrowRight, FaCheck, FaDownload } from 'react-icons/fa'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { emailConfig } from './config/emailConfig'
// @ts-ignore
import profileImage from './assets/profile.jpg'
// @ts-ignore
import altImage from './assets/alt.jpg'
// @ts-ignore
import ikeImage from './assets/ike.jpg'
// @ts-ignore
import ikbImage from './assets/ikb.jpg'
// @ts-ignore
import isaacImage from './assets/isaac.jpg'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeSection, setActiveSection] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'message'
  })

  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    projectType: '',
    projectDetails: ''
  })

  const contactFormRef = useRef<HTMLFormElement>(null)
  const bookingFormRef = useRef<HTMLFormElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  const staggerContainer: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const nameAnimation: Variants = {
    initial: { 
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  const sectionBackgrounds = {
    about: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070',
    skills: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
    traits: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    contact: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029',
    work: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070',
    mediaKit: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070',
    booking: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070'
  }

  const heroBackground = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'

  const logoVariants: Variants = {
    initial: { 
      opacity: 0,
      y: -20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const letterVariants: Variants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  // Add notification timeout
  useEffect(() => {
    if (formStatus === 'success' || formStatus === 'error') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
        setValidationErrors({ name: '', email: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const validateForm = (form: HTMLFormElement) => {
    const errors = {
      name: '',
      email: '',
      message: ''
    };

    // Name validation
    const name = form.user_name.value;
    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    const email = form.user_email.value;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Message validation
    const message = form.message.value;
    if (!message) {
      errors.message = 'Message is required';
    } else if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (message.length > 1000) {
      errors.message = 'Message must be less than 1000 characters';
    }

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!validateForm(form)) {
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');

    try {
      await emailjs.sendForm(
        emailConfig.serviceID,
        emailConfig.templateID,
        formRef.current!,
        emailConfig.publicKey
      );
      setFormStatus('success');
      formRef.current?.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus('error');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)
    setShowError(false)
    setErrorMessage('')

    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        contactFormRef.current!,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      )

      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        message: '',
        type: 'message'
      })
    } catch (error) {
      setShowError(true)
      setErrorMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)
    setShowError(false)
    setErrorMessage('')

    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_BOOKING_TEMPLATE_ID', // Replace with your EmailJS booking template ID
        bookingFormRef.current!,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      )

      setShowSuccess(true)
      setBookingData({
        name: '',
        email: '',
        projectType: '',
        projectDetails: ''
      })
    } catch (error) {
      setShowError(true)
      setErrorMessage('Failed to send booking request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center"
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <motion.div
                variants={logoVariants}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <span className="text-white font-bold text-lg">TO</span>
                  </motion.div>
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <motion.div
                    className="flex"
                    variants={logoVariants}
                  >
                    {"Theresa Odoom".split("").map((letter, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={letterVariants}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-lg"
                        whileHover={{ 
                          scale: 1.2,
                          transition: { duration: 0.2 }
                        }}
                        animate={{
                          backgroundPosition: ['0%', '100%'],
                          backgroundSize: ['200%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.div
                    className="text-purple-400 text-sm"
                    variants={logoVariants}
                  >
                    Journalist & Content Creator
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { href: "#about", label: "About" },
                { href: "#skills", label: "Skills" },
                { href: "#education", label: "Education" },
                { href: "#traits", label: "Traits" },
                { href: "#featured-work", label: "Work" },
                { href: "#media-kit", label: "Media Kit" }
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium"
              >
                Contact Me
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-16"
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(1px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.img 
              src={profileImage} 
              alt="Theresa Odoom" 
              className="w-40 h-40 rounded-full mx-auto border-4 border-white shadow-xl object-cover"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="flex justify-center space-x-1"
                initial="initial"
                animate="animate"
              >
                {"Theresa Odoom".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    whileHover={{ 
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                    animate={{
                      backgroundPosition: ['0%', '100%'],
                      backgroundSize: ['200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                className="mt-2 text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Journalist & Content Creator
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className="flex flex-wrap justify-center gap-1"
              initial="initial"
              animate="animate"
            >
              {[
                "Crafting",
                "compelling",
                "stories",
                "and",
                "creating",
                "engaging",
                "content",
                "that",
                "resonates",
                "with",
                "audiences"
              ].map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  className="text-lg text-gray-200"
                  whileHover={{ 
                    scale: 1.1,
                    color: "#a855f7",
                    transition: { duration: 0.2 }
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center space-x-4 mt-6"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-lg hover:from-purple-700 hover:via-pink-600 hover:to-red-600 transition-all duration-300"
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="#featured-work"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-3 border-2 border-purple-500 text-white rounded-lg hover:bg-purple-500/10 transition-all duration-300"
            >
              View My Work
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.about})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              About Me
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get to know me better
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={ikeImage}
                alt="Theresa Odoom"
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500/20 rounded-lg -z-10" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.p 
                className="text-lg text-gray-200 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                I am a passionate journalist and content creator with a keen eye for storytelling and a dedication to creating engaging content that resonates with audiences. With years of experience in the industry, I have developed a unique ability to connect with people through compelling narratives and authentic communication.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-200 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                My work spans across various platforms, from traditional journalism to digital content creation, allowing me to reach and engage with diverse audiences. I believe in the power of storytelling to inspire, educate, and create meaningful connections.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.skills})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Skills & Expertise
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              What I bring to the table
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Journalism",
                skills: [
                  "Investigative Reporting",
                  "News Writing",
                  "Interview Techniques",
                  "Fact-Checking",
                  "Ethical Journalism"
                ]
              },
              {
                title: "Content Creation",
                skills: [
                  "Social Media Strategy",
                  "Content Planning",
                  "Copywriting",
                  "Brand Storytelling",
                  "Audience Engagement"
                ]
              },
              {
                title: "Technical Skills",
                skills: [
                  "Video Editing",
                  "Photo Editing",
                  "Audio Production",
                  "CMS Management",
                  "Analytics & SEO"
                ]
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="flex items-center text-gray-200">
                      <FaCheck className="text-purple-400 mr-2" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            Education
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Bachelor of Arts in Journalism</h3>
              <p className="text-purple-400 mb-4">University of Media Arts and Communication (UniMAC)</p>
              <p className="text-gray-300 mb-2">2023 - 2027</p>
              <p className="text-gray-400">Studied broadcast journalism, media ethics, and digital storytelling</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Certificate in Digital Media</h3>
              <p className="text-purple-400 mb-4">University of Media Arts and Communication (UniMAC)</p>
              <p className="text-gray-300 mb-2">2023 - Present</p>
              <p className="text-gray-400">Specialized in digital content creation and social media management</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traits Section */}
      <section id="traits" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.traits})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Personal Traits
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              What makes me unique
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLightbulb className="w-8 h-8" />,
                title: "Creative",
                description: "Always thinking outside the box"
              },
              {
                icon: <FaUser className="w-8 h-8" />,
                title: "Adaptable",
                description: "Quick to learn and adjust"
              },
              {
                icon: <FaPenFancy className="w-8 h-8" />,
                title: "Detail-oriented",
                description: "Paying attention to every aspect"
              },
              {
                icon: <FaMicrophone className="w-8 h-8" />,
                title: "Communicative",
                description: "Clear and effective communication"
              }
            ].map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
                  y: -5
                }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center transition-all duration-300"
              >
                <motion.div 
                  className="text-purple-400 mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {trait.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-white mb-2 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {trait.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-200 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {trait.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            What People Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={isaacImage} 
                    alt="Isaac Kodom Boateng" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Isaac Kodom Boateng</h3>
                  <p className="text-purple-400 text-sm">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Working with Theresa has been an absolute pleasure. Her attention to detail and creative approach to content creation has helped bring our digital projects to life. She's not just a content creator, but a true digital storyteller."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Sarah Johnson</h3>
                  <p className="text-purple-400 text-sm">News Editor</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Theresa's journalistic skills are outstanding. Her ability to find and tell compelling stories, combined with her digital expertise, makes her a valuable asset in today's media landscape. She brings fresh perspectives to every project."
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                    alt="Michael Kwesi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Michael Kwesi</h3>
                  <p className="text-purple-400 text-sm">Digital Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Theresa's strategic approach to digital content has transformed our social media presence. Her understanding of audience engagement and content trends has helped us achieve remarkable growth in our online community."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.contact})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Let's discuss your project or collaboration
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Contact Form</h3>
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    id="name"
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="[A-Za-z\s]+"
                    disabled={formStatus === 'sending'}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    id="email"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    disabled={formStatus === 'sending'}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={1000}
                    disabled={formStatus === 'sending'}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your message"
                  />
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.message}</p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === 'sending'}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Book Me</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-gray-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="booking-name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="booking-email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="project-type" className="block text-sm font-medium text-gray-200 mb-2">
                    Project Type
                  </label>
                  <select
                    id="project-type"
                    value={bookingData.projectType}
                    onChange={(e) => setBookingData({ ...bookingData, projectType: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a project type</option>
                    <option value="journalism">Journalism</option>
                    <option value="content-creation">Content Creation</option>
                    <option value="video-production">Video Production</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-details" className="block text-sm font-medium text-gray-200 mb-2">
                    Project Details
                  </label>
                  <textarea
                    id="project-details"
                    value={bookingData.projectDetails}
                    onChange={(e) => setBookingData({ ...bookingData, projectDetails: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell me about your project"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Notification */}
          <AnimatePresence>
            {formStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center"
              >
                Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}
            {formStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center"
              >
                {validationErrors.name || validationErrors.email || validationErrors.message || 'Oops! Something went wrong. Please try again later.'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CV/Resume Section */}
      <section id="resume" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.about})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Resume
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              View my professional experience
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Professional Summary</h3>
              <p className="text-gray-200 mb-6">
                Experienced journalist and content creator with a proven track record in digital media, 
                broadcast journalism, and social media management. Skilled in creating engaging content 
                that resonates with diverse audiences.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white">Key Skills</h4>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    <li>Digital Content Creation</li>
                    <li>Broadcast Journalism</li>
                    <li>Social Media Management</li>
                    <li>Video Production</li>
                    <li>Storytelling & Narrative Development</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Experience Highlights</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white">Senior Content Creator</h4>
                  <p className="text-purple-400">2020 - Present</p>
                  <ul className="list-disc list-inside text-gray-200 mt-2 space-y-1">
                    <li>Developed and executed content strategies</li>
                    <li>Managed social media campaigns</li>
                    <li>Created engaging video content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Broadcast Journalist</h4>
                  <p className="text-purple-400">2018 - 2020</p>
                  <ul className="list-disc list-inside text-gray-200 mt-2 space-y-1">
                    <li>Produced daily news segments</li>
                    <li>Conducted interviews</li>
                    <li>Wrote and edited news stories</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              <FaFileDownload className="mr-2" />
              Download Full Resume
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section id="featured-work" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.work})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Work
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Recent projects and published works
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Investigative Journalism Series",
                category: "Journalism",
                image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "#"
              },
              {
                title: "Social Media Campaign",
                category: "Content Creation",
                image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "#"
              },
              {
                title: "Video Documentary",
                category: "Video Production",
                image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                link: "#"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-purple-400">{project.category}</span>
                  <h3 className="text-xl font-semibold text-white mt-2">{project.title}</h3>
                  <motion.a
                    href={project.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center mt-4 text-purple-400 hover:text-purple-300"
                  >
                    View Project
                    <FaArrowRight className="ml-2" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section id="media-kit" className="py-20 relative bg-gray-900">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.mediaKit})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Media Kit
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Download my media kit and press materials
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <div className="text-center">
                <FaFileDownload className="text-5xl text-purple-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Download Media Kit</h3>
                <p className="text-gray-200 mb-6">
                  Get access to my professional bio, high-resolution photos, and media assets.
                </p>
                <motion.a
                  href="/theresa-odoom-media-kit.pdf"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                >
                  <FaDownload className="mr-2" />
                  Download PDF
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Media Kit Contents</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">Professional Bio</h4>
                    <p className="text-gray-300 text-sm">Detailed biography and career highlights</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">High-Resolution Photos</h4>
                    <p className="text-gray-300 text-sm">Professional headshots and event photos</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">Press Coverage</h4>
                    <p className="text-gray-300 text-sm">Featured articles and media appearances</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">Social Media Stats</h4>
                    <p className="text-gray-300 text-sm">Audience demographics and engagement metrics</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">Contact Information</h4>
                    <p className="text-gray-300 text-sm">Professional contact details and booking information</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Press & Recognition Section */}
      <section id="press" className="py-20 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.work})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(0px)'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Press & Recognition
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Featured in media and industry recognition
            </motion.p>
          </motion.div>
          <div className="space-y-8">
            {[
              {
                title: "Young Journalist of the Year",
                organization: "Ghana Media Awards",
                year: "2023",
                description: "Recognized for outstanding contributions to investigative journalism"
              },
              {
                title: "Featured Content Creator",
                organization: "Digital Media Summit",
                year: "2023",
                description: "Highlighted for innovative social media content strategies"
              },
              {
                title: "Media Excellence Award",
                organization: "Journalism Association",
                year: "2022",
                description: "Awarded for exceptional reporting and storytelling"
              }
            ].map((recognition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{recognition.title}</h3>
                    <p className="text-purple-400">{recognition.organization}</p>
                    <p className="text-gray-200 mt-2">{recognition.description}</p>
                  </div>
                  <span className="text-gray-400">{recognition.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="work-experience" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            Experience Highlights
          </motion.h2>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Senior Content Creator</h3>
              <p className="text-purple-400 mb-4">Freelance</p>
              <p className="text-gray-300 mb-2">2023 - Present</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Developed and executed content strategies</li>
                <li>Managed social media campaigns</li>
                <li>Created engaging video content</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Broadcast Journalist</h3>
              <p className="text-purple-400 mb-4">Ghana Broadcasting Corporation</p>
              <p className="text-gray-300 mb-2">2023 - 2027</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Produced daily news segments</li>
                <li>Conducted interviews</li>
                <li>Wrote and edited news stories</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Theresa Odoom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App 