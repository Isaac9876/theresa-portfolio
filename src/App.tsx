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
    section: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      }
    },
    card: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    },
    stagger: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    logo: {
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
    },
    letter: {
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
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      console.log('Sending email with params:', templateParams); // Debug log

      const response = await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        templateParams
      );

      console.log('Email sent successfully:', response); // Debug log

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        type: 'message'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setShowError(true);
      setErrorMessage('Failed to send message. Please try again.');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="group flex items-center"
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-sm px-4 py-1.5 rounded-md border border-gray-800/50 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-6 h-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-50"></div>
                        <div className="relative w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TO</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                          Theresa
                        </span>
                        <span className="text-lg font-light text-gray-300 tracking-wide">
                          Odoom
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center space-x-8"
            >
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 capitalize">
                    {item.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </motion.button>
              ))}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:hidden"
            >
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-2 text-gray-300 hover:text-white focus:outline-none group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-200"></div>
                <svg
                  className="h-6 w-6 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </motion.div>
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
              className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gray-800 fixed top-16 left-0 right-0 z-50"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      console.log('Clicking section:', item.id);
                      const element = document.getElementById(item.id);
                      console.log('Found element:', element);
                      scrollToSection(item.id);
                    }}
                    className="relative w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 capitalize">
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            className="mb-12"
          >
            <motion.img 
              src={profileImage} 
              alt="Theresa Odoom" 
              className="w-48 h-48 rounded-full mx-auto border-4 border-white shadow-2xl object-cover"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            Theresa Odoom
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
          >
            Journalist & Content Creator
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-6 mt-8"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium"
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="#featured-work"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-purple-500 text-white rounded-lg hover:bg-purple-500/10 transition-all duration-300 font-medium"
            >
              View My Work
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

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
      <section id="testimonials" className="py-24 relative">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url(${sectionBackgrounds.testimonials})`,
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
              Client Testimonials
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              What people say about my work
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300"
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
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-200">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
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
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Let's discuss your next project
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50">
                <h3 className="text-3xl font-semibold text-white mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-purple-400 w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-200 mb-2">Email</h4>
                      <a 
                        href="mailto:odoomtheresa448@gmail.com" 
                        className="text-2xl text-purple-400 hover:text-purple-300 transition-colors duration-300"
                      >
                        odoomtheresa448@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-purple-400 w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-200 mb-2">Phone</h4>
                      <a 
                        href="tel:+233599363312" 
                        className="text-2xl text-purple-400 hover:text-purple-300 transition-colors duration-300"
                      >
                        +233 59 936 3312
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="text-purple-400 w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-200 mb-2">Location</h4>
                      <p className="text-2xl text-purple-400">
                        Teshie, Accra, Ghana
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-700/50">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.973923539843!2d-0.0665!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sTeshie%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1647881234567!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-700/50">
                  <h4 className="text-xl font-medium text-gray-200 mb-6">Connect with me</h4>
                  <div className="flex space-x-6">
                    {[
                      { icon: FaLinkedin, href: "https://www.linkedin.com/in/theresa-odoom-7b0b0b1b3/" },
                      { icon: FaTwitter, href: "https://twitter.com/theresaodoom" },
                      { icon: FaInstagram, href: "https://www.instagram.com/theresaodoom/" }
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="text-purple-400 w-7 h-7" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-200 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-lg font-medium text-gray-200 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium text-lg"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Theresa Odoom</h3>
              <p className="text-gray-400">Award-winning journalist and content creator dedicated to telling compelling stories.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: "#about", label: "About" },
                  { href: "#skills", label: "Skills" },
                  { href: "#featured-work", label: "Work" },
                  { href: "#contact", label: "Contact" }
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/missodoom" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/missodoom" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.tiktok.com/@miss_odoom_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <FaTiktok className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Theresa Odoom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 