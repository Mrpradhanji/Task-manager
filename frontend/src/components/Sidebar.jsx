import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Sparkles, Lightbulb, Menu, X } from "lucide-react"
import TaskModal from "../components/AddTask"
import {
  menuItems,
  SIDEBAR_CLASSES,
  LINK_CLASSES,
  PRODUCTIVITY_CARD,
  TIP_CARD,
} from "../assets/dummy"

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [mobileOpen])

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-start"
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span className={`${isMobile ? 'block' : 'hidden lg:block'} ${LINK_CLASSES.text}`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-sm border-r border-gray-100 shadow-sm hidden md:flex flex-col transition-transform duration-300">
        <div className="p-5 border-b border-gray-100 lg:block hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] font-bold">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1e293b]">Hey, {username}</h2>
              <p className="text-sm text-[#3b82f6] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">PRODUCTIVITY</h3>
              <span className="text-xs bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-0.5 rounded-full">
                {productivity}%
              </span>
            </div>
            <div className="h-2 bg-[#3b82f6]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b82f6] transition-all duration-500"
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {renderMenuItems()}

          <div className="mt-auto pt-6 lg:block hidden">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#3b82f6]/10">
                  <Lightbulb className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1e293b]">Pro Tip</h3>
                  <p className="text-xs text-[#64748b]">Use keyboard shortcuts to boost productivity!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-40 p-3 bg-[#3b82f6] text-white rounded-full shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30 transition-all duration-300 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-sm border-r border-gray-100 shadow-sm p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-[#3b82f6]">Menu</h2>
              <button onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] font-bold">
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1e293b]">Hey, {username}</h2>
                <p className="text-sm text-[#3b82f6] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Let's crush some tasks!
                </p>
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )}

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default Sidebar;