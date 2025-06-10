import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  Users, 
  Shield, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calendar,
  Bell,
  ClipboardList
} from "lucide-react"

const LandingPage = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Task Management",
      description: "Create, edit, and manage your tasks with an easy-to-use interface and basic categorization."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Task Tracking",
      description: "Monitor your tasks with due dates, priority levels, and completion status tracking."
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Visualize your productivity with detailed analytics and performance insights."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Task Organization",
      description: "Efficiently organize tasks with categories, priorities, and due dates for better productivity."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy features."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Basic Scheduling",
      description: "Set due dates and priorities for your tasks to manage your time effectively."
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 shadow-sm group hover:bg-[#3b82f6]/20 transition-all">
                  <ClipboardList className="w-6 h-6 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-2xl font-extrabold text-[#3b82f6]">
                  RTASK
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#1e293b] hover:text-[#3b82f6] transition-colors">Features</a>
              <a href="#benefits" className="text-[#1e293b] hover:text-[#3b82f6] transition-colors">Benefits</a>
              <button 
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-[#4dabf7]/5 text-[#e9ecef]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <span className={`block w-6 h-0.5 bg-[#e9ecef] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-[#e9ecef] transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-[#e9ecef] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1a1b2e]/95 border-t border-[#4dabf7]/10">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-[#e9ecef] hover:text-[#4dabf7] transition-colors">Features</a>
              <a href="#benefits" className="block text-[#e9ecef] hover:text-[#4dabf7] transition-colors">Benefits</a>
              <button 
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2 rounded-lg bg-[#4dabf7]/10 text-[#4dabf7] hover:bg-[#4dabf7]/20 transition-all border border-[#4dabf7]/20"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#00FFFF] mb-4">
                Welcome to RTASK
              </h1>
              <p className="text-xl text-[#00FFFF] mb-8">
                RTASK helps you manage your tasks efficiently, collaborate with your team, and achieve your goals faster than ever before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3 bg-[#00FFFF] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#00FFFF]/90 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border border-[#00FFFF] text-[#00FFFF] rounded-lg font-medium hover:bg-[#00FFFF]/10 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Powerful Features for{" "}
              <span className="text-[#3b82f6]">
                Modern Teams
              </span>
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
              Everything you need to manage tasks, collaborate with your team, and boost productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white border border-gray-100 hover:border-[#3b82f6]/20 transition-all group hover:shadow-lg hover:shadow-[#3b82f6]/5"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] mb-4 group-hover:bg-[#3b82f6]/15 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1e293b] mb-2">{feature.title}</h3>
                <p className="text-[#64748b]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0f9ff] border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
              Why Choose{" "}
              <span className="text-[#3b82f6]">
                RTASK?
              </span>
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
              Experience the difference with our powerful task management solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-white border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Smart Analytics</h3>
                  <p className="text-[#64748b]">
                    Track your productivity with detailed analytics and visual insights into your task completion patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Secure & Private</h3>
                  <p className="text-[#64748b]">
                    Your data is protected with enterprise-grade security and privacy features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#00FFFF]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xl font-extrabold text-[#3b82f6]">RTASK</span>
            <p className="mt-4 text-gray-400">
              © {new Date().getFullYear()} RTASK. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 



