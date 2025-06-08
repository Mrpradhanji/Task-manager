import { useState, useRef, useEffect } from "react"
import { Settings, ChevronDown, LogOut, ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Navbar = ({ user = {}, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleMenuToggle = () => setMenuOpen((prev) => !prev)
  const handleLogout = () => {
    setMenuOpen(false)
    onLogout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Left - Logo + Brand */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 shadow-sm group hover:bg-[#3b82f6]/20 transition-all">
            <ClipboardList className="w-6 h-6 text-[#3b82f6] group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-[#3b82f6] tracking-wide">
            TaskFlow
          </span>
        </div>

        {/* Right - User Controls */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#3b82f6]/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-[#1e293b]">{user?.name || 'User'}</span>
              <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-gray-100 shadow-lg py-1">
                <button 
                  onClick={() => navigate("/dashboard/settings")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1e293b] hover:bg-[#3b82f6]/5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#64748b]" />
                  Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar