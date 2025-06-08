import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { 
  ChevronLeft, 
  Shield, 
  LogOut, 
  Save, 
  UserCircle, 
  Bell,
  Camera,
  Mail
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
  const [settings, setSettings] = useState({
    notifications: true
  })
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
        console.log('Fetching profile...')
        const { data } = await axios.get(
          `${API_URL}/api/user/me`, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log('Profile data received:', data)
        if (data.success) {
          const avatarUrl = data.user.avatar 
            ? `${API_URL}${data.user.avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=random`
          
          console.log('Setting initial avatar URL:', avatarUrl)
          
          setProfile({ 
            name: data.user.name, 
            email: data.user.email,
            avatar: avatarUrl
          })
        } else {
          toast.error(data.message || "Failed to load profile")
        }
      } catch (error) {
        console.error('Error fetching profile:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
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

    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

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
      console.log('Uploading avatar with token:', token ? 'Token exists' : 'No token')

      const response = await axios.post(
        `${API_URL}/api/user/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Upload response:', response.data)

      if (response.data.success) {
        const fullAvatarUrl = response.data.fullAvatarUrl
        console.log('Setting new avatar URL:', fullAvatarUrl)
        
        setProfile(prev => ({
          ...prev,
          avatar: fullAvatarUrl
        }))
        
        setCurrentUser(prev => ({
          ...prev,
          avatar: fullAvatarUrl
        }))
        
        toast.success('Profile picture updated successfully')
      } else {
        console.error('Upload failed:', response.data.message)
        toast.error(response.data.message || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading avatar:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      toast.error(error.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setIsUploading(false)
    }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate('/login')
        return
      }

      console.log('Saving profile...', profile)
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Profile save response:', data)
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: profile.avatar
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

  const handleSettingChange = (setting, value) => {
    console.log('Updating setting:', setting, 'to:', value)
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    toast.success("Setting updated")
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
                      console.error('Image load error:', e)
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
              {isUploading && (
                <div className="mt-2 text-sm text-gray-500">
                  Uploading...
                </div>
              )}
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className={INPUT_WRAPPER}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${INPUT_WRAPPER} bg-gray-100 cursor-not-allowed`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed for security reasons
                </p>
              </div>
              <button type="submit" className={FULL_BUTTON}>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </form>
          </div>

          {/* Preferences Section */}
          <div className={SECTION_WRAPPER}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Preferences</h2>
            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email updates about your tasks</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={SECTION_WRAPPER}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Security</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Shield className="h-5 w-5 mr-2" />
                Reset Password
              </button>
              <button
                onClick={onLogout}
                className={DANGER_BTN}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
