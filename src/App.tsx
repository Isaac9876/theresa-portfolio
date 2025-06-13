import React, { useState, useEffect, useRef } from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaGraduationCap, FaUser, FaLightbulb, FaCamera, FaPenFancy, FaMicrophone, FaMoon, FaSun, FaEnvelope, FaCalendarAlt, FaFileDownload, FaArrowRight, FaCheck, FaDownload, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter } from 'react-icons/fa'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Add testimonials data
  const testimonials = [
    {
      name: "Isaac Kodom Boateng",
      title: "Software Developer",
      image: isaacImage,
      content: "Theresa's work is exceptional. Her attention to detail and ability to capture the essence of a story is remarkable."
    },
    {
      name: "Michael Chen",
      title: "Editor-in-Chief",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
      content: "Working with Theresa has been a pleasure. Her professionalism and creativity bring stories to life."
    },
    {
      name: "Aisha Osei",
      title: "Media Producer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
      content: "Theresa's storytelling abilities are unmatched. She has a unique way of connecting with her audience."
    }
  ];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(emailConfig.publicKey)
  }, [])

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

  const animations = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    },
    slideIn: {
      hidden: { x: -50, opacity: 0 },
      visible: { 
        x: 0, 
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    },
    scaleIn: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    },
    card: {
      hidden: { y: 50, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    },
    stagger: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2
        }
      }
    },
    bounce: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      }
    },
    fadeInUp: {
      hidden: { y: 30, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }
    },
    rotateIn: {
      hidden: { rotate: -10, opacity: 0 },
      visible: {
        rotate: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      }
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');

    try {
      const templateParams = {
        to_name: "Isaac Kodom Boateng",
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      console.log('Attempting to send email with params:', templateParams);
      console.log('Using service ID:', emailConfig.serviceID);
      console.log('Using template ID:', emailConfig.templateID);

      const response = await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        templateParams,
        emailConfig.publicKey
      );

      console.log('Email sent successfully:', response);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        type: 'message'
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      setShowError(true);
      setErrorMessage(
        error.text || 
        'Failed to send message. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)
    setShowError(false)
    setErrorMessage('')

    try {
      await emailjs.sendForm(
        emailConfig.serviceID,
        emailConfig.templateID,
        bookingFormRef.current!,
        emailConfig.publicKey
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

  const sectionBackgrounds = {
    about: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070',
    skills: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
    traits: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    contact: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029',
    work: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070',
    mediaKit: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070',
    booking: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070',
    testimonials: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'
  }

  const heroBackground = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      // Close mobile menu first
      setIsMobileMenuOpen(false);

      // Add a small delay before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Navigation items with their corresponding section IDs
  const navigationItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'featured-work', label: 'Featured Work' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="group flex items-center"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-md border border-gray-800/50 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-50"></div>
                      <div className="relative w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs font-bold">TO</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                        Theresa
                      </span>
                      <span className="text-base sm:text-lg font-light text-gray-300 tracking-wide">
                        Odoom
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['about', 'skills', 'featured-work', 'testimonials', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item);
                  }}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors duration-200"
              >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors duration-200"
              >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current my-1 transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            >
              {/* Profile Card */}
              <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-50"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
                      <img
                        src={profileImage}
                        alt="Theresa Odoom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theresa Odoom</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    Journalism Student & Content Creator
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 space-y-3">
                {['about', 'services', 'portfolio', 'testimonials', 'contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      activeSection === item
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="about" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="block">
                    {Array.from("Theresa Odoom").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut"
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                  <span className="block text-purple-600 dark:text-purple-400 mt-2">
                    {Array.from("Journalist & Content Creator").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.5 + index * 0.03,
                          ease: "easeOut"
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
                >
                  Crafting compelling stories and creating engaging content that resonates with audiences worldwide.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('contact');
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                  >
                    Get in Touch
                  </a>
                  <a
                    href="#portfolio"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('portfolio');
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    View Portfolio
                  </a>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-xl opacity-20"></div>
                  <motion.div 
                    className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.img
                      src={profileImage}
                      alt="Theresa Odoom"
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -right-4 top-1/4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Journalist</span>
                  </motion.div>
                  <motion.div
                    className="absolute -left-4 bottom-1/4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <span className="text-sm font-medium text-pink-600 dark:text-pink-400">Content Creator</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative">
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
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                About Me
              </motion.h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <motion.p 
                className="text-xl text-gray-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Get to know me better
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={ikeImage}
                    alt="Theresa Odoom"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500/20 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -left-6 w-48 h-48 bg-pink-500/20 rounded-lg -z-10"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold text-white">Who I Am</h3>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    I am a passionate journalist and content creator with a keen eye for storytelling and a dedication to creating engaging content that resonates with audiences. With years of experience in the industry, I have developed a unique ability to connect with people through compelling narratives and authentic communication.
                  </p>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaPenFancy className="text-purple-400 w-5 h-5" />
                      <h4 className="text-lg font-semibold text-white">Writing</h4>
                    </div>
                    <p className="text-gray-300">Crafting compelling stories and engaging content that captures attention and drives engagement.</p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaCamera className="text-purple-400 w-5 h-5" />
                      <h4 className="text-lg font-semibold text-white">Photography</h4>
                    </div>
                    <p className="text-gray-300">Capturing moments and creating visual stories that complement written content.</p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaMicrophone className="text-purple-400 w-5 h-5" />
                      <h4 className="text-lg font-semibold text-white">Interviewing</h4>
                    </div>
                    <p className="text-gray-300">Conducting insightful interviews that reveal authentic stories and perspectives.</p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaUser className="text-purple-400 w-5 h-5" />
                      <h4 className="text-lg font-semibold text-white">Content Creation</h4>
                    </div>
                    <p className="text-gray-300">Developing engaging content across multiple platforms to reach diverse audiences.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex justify-center lg:justify-start"
                >
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium"
                  >
                    Let's Work Together
                    <FaArrowRight className="ml-2" />
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 relative">
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
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Skills & Expertise
              </motion.h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <motion.p 
                className="text-xl text-gray-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                What I bring to the table
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
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
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-purple-400 mb-4">{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{skill.title}</h3>
                  <p className="text-gray-300">{skill.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section id="featured-work" className="py-24 relative">
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
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Featured Work
              </motion.h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <motion.p 
                className="text-xl text-gray-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Recent projects and published works
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
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
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-purple-400">{project.category}</span>
                    <h3 className="text-xl font-semibold text-white mt-2 mb-4">{project.title}</h3>
                    <motion.a
                      href={project.link}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      View Project
                      <FaArrowRight className="ml-2" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Testimonials
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                What clients and collaborators say about working with me
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={animations.fadeInUp}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Let's discuss how we can work together to achieve your goals
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={animations.fadeIn}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg"
              >
                <form ref={contactFormRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                      isSubmitting
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {showSuccess && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                      Message sent successfully!
                    </div>
                  )}

                  {showError && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      {errorMessage}
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={animations.fadeIn}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <FaEnvelope className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <a 
                        href="mailto:odoomtheresa448@gmail.com" 
                        className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 break-all"
                      >
                        odoomtheresa448@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaPhone className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <a href="tel:+233599363312" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                        +233 59 936 3312
                      </a>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaMapMarkerAlt className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Accra Teshie, Ghana
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Location
                  </h3>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.973444!2d-0.0678913!3d5.6037168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sTeshie%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1647881234567!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Social Media
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://www.facebook.com/missodoom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/missodoom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@miss_odoom_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      <FaTiktok className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Services
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive media solutions tailored to your needs
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: <FaGraduationCap className="w-8 h-8" />,
                  title: "Educational Content",
                  description: "Creating engaging educational materials that make learning accessible and enjoyable."
                },
                {
                  icon: <FaUser className="w-8 h-8" />,
                  title: "Personal Branding",
                  description: "Helping individuals and organizations build and maintain their unique brand identity."
                },
                {
                  icon: <FaLightbulb className="w-8 h-8" />,
                  title: "Content Strategy",
                  description: "Developing comprehensive content strategies that align with your goals and audience."
                },
                {
                  icon: <FaCamera className="w-8 h-8" />,
                  title: "Photography",
                  description: "Professional photography services for events, portraits, and commercial needs."
                },
                {
                  icon: <FaPenFancy className="w-8 h-8" />,
                  title: "Writing Services",
                  description: "Expert writing services including articles, blogs, and creative content."
                },
                {
                  icon: <FaMicrophone className="w-8 h-8" />,
                  title: "Voice Over",
                  description: "Professional voice over services for various media projects."
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={animations.bounce}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-purple-600 dark:text-purple-400 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Portfolio
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A showcase of my best work and achievements
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  title: "Educational Series",
                  description: "A comprehensive educational content series for online learning platforms.",
                  image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000",
                  category: "Education"
                },
                {
                  title: "Brand Campaign",
                  description: "Successful brand awareness campaign for a leading organization.",
                  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
                  category: "Branding"
                },
                {
                  title: "Documentary Series",
                  description: "Award-winning documentary series on social issues.",
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
                  category: "Documentary"
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  variants={animations.rotateIn}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={animations.fadeIn}
        className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={animations.stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={animations.slideIn} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A passionate journalist and content creator dedicated to telling compelling stories.
              </p>
            </motion.div>

            <motion.div variants={animations.slideIn} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                {['about', 'services', 'portfolio', 'testimonials', 'contact'].map((item) => (
                  <motion.li
                    key={item}
                    variants={animations.fadeInUp}
                    whileHover={{ x: 5 }}
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <a
                      href={`#${item}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item);
                      }}
                      className="transition-colors duration-200"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={animations.slideIn} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connect</h3>
              <div className="flex space-x-4">
                {['https://www.facebook.com/missodoom', 'https://www.instagram.com/missodoom', 'https://www.tiktok.com/@miss_odoom_'].map((url, index) => (
                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={animations.scaleIn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {url.includes('facebook') && <FaFacebook className="w-5 h-5" />}
                    {url.includes('instagram') && <FaInstagram className="w-5 h-5" />}
                    {url.includes('tiktok') && <FaTiktok className="w-5 h-5" />}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={animations.fadeIn}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300"
          >
            <p>© {new Date().getFullYear()} Theresa Odoom. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App 