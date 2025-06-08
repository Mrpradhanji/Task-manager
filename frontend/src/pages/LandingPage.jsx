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
      title: "Smart Task Management",
      description: "Organize your tasks with our intuitive drag-and-drop interface and smart categorization."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Stay on top of your tasks with instant notifications and real-time progress tracking."
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Visualize your productivity with detailed analytics and performance insights."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team through shared tasks and real-time updates."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy features."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Plan your tasks efficiently with our intelligent scheduling system."
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
                  TaskFlow
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#1e293b] hover:text-[#3b82f6] transition-colors">Features</a>
              <a href="#benefits" className="text-[#1e293b] hover:text-[#3b82f6] transition-colors">Benefits</a>
              <a href="#pricing" className="text-[#1e293b] hover:text-[#3b82f6] transition-colors">Pricing</a>
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
              <a href="#pricing" className="block text-[#e9ecef] hover:text-[#4dabf7] transition-colors">Pricing</a>
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1e293b] mb-6">
              Organize Tasks,{" "}
              <span className="text-[#3b82f6]">
                Boost Productivity
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#64748b] max-w-3xl mx-auto mb-8">
              TaskFlow helps you manage your tasks efficiently, collaborate with your team, and achieve your goals faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/signup")}
                className="px-8 py-3 rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-3 rounded-lg border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/5 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-[#3b82f6]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <img 
                src="/dashboard-preview.png" 
                alt="TaskFlow Dashboard Preview" 
                className="w-full h-auto rounded-xl"
              />
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
                TaskFlow?
              </span>
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
              Experience the difference with our powerful task management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Intuitive Interface</h3>
                  <p className="text-[#64748b]">Designed for simplicity and ease of use, making task management a breeze.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Smart Notifications</h3>
                  <p className="text-[#64748b]">Stay updated with intelligent notifications and reminders.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Enterprise Security</h3>
                  <p className="text-[#64748b]">Your data is protected with industry-leading security measures.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#3b82f6]/5 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <img 
                  src="/features-preview.png" 
                  alt="TaskFlow Features Preview" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#3b82f6]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-[#f0f9ff] rounded-2xl p-8 sm:p-12 border border-[#3b82f6]/10">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-6">
                Ready to Boost Your Productivity?
              </h2>
              <p className="text-lg text-[#64748b] mb-8">
                Join thousands of teams who trust TaskFlow for their task management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group shadow-sm"
                >
                  Start Free Trial
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-lg border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/5 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 group hover:bg-[#3b82f6]/20 transition-all">
                  <ClipboardList className="w-5 h-5 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl font-bold text-[#3b82f6]">TaskFlow</span>
              </div>
              <p className="text-sm text-[#64748b]">
                The modern task management platform for teams that want to get more done.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1e293b] mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Features</a></li>
                <li><a href="#benefits" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Benefits</a></li>
                <li><a href="#pricing" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1e293b] mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1e293b] mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-[#64748b] hover:text-[#3b82f6] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-[#64748b]">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 