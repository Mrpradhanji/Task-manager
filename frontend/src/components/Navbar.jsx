import { useState, useRef, useEffect } from "react"
import { Settings, ChevronDown, LogOut, ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar({ onLogout, user }) {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Function to get the full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    return `http://localhost:4000${avatar}`
  }

  const handleMenuToggle = () => setMenuOpen((prev) => !prev)
  const handleUserMenuToggle = () => setIsUserMenuOpen((prev) => !prev)

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    onLogout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Left - Logo + Brand */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ClipboardList className="w-6 h-6 text-[#3b82f6]" />
          <span className="text-lg font-bold text-[#3b82f6]">RTASK</span>
        </button>

        {/* Right - User Controls */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-100">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-indigo-600 font-medium">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-100 py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate('/profile')
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}