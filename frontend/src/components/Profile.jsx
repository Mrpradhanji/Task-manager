import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { 
  ChevronLeft, 
  LogOut, 
  Save, 
  Camera
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Custom styles
const SECTION_WRAPPER = "bg-white rounded-xl shadow-lg p-6"
const INPUT_WRAPPER = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 transition-colors"
const FULL_BUTTON = "w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
const BACK_BUTTON = "flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
const DANGER_BTN = "w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"

// Constants
const API_URL = "http://localhost:4000"

export default function Profile({ setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate('/login')
      return
    }
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get(
          `${API_URL}/api/user/me`, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (data.success) {
          const avatarUrl = data.user.avatar 
            ? `${API_URL}${data.user.avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=random`
          
          setProfile({ 
            name: data.user.name, 
            email: data.user.email,
            avatar: avatarUrl
          })
        } else {
          toast.error(data.message || "Failed to load profile")
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error(error.response?.data?.message || "Unable to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const token = localStorage.getItem("token")
      if (!token) {
        navigate('/login')
        return
      }

      const { data } = await axios.post(
        `${API_URL}/api/user/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        // Update both local state and parent state
        const avatarUrl = data.avatar
        setProfile(prev => ({
          ...prev,
          avatar: avatarUrl
        }))
        
        setCurrentUser(prev => ({
          ...prev,
          avatar: avatarUrl
        }))
        
        toast.success('Profile picture updated successfully')
      } else {
        toast.error(data.message || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error(error.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setIsUploading(false)
    }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    
    if (!profile.name.trim()) {
      toast.error("Name is required")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate('/login')
        return
      }

      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        // Update both local state and parent state
        setCurrentUser(prev => ({
          ...prev,
          name: data.user.name,
          avatar: data.user.avatar
        }))
        toast.success("Profile updated successfully")
      } else {
        toast.error(data.message || "Failed to update profile")
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error(err.response?.data?.message || "Profile update failed")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right"
        theme="colored"
        autoClose={3000}
      />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={BACK_BUTTON}
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className={SECTION_WRAPPER}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h2>
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-indigo-100">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover avatar-image"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`
                    }}
                  />
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Click to change profile picture
              </p>
            </div>

            {/* Name Field */}
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className={INPUT_WRAPPER}
                  placeholder="Your name"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  disabled
                  className={`${INPUT_WRAPPER} bg-gray-50 cursor-not-allowed`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={FULL_BUTTON}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className={SECTION_WRAPPER}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Danger Zone</h2>
            <button
              onClick={onLogout}
              className={DANGER_BTN}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
