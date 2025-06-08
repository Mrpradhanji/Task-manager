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
  Bell
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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0A0A0A]/90 backdrop-blur-md z-50 border-b border-[#00FFFF]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5">
                <Zap className="w-6 h-6 text-[#00FFFF]" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FFFF] rounded-full shadow-md animate-ping opacity-75" />
              </div>
              <span className="text-2xl font-extrabold text-[#00FFFF]">
                TaskFlow
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-[#00FFFF] transition-colors">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-[#00FFFF] transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-300 hover:text-[#00FFFF] transition-colors">Pricing</a>
              <button 
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-[#00FFFF]/5 text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <span className={`block w-6 h-0.5 bg-gray-300 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-gray-300 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-gray-300 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A]/95 border-t border-[#00FFFF]/10">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-[#00FFFF] transition-colors">Features</a>
              <a href="#benefits" className="block text-gray-300 hover:text-[#00FFFF] transition-colors">Benefits</a>
              <a href="#pricing" className="block text-gray-300 hover:text-[#00FFFF] transition-colors">Pricing</a>
              <button 
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all border border-[#00FFFF]/20"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Organize Tasks,{" "}
              <span className="text-[#00FFFF]">
                Boost Productivity
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              TaskFlow helps you manage your tasks efficiently, collaborate with your team, and achieve your goals faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/signup")}
                className="px-8 py-3 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all flex items-center justify-center gap-2 group border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-3 rounded-lg border border-[#00FFFF]/20 text-[#00FFFF] hover:bg-[#00FFFF]/5 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-[#00FFFF]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#00FFFF]/10 p-4 sm:p-6">
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] border-t border-[#00FFFF]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for{" "}
              <span className="text-[#00FFFF]">
                Modern Teams
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage tasks, collaborate with your team, and boost productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#00FFFF]/10 hover:border-[#00FFFF]/20 transition-all group hover:shadow-lg hover:shadow-[#00FFFF]/5"
              >
                <div className="w-12 h-12 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center text-[#00FFFF] mb-4 group-hover:bg-[#00FFFF]/15 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] border-t border-[#00FFFF]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose{" "}
              <span className="text-[#00FFFF]">
                TaskFlow?
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our powerful task management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center text-[#00FFFF] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Intuitive Interface</h3>
                  <p className="text-gray-400">Designed for simplicity and ease of use, making task management a breeze.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center text-[#00FFFF] shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Notifications</h3>
                  <p className="text-gray-400">Stay updated with intelligent notifications and reminders.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center text-[#00FFFF] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                  <p className="text-gray-400">Your data is protected with industry-leading security measures.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#00FFFF]/5 rounded-3xl blur-3xl" />
              <div className="relative bg-[#0A0A0A]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#00FFFF]/10 p-4">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] border-t border-[#00FFFF]/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00FFFF]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-[#00FFFF]/10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Boost Your Productivity?
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Join thousands of teams who trust TaskFlow for their task management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all flex items-center justify-center gap-2 group border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5"
                >
                  Start Free Trial
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-lg border border-[#00FFFF]/20 text-[#00FFFF] hover:bg-[#00FFFF]/5 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#00FFFF]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20">
                  <Zap className="w-5 h-5 text-[#00FFFF]" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00FFFF] rounded-full shadow-md animate-ping opacity-75" />
                </div>
                <span className="text-xl font-bold text-[#00FFFF]">TaskFlow</span>
              </div>
              <p className="text-sm text-gray-400">
                The modern task management platform for teams that want to get more done.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Features</a></li>
                <li><a href="#benefits" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Benefits</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-[#00FFFF] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#00FFFF]/10 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 