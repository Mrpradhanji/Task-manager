import { useState, useRef, useEffect } from "react"
import { Settings, ChevronDown, LogOut, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Navbar = ({ user = {}, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)

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
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg shadow-[#00FFFF]/5 border-b border-[#00FFFF]/10 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* Left - Logo + Brand */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          {/* GenZ Logo */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#00FFFF] shadow-lg shadow-[#00FFFF]/20 group-hover:shadow-[#00FFFF]/30 group-hover:scale-105 transition-all duration-300">
            <Zap className="w-6 h-6 text-[#0A0A0A]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#0A0A0A] rounded-full shadow-md animate-ping" />
          </div>

          {/* Stylish Brand Name */}
          <span className="text-2xl font-extrabold text-[#00FFFF] tracking-wide">
            TaskFlow
          </span>
        </div>

        {/* Right - User Controls */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-400 hover:text-[#00FFFF] transition-colors duration-300 hover:bg-[#00FFFF]/10 rounded-full"
            onClick={() => navigate("/dashboard/profile")}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-[#00FFFF]/10 transition-colors duration-300 border border-transparent hover:border-[#00FFFF]/20"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full bg-[#00FFFF]/10 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#00FFFF] text-[#0A0A0A] font-semibold shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white">{user.name || "Guest User"}</p>
                <p className="text-xs text-gray-400 font-normal">{user.email || "user@taskflow.com"}</p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-[#0A0A0A]/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-[#00FFFF]/5 border border-[#00FFFF]/10 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/dashboard/profile")
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#00FFFF]/10 text-sm text-gray-300 transition-colors flex items-center gap-2 group"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-[#00FFFF]" />
                    Profile Settings
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-500/10 text-red-400"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar