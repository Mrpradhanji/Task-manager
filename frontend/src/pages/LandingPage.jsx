import React from "react";
import { useNavigate } from "react-router-dom"
import { CheckCircle2, BarChart2, Calendar, Users, Shield, Sparkles, ArrowRight, Quote, HelpCircle, Mail, Star, TrendingUp, Clock } from "lucide-react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useState } from "react"

const features = [
  { icon: <CheckCircle2 className="w-8 h-8 text-cyan-400" />, title: "Smart Task Management", description: "Create, edit, and organize your tasks with ease. Stay on top of your work with intuitive controls. Attach files, set priorities, and add notes to every task." },
  { icon: <BarChart2 className="w-8 h-8 text-cyan-400" />, title: "Productivity Analytics", description: "Visualize your progress and productivity with beautiful, actionable analytics. Track completed tasks, streaks, and time spent." },
  { icon: <Calendar className="w-8 h-8 text-cyan-400" />, title: "Scheduling & Reminders", description: "Never miss a deadline. Set due dates, recurring tasks, and get timely reminders for your important tasks." },
  { icon: <Users className="w-8 h-8 text-cyan-400" />, title: "Team Collaboration", description: "Work together with your team. Assign, share, and track tasks collaboratively. Comment and mention teammates for seamless communication." },
  { icon: <Shield className="w-8 h-8 text-cyan-400" />, title: "Secure & Private", description: "Your data is protected with enterprise-grade security and privacy features. All information is encrypted and backed up." },
  { icon: <Sparkles className="w-8 h-8 text-cyan-400" />, title: "Modern Experience", description: "Enjoy a fast, responsive, and delightful interface on any device. Dark mode, keyboard shortcuts, and more!" }
]

const stats = [
  { icon: <Star className="w-7 h-7 text-yellow-400" />, label: "User Rating", value: 4.9, suffix: "/5" },
  { icon: <TrendingUp className="w-7 h-7 text-cyan-400" />, label: "Tasks Completed", value: 120000, suffix: "+" },
  { icon: <Clock className="w-7 h-7 text-cyan-400" />, label: "Avg. Time Saved", value: 12, suffix: "hrs/mo" }
]

const steps = [
  { icon: <ArrowRight className="w-6 h-6 text-cyan-300" />, title: "Sign Up Instantly", description: "Create your free account in seconds. No credit card required." },
  { icon: <ArrowRight className="w-6 h-6 text-cyan-300" />, title: "Add & Organize Tasks", description: "Quickly add tasks, set priorities, and organize your workflow." },
  { icon: <ArrowRight className="w-6 h-6 text-cyan-300" />, title: "Track & Achieve", description: "Monitor your progress and achieve your goals with ease." }
]

const testimonials = [
  { quote: "RTASK has completely changed the way I manage my work. The reminders and analytics keep me on track! I love the dark mode and the mobile experience.", name: "Alex J.", role: "Product Manager", details: "I used to miss deadlines, but now I always stay ahead. The analytics are a game changer." },
  { quote: "Our team collaboration has never been smoother. Assigning and tracking tasks is a breeze. The comment system is super helpful!", name: "Priya S.", role: "Team Lead", details: "We reduced our project delivery time by 30%. Everyone is more accountable and motivated." },
  { quote: "The interface is so clean and fast. I love using RTASK every day! The reminders and recurring tasks are my favorite features.", name: "Jordan K.", role: "Freelancer", details: "I manage multiple clients and projects, and RTASK keeps everything organized in one place." }
]

const valueProps = [
  { icon: <Shield className="w-7 h-7 text-cyan-400" />, title: "Data Security", desc: "We use industry-leading security to keep your data safe and private." },
  { icon: <Sparkles className="w-7 h-7 text-cyan-400" />, title: "User Friendly", desc: "Our interface is designed for simplicity and speed, so you can focus on what matters." },
  { icon: <Users className="w-7 h-7 text-cyan-400" />, title: "Collaboration", desc: "Work solo or with a team, RTASK adapts to your workflow." }
]

const faqs = [
  { q: "Is RTASK free to use?", a: "Yes! You can get started for free. Premium features may be available in the future." },
  { q: "Can I use RTASK on mobile?", a: "Absolutely. RTASK is fully responsive and works great on any device." },
  { q: "How do I invite my team?", a: "Sign up, create a workspace, and invite your teammates via email from your dashboard." },
  { q: "Is my data secure?", a: "Yes, we use enterprise-grade security and never share your data with third parties." }
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } }
}
const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
}
const bgFloat = {
  animate: {
    y: [0, 20, 0],
    x: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
}

const Counter = ({ value, suffix }) => {
  const controls = useAnimation()
  const [display, setDisplay] = useState(0)
  React.useEffect(() => {
    controls.start({ count: value, transition: { duration: 1.5, ease: "easeOut" } })
  }, [value])
  return (
    <motion.span
      initial={{ count: 0 }}
      animate={{ count: value }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {Math.floor(value)}{suffix}
    </motion.span>
  )
}

const LandingPage = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="w-full bg-slate-900/80 backdrop-blur border-b border-slate-800 fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}> 
            <img src="/rtask-logo.svg" alt="RTASK Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-cyan-400">RTASK</span>
          </div>
          <nav className="flex gap-6 items-center text-cyan-200 font-medium">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#why-choose" className="hover:text-cyan-400 transition-colors">Why Choose Us</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
            <button onClick={() => navigate('/login')} className="px-4 py-1 border border-cyan-400 rounded-lg text-cyan-400 hover:bg-slate-800 transition-colors">Sign In</button>
            <button onClick={() => navigate('/signup')} className="px-4 py-1 bg-cyan-400 text-slate-900 rounded-lg hover:bg-cyan-500 transition-colors">Sign Up</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-20">
        {/* Hero Section */}
        <motion.section
          className="relative w-full pt-20 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Animated floating shapes */}
          <motion.div className="absolute left-10 top-10 w-32 h-32 bg-cyan-900 rounded-full opacity-30 blur-2xl" variants={bgFloat} animate="animate" />
          <motion.div className="absolute right-10 bottom-10 w-40 h-40 bg-cyan-700 rounded-full opacity-20 blur-2xl" variants={bgFloat} animate="animate" />
          <div className="absolute inset-0 bg-[url('/vite.svg')] bg-no-repeat bg-right opacity-5 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center relative z-10">
            <motion.img src="/rtask-logo.svg" alt="RTASK Logo" className="w-20 h-20 mb-6 drop-shadow-lg" variants={fadeIn} />
            <motion.h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4 tracking-tight drop-shadow" variants={fadeIn} transition={{ delay: 0.1 }}>Organize. Track. Succeed.</motion.h1>
            <motion.p className="text-xl md:text-2xl text-cyan-100 mb-10 max-w-2xl drop-shadow" variants={fadeIn} transition={{ delay: 0.2 }}>RTASK is your modern solution for managing tasks, boosting productivity, and collaborating with your team—all in one place.</motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeIn} transition={{ delay: 0.3 }}>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 0 4px #22d3ee44" }}
                onClick={() => navigate('/signup')}
                className="px-10 py-4 bg-cyan-400 text-slate-900 rounded-lg font-bold hover:bg-cyan-500 transition-colors shadow-lg text-lg"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 0 4px #22d3ee44" }}
                onClick={() => navigate('/login')}
                className="px-10 py-4 border border-cyan-400 text-cyan-400 rounded-lg font-bold hover:bg-slate-800 transition-colors text-lg"
              >
                Sign In
              </motion.button>
            </motion.div>
          </div>
          {/* Animated stats */}
          <motion.div className="max-w-4xl mx-auto mt-16 flex flex-col sm:flex-row gap-8 justify-center items-center z-10 relative"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} className="flex flex-col items-center bg-slate-800/80 rounded-xl px-8 py-6 border border-slate-700 shadow" variants={fadeInUp}>
                <div className="mb-2">{stat.icon}</div>
                <span className="text-3xl font-bold text-cyan-200">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-cyan-400 text-sm mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950" id="features" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <h2 className="text-4xl font-bold text-center text-cyan-300 mb-14">Features</h2>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-md hover:shadow-xl transition-all flex flex-col items-start"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-cyan-100 mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section className="py-16 bg-slate-900 border-t border-slate-800" id="why-choose" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <h2 className="text-3xl font-bold text-center text-cyan-300 mb-10">Why Choose RTASK?</h2>
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8 justify-center items-center">
            {valueProps.map((v, idx) => (
              <motion.div key={idx} className="flex flex-col items-center text-center bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-sm w-full md:w-1/3" variants={fadeInUp} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <div className="mb-3">{v.icon}</div>
                <h4 className="text-lg font-semibold text-cyan-200 mb-1">{v.title}</h4>
                <p className="text-slate-300 text-base">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section className="py-16 bg-slate-900 border-t border-slate-800" id="how-it-works" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <h2 className="text-3xl font-bold text-center text-cyan-300 mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 justify-center items-center">
            {steps.map((step, idx) => (
              <motion.div key={idx} className="flex flex-col items-center text-center max-w-xs relative" variants={fadeInUp} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border-2 border-cyan-900">
                  {step.icon}
                </div>
                <h4 className="text-lg font-semibold text-cyan-200 mb-1 mt-2">{step.title}</h4>
                <p className="text-slate-300 text-base mb-2">{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute right-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-1 bg-cyan-900" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section className="py-16 bg-gradient-to-r from-slate-900 to-slate-950 border-t border-slate-800" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <h2 className="text-3xl font-bold text-center text-cyan-300 mb-12">What Our Users Say</h2>
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-md flex flex-col items-center text-center" variants={fadeInUp} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <Quote className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-slate-200 italic mb-4">"{t.quote}"</p>
                <span className="font-bold text-cyan-200">{t.name}</span>
                <span className="text-cyan-400 text-sm">{t.role}</span>
                <span className="text-slate-400 text-xs mt-2">{t.details}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section className="py-16 bg-slate-900 border-t border-slate-800" id="faq" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <h2 className="text-3xl font-bold text-center text-cyan-300 mb-10">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto px-4 flex flex-col gap-5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  className={`flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-cyan-400/40' : ''}`}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <button
                    className={`flex items-center justify-between w-full text-left px-6 py-5 focus:outline-none hover:bg-slate-700 transition-colors text-cyan-200 font-semibold text-lg border-l-4 ${isOpen ? 'border-cyan-400 bg-slate-800' : 'border-transparent'}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-6 h-6 text-cyan-400" />
                      {faq.q}
                    </span>
                    <motion.svg
                      width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 text-cyan-400"
                      initial={false}
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`answer-${idx}`}
                        id={`faq-answer-${idx}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-5 text-slate-300 text-base border-l-4 border-cyan-900 bg-slate-900/60"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Get in Touch Section */}
        <motion.section className="py-16 bg-gradient-to-r from-slate-950 to-slate-900 border-t border-slate-800" id="contact" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-cyan-300 mb-4">Get in Touch</h2>
            <p className="text-lg text-cyan-200 mb-8">Have questions or feedback? We'd love to hear from you.</p>
            <a href="mailto:support@rtask.com" className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-400 text-slate-900 rounded-lg font-semibold hover:bg-cyan-500 transition-colors shadow text-lg">
              <Mail className="w-5 h-5" /> support@rtask.com
            </a>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section className="py-20 bg-gradient-to-r from-cyan-900 to-slate-900" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.h2 className="text-4xl font-bold text-cyan-100 mb-4" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }}>Ready to boost your productivity?</motion.h2>
            <motion.p className="text-lg text-cyan-300 mb-8" variants={fadeIn}>Sign up now and start managing your tasks like a pro.</motion.p>
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 0 6px #22d3ee44" }}
              onClick={() => navigate('/signup')}
              className="px-12 py-5 bg-cyan-400 text-slate-900 font-bold rounded-lg shadow-lg hover:bg-cyan-500 transition-colors text-xl"
            >
              Get Started for Free
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <img src="/rtask-logo.svg" alt="RTASK Logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-cyan-400">RTASK</span>
          </div>
          <div className="flex gap-6 text-cyan-200 text-sm">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#why-choose" className="hover:text-cyan-400 transition-colors">Why Choose Us</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <p className="text-cyan-700 mt-2 md:mt-0">© {new Date().getFullYear()} RTASK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 





