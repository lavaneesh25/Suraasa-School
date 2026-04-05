import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE, resolveMediaUrl } from './utils/media'

export default function AdminDashboard({ onClose, onDataChange }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  const [siteContent, setSiteContent] = useState({})
  const [facilityList, setFacilityList] = useState([])
  const [eventList, setEventList] = useState([])
  const [resultList, setResultList] = useState([])
  const [galleryList, setGalleryList] = useState([])
  const [admissionList, setAdmissionList] = useState([])
  const [contactList, setContactList] = useState([])

  const [newFacility, setNewFacility] = useState({ title: '', description: '', image_url: '' })
  const [facilityFile, setFacilityFile] = useState(null)
  const [facilityPreview, setFacilityPreview] = useState('')
  
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image_url: '' })
  const [eventFile, setEventFile] = useState(null)
  const [eventPreview, setEventPreview] = useState('')
  
  const [newResult, setNewResult] = useState({ student_name: '', grade: '', subject: '', rank: '', is_topper: false })
  
  const [newGallery, setNewGallery] = useState({ url: '', caption: '' })
  const [galleryFile, setGalleryFile] = useState(null)
  const [galleryPreview, setGalleryPreview] = useState('')

  // Edit states
  const [editingFacility, setEditingFacility] = useState(null)
  const [editFacilityData, setEditFacilityData] = useState({})
  const [editFacilityFile, setEditFacilityFile] = useState(null)
  const [editFacilityPreview, setEditFacilityPreview] = useState('')

  const [editingEvent, setEditingEvent] = useState(null)
  const [editEventData, setEditEventData] = useState({})
  const [editEventFile, setEditEventFile] = useState(null)
  const [editEventPreview, setEditEventPreview] = useState('')

  const [editingResult, setEditingResult] = useState(null)
  const [editResultData, setEditResultData] = useState({})

  const [editingGallery, setEditingGallery] = useState(null)
  const [editGalleryData, setEditGalleryData] = useState({})
  const [editGalleryFile, setEditGalleryFile] = useState(null)
  const [editGalleryPreview, setEditGalleryPreview] = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const buildResultPayload = (result) => ({
    ...result,
    rank: Number.parseInt(result.rank, 10),
  })

  // Edit handlers
  const startEditFacility = (facility) => {
    setEditingFacility(facility.id)
    setEditFacilityData({ ...facility })
    setEditFacilityPreview(resolveMediaUrl(facility.image_url))
  }

  const startEditEvent = (event) => {
    setEditingEvent(event.id)
    setEditEventData({ ...event })
    setEditEventPreview(resolveMediaUrl(event.image_url))
  }

  const startEditResult = (result) => {
    setEditingResult(result.id)
    setEditResultData({ ...result })
  }

  const startEditGallery = (item) => {
    setEditingGallery(item.id)
    setEditGalleryData({ ...item })
    setEditGalleryPreview(resolveMediaUrl(item.url))
  }

  const cancelEdit = () => {
    setEditingFacility(null)
    setEditingEvent(null)
    setEditingResult(null)
    setEditingGallery(null)
    setEditFacilityFile(null)
    setEditEventFile(null)
    setEditGalleryFile(null)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/token`, { username, password })
      setToken(res.data.access_token)
      localStorage.setItem('admin_token', res.data.access_token)
      setMessage('✓ Login successful!')
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage('❌ Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('admin_token')
    setMessage('Logged out')
  }

  // File upload handler
  const uploadImage = async (file) => {
    if (!file) return null
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data.url
    } catch (err) {
      console.error('Upload error', err)
      setMessage('Error uploading image')
      return null
    } finally {
      setUploading(false)
    }
  }

  // File selection handlers with preview
  const handleFacilityFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFacilityFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setFacilityPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleEventFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEventFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setEventPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGalleryFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setGalleryPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Edit file change handlers
  const handleEditFacilityFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditFacilityFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setEditFacilityPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleEditEventFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditEventFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setEditEventPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleEditGalleryFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditGalleryFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setEditGalleryPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const fetchSiteContent = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/site-content`, { headers })
      setSiteContent(res.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}))
    } catch (err) {
      console.error('Site content fetch', err)
      setMessage('Error loading site content')
    }
  }

  const saveContent = async (key, value) => {
    try {
      await axios.post(`${API_BASE}/site-content`, { key, value }, { headers })
      setMessage('Content saved')
      fetchSiteContent()
      onDataChange?.()
    } catch (err) {
      console.error('Save site content', err)
      setMessage('Failed to save content')
    }
  }

  const fetchFacilities = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/facilities`, { headers })
      setFacilityList(res.data)
    } catch (err) {
      console.error('Facilities fetch', err)
      setMessage('Error loading facilities')
    }
  }

  const fetchEvents = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/events`, { headers })
      setEventList(res.data)
    } catch (err) {
      console.error('Events fetch', err)
    }
  }

  const fetchResults = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/results`, { headers })
      setResultList(res.data)
    } catch (err) {
      console.error('Results fetch', err)
    }
  }

  const fetchGallery = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/gallery`, { headers })
      setGalleryList(res.data)
    } catch (err) {
      console.error('Gallery fetch', err)
    }
  }

  const fetchAdmissions = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/admissions`, { headers })
      setAdmissionList(res.data)
    } catch (err) {
      console.error('Admissions fetch', err)
      setMessage('Error loading admissions')
    }
  }

  const fetchContacts = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_BASE}/contacts`, { headers })
      setContactList(res.data)
    } catch (err) {
      console.error('Contacts fetch', err)
      setMessage('Error loading contact messages')
    }
  }

  useEffect(() => {
    if (!token) return
    fetchSiteContent()
    fetchFacilities()
    fetchEvents()
    fetchResults()
    fetchGallery()
    fetchAdmissions()
    fetchContacts()
  }, [token])

  useEffect(() => {
    if (activeTab === 'facilities') fetchFacilities()
    if (activeTab === 'events') fetchEvents()
    if (activeTab === 'results') fetchResults()
    if (activeTab === 'gallery') fetchGallery()
    if (activeTab === 'admissions') fetchAdmissions()
    if (activeTab === 'contacts') fetchContacts()
    if (activeTab === 'site') fetchSiteContent()
  }, [activeTab, token])

  const addFacility = async () => {
    if (!newFacility.title || (!newFacility.image_url && !facilityFile)) {
      setMessage('Please add title and image.')
      return
    }
    try {
      let imageUrl = newFacility.image_url
      if (facilityFile) {
        imageUrl = await uploadImage(facilityFile)
        if (!imageUrl) return
      }
      await axios.post(`${API_BASE}/facilities`, { ...newFacility, image_url: imageUrl }, { headers })
      setNewFacility({ title: '', description: '', image_url: '' })
      setFacilityFile(null)
      setFacilityPreview('')
      fetchFacilities()
      setMessage('✓ Facility added')
      onDataChange?.()
    } catch (err) {
      console.error('Add facility', err)
      setMessage('Error adding facility')
    }
  }

  const deleteFacility = async (id) => {
    try {
      await axios.delete(`${API_BASE}/facilities/${id}`, { headers })
      fetchFacilities()
      setMessage('Facility deleted')
      onDataChange?.()
    } catch (err) {
      console.error('Delete facility', err)
      setMessage('Error deleting facility')
    }
  }

  const addEvent = async () => {
    if (!newEvent.title || (!newEvent.image_url && !eventFile)) {
      setMessage('Please add title and image.')
      return
    }
    try {
      let imageUrl = newEvent.image_url
      if (eventFile) {
        imageUrl = await uploadImage(eventFile)
        if (!imageUrl) return
      }
      await axios.post(`${API_BASE}/events`, { ...newEvent, image_url: imageUrl }, { headers })
      setNewEvent({ title: '', description: '', date: '', image_url: '' })
      setEventFile(null)
      setEventPreview('')
      fetchEvents()
      setMessage('✓ Event added')
      onDataChange?.()
    } catch (err) {
      console.error('Add event', err)
      setMessage('Error adding event')
    }
  }

  const addResult = async () => {
    if (!newResult.student_name || !newResult.grade || !newResult.subject || newResult.rank === '') {
      setMessage('Please add student name, grade, subject and rank.')
      return
    }
    try {
      await axios.post(`${API_BASE}/results`, buildResultPayload(newResult), { headers })
      setNewResult({ student_name: '', grade: '', subject: '', rank: '', is_topper: false })
      fetchResults()
      setMessage('Result added')
      onDataChange?.()
    } catch (err) {
      console.error('Add result', err)
      setMessage('Error adding result')
    }
  }

  const addGallery = async () => {
    if (!newGallery.caption || (!newGallery.url && !galleryFile)) {
      setMessage('Provide image file or URL first')
      return
    }
    try {
      let imageUrl = newGallery.url
      if (galleryFile) {
        imageUrl = await uploadImage(galleryFile)
        if (!imageUrl) return
      }
      await axios.post(`${API_BASE}/gallery`, { url: imageUrl, caption: newGallery.caption }, { headers })
      setNewGallery({ url: '', caption: '' })
      setGalleryFile(null)
      setGalleryPreview('')
      fetchGallery()
      setMessage('✓ Image added')
      onDataChange?.()
    } catch (err) {
      console.error('Add gallery', err)
      setMessage('Error adding gallery image')
    }
  }

  // Update functions
  const updateFacility = async () => {
    try {
      let imageUrl = editFacilityData.image_url
      if (editFacilityFile) {
        imageUrl = await uploadImage(editFacilityFile)
        if (!imageUrl) return
      }
      await axios.put(`${API_BASE}/facilities/${editingFacility}`, 
        { ...editFacilityData, image_url: imageUrl }, 
        { headers })
      fetchFacilities()
      setMessage('✓ Facility updated')
      cancelEdit()
      onDataChange?.()
    } catch (err) {
      console.error('Update facility', err)
      setMessage('Error updating facility')
    }
  }

  const updateEvent = async () => {
    try {
      let imageUrl = editEventData.image_url
      if (editEventFile) {
        imageUrl = await uploadImage(editEventFile)
        if (!imageUrl) return
      }
      await axios.put(`${API_BASE}/events/${editingEvent}`, 
        { ...editEventData, image_url: imageUrl }, 
        { headers })
      fetchEvents()
      setMessage('✓ Event updated')
      cancelEdit()
      onDataChange?.()
    } catch (err) {
      console.error('Update event', err)
      setMessage('Error updating event')
    }
  }

  const updateResult = async () => {
    if (!editResultData.student_name || !editResultData.grade || !editResultData.subject || editResultData.rank === '' || editResultData.rank == null) {
      setMessage('Please add student name, grade, subject and rank.')
      return
    }
    try {
      await axios.put(`${API_BASE}/results/${editingResult}`, buildResultPayload(editResultData), { headers })
      fetchResults()
      setMessage('✓ Result updated')
      cancelEdit()
      onDataChange?.()
    } catch (err) {
      console.error('Update result', err)
      setMessage('Error updating result')
    }
  }

  const updateGallery = async () => {
    try {
      let imageUrl = editGalleryData.url
      if (editGalleryFile) {
        imageUrl = await uploadImage(editGalleryFile)
        if (!imageUrl) return
      }
      await axios.put(`${API_BASE}/gallery/${editingGallery}`, 
        { url: imageUrl, caption: editGalleryData.caption }, 
        { headers })
      fetchGallery()
      setMessage('✓ Gallery item updated')
      cancelEdit()
      onDataChange?.()
    } catch (err) {
      console.error('Update gallery', err)
      setMessage('Error updating gallery item')
    }
  }

  // Delete functions
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_BASE}/events/${id}`, { headers })
      fetchEvents()
      setMessage('✓ Event deleted')
      onDataChange?.()
    } catch (err) {
      console.error('Delete event', err)
      setMessage('Error deleting event')
    }
  }

  const deleteResult = async (id) => {
    try {
      await axios.delete(`${API_BASE}/results/${id}`, { headers })
      fetchResults()
      setMessage('✓ Result deleted')
      onDataChange?.()
    } catch (err) {
      console.error('Delete result', err)
      setMessage('Error deleting result')
    }
  }

  const deleteGallery = async (id) => {
    try {
      await axios.delete(`${API_BASE}/gallery/${id}`, { headers })
      fetchGallery()
      setMessage('✓ Image deleted')
      onDataChange?.()
    } catch (err) {
      console.error('Delete gallery', err)
      setMessage('Error deleting image')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">SURAASA ADMIN</h1>
          <p className="text-slate-400 text-center mb-8">Secure Access</p>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-4 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white" />
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg">{loading ? 'Logging in...' : 'Login to Dashboard'}</button>
          {message && <p className="text-center mt-4 text-sm text-indigo-300">{message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">SURAASA Admin Dashboard</h1>
          <div className="flex gap-2">
            {onClose && <button onClick={onClose} className="bg-slate-600/40 border border-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">Back to Site</button>}
            <button onClick={handleLogout} className="bg-red-600/30 border border-red-500 hover:bg-red-600 text-red-200 px-6 py-2 rounded-lg">Logout</button>
          </div>
        </div>

        {message && <div className="bg-indigo-600/20 border border-indigo-500 text-indigo-200 px-4 py-3 rounded-lg mb-6">{message}</div>}

        <div className="tabs flex gap-2 mb-6 flex-wrap">
          {['dashboard', 'site', 'facilities', 'events', 'results', 'gallery', 'admissions', 'contacts'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg transition ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Total Facilities: <strong>{facilityList.length}</strong></div>
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Total Events: <strong>{eventList.length}</strong></div>
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Total Results: <strong>{resultList.length}</strong></div>
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Gallery Items: <strong>{galleryList.length}</strong></div>
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Admissions: <strong>{admissionList.length}</strong></div>
            <div className="bg-slate-800/60 backdrop-blur-lg p-5 rounded-xl border border-white/20">Contact Messages: <strong>{contactList.length}</strong></div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Site Content Editor</h2>
            {['hero_title', 'hero_subtitle', 'hero_cta', 'logo_url', 'hero_background', 'campus_title', 'campus_description', 'campus_image'].map((key) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-white/80">{key.replace('_', ' ').toUpperCase()}</label>
                <input value={siteContent[key] || ''} onChange={(e) => setSiteContent((s) => ({ ...s, [key]: e.target.value }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                <button onClick={() => saveContent(key, siteContent[key] || '')} className="mt-1 bg-amber-300 text-slate-900 px-3 py-1 rounded-lg">Save</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Facilities</h2>
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <input value={newFacility.title} onChange={(e) => setNewFacility((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <div className="relative">
                <label className="block text-xs text-slate-400 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={handleFacilityFileChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
              </div>
            </div>
            {facilityPreview && <img src={facilityPreview} alt="Facility preview" className="mb-3 h-40 rounded-lg object-cover" />}
            <textarea value={newFacility.description} onChange={(e) => setNewFacility((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white mb-3" />
            <button onClick={addFacility} disabled={uploading} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Uploading...' : 'Add Facility'}</button>
            <div className="mt-4 space-y-3">
              {facilityList.map((item) => (
                editingFacility === item.id ? (
                  <div key={item.id} className="border-2 border-amber-400 rounded-lg p-4 bg-white/5">
                    <h3 className="font-bold text-amber-300 mb-3">Edit Facility</h3>
                    <input value={editFacilityData.title} onChange={(e) => setEditFacilityData((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <textarea value={editFacilityData.description} onChange={(e) => setEditFacilityData((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input type="file" accept="image/*" onChange={handleEditFacilityFileChange} className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
                    {editFacilityPreview && <img src={editFacilityPreview} alt="Preview" className="mb-2 h-32 rounded-lg object-cover" />}
                    <div className="flex gap-2">
                      <button onClick={updateFacility} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Saving...' : 'Save'}</button>
                      <button onClick={cancelEdit} className="bg-slate-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="flex flex-col md:flex-row items-center md:items-start justify-between border border-white/10 rounded-lg p-3">
                    <div className="flex-1">
                      {item.image_url && <img src={resolveMediaUrl(item.image_url)} alt={item.title} className="h-20 w-20 object-cover rounded-lg mb-2" />}
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-slate-300">{item.description}</p>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button onClick={() => startEditFacility(item)} className="bg-blue-600 px-3 py-2 rounded-lg text-sm">Edit</button>
                      <button onClick={() => deleteFacility(item.id)} className="bg-red-500 px-3 py-2 rounded-lg text-sm">Delete</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <input value={newEvent.title} onChange={(e) => setNewEvent((v) => ({ ...v, title: e.target.value }))} placeholder="Title" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <input value={newEvent.date} onChange={(e) => setNewEvent((v) => ({ ...v, date: e.target.value }))} placeholder="Date" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <div className="relative">
                <label className="block text-xs text-slate-400 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={handleEventFileChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
              </div>
            </div>
            {eventPreview && <img src={eventPreview} alt="Event preview" className="mb-3 h-40 rounded-lg object-cover" />}
            <textarea value={newEvent.description} onChange={(e) => setNewEvent((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white mb-3" />
            <button onClick={addEvent} disabled={uploading} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Uploading...' : 'Add Event'}</button>
            <div className="mt-4 space-y-2">
              {eventList.map((item) => (
                editingEvent === item.id ? (
                  <div key={item.id} className="border-2 border-amber-400 rounded-lg p-4 bg-white/5">
                    <h3 className="font-bold text-amber-300 mb-3">Edit Event</h3>
                    <input value={editEventData.title} onChange={(e) => setEditEventData((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input value={editEventData.date} onChange={(e) => setEditEventData((f) => ({ ...f, date: e.target.value }))} placeholder="Date" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <textarea value={editEventData.description} onChange={(e) => setEditEventData((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input type="file" accept="image/*" onChange={handleEditEventFileChange} className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
                    {editEventPreview && <img src={editEventPreview} alt="Preview" className="mb-2 h-32 rounded-lg object-cover" />}
                    <div className="flex gap-2">
                      <button onClick={updateEvent} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Saving...' : 'Save'}</button>
                      <button onClick={cancelEdit} className="bg-slate-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg p-3 rounded-lg border border-white/10">
                    {item.image_url && <img src={resolveMediaUrl(item.image_url)} alt={item.title} className="h-24 w-24 object-cover rounded-lg mb-2" />}
                    <h4 className="font-semibold">{item.title} · {item.date}</h4>
                    <p className="text-sm text-slate-300">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => startEditEvent(item)} className="bg-blue-600 px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteEvent(item.id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <div className="grid gap-3 md:grid-cols-5 mb-4">
              <input value={newResult.student_name} onChange={(e) => setNewResult((v) => ({ ...v, student_name: e.target.value }))} placeholder="Student Name" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <input value={newResult.grade} onChange={(e) => setNewResult((v) => ({ ...v, grade: e.target.value }))} placeholder="Grade" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <input value={newResult.subject} onChange={(e) => setNewResult((v) => ({ ...v, subject: e.target.value }))} placeholder="Subject" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <input value={newResult.rank} type="number" min="1" onChange={(e) => setNewResult((v) => ({ ...v, rank: e.target.value }))} placeholder="Rank" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <button onClick={addResult} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg">Add Result</button>
            </div>
            <label className="flex items-center gap-2 mb-4 text-white">
              <input type="checkbox" checked={newResult.is_topper} onChange={(e) => setNewResult((v) => ({ ...v, is_topper: e.target.checked }))} />
              <span>Mark as Topper</span>
            </label>
            <div className="mt-4 grid gap-2">
              {resultList.map((item) => (
                editingResult === item.id ? (
                  <div key={item.id} className="border-2 border-amber-400 rounded-lg p-4 bg-white/5">
                    <h3 className="font-bold text-amber-300 mb-3">Edit Result</h3>
                    <input value={editResultData.student_name} onChange={(e) => setEditResultData((f) => ({ ...f, student_name: e.target.value }))} placeholder="Student Name" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input value={editResultData.grade} onChange={(e) => setEditResultData((f) => ({ ...f, grade: e.target.value }))} placeholder="Grade" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input value={editResultData.subject} onChange={(e) => setEditResultData((f) => ({ ...f, subject: e.target.value }))} placeholder="Subject" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input value={editResultData.rank ?? ''} onChange={(e) => setEditResultData((f) => ({ ...f, rank: e.target.value }))} placeholder="Rank" type="number" min="1" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <label className="flex items-center gap-2 mb-3 text-white">
                      <input type="checkbox" checked={editResultData.is_topper || false} onChange={(e) => setEditResultData((f) => ({ ...f, is_topper: e.target.checked }))} />
                      <span>Is Topper</span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={updateResult} className="bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
                      <button onClick={cancelEdit} className="bg-slate-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg p-3 rounded-lg border border-white/10 flex justify-between items-center">
                    <p className="text-sm">{item.student_name} ({item.grade}) - {item.subject}: Rank {item.rank} {item.is_topper && '🏆'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => startEditResult(item)} className="bg-blue-600 px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteResult(item.id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <div className="relative">
                <label className="block text-xs text-slate-400 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={handleGalleryFileChange} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
              </div>
              <input value={newGallery.caption} onChange={(e) => setNewGallery((v) => ({ ...v, caption: e.target.value }))} placeholder="Caption" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
            </div>
            {galleryPreview && <img src={galleryPreview} alt="Gallery preview" className="mb-3 h-40 rounded-lg object-cover" />}
            <button onClick={addGallery} disabled={uploading} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Uploading...' : 'Add Image'}</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {galleryList.map((item) => (
                editingGallery === item.id ? (
                  <div key={item.id} className="border-2 border-amber-400 rounded-lg p-4 bg-white/5 col-span-1 md:col-span-3">
                    <h3 className="font-bold text-amber-300 mb-3">Edit Gallery Item</h3>
                    <input value={editGalleryData.caption} onChange={(e) => setEditGalleryData((f) => ({ ...f, caption: e.target.value }))} placeholder="Caption" className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    <input type="file" accept="image/*" onChange={handleEditGalleryFileChange} className="w-full mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:text-slate-300 file:border-0 file:bg-white/5 file:px-2 file:py-1 file:rounded" />
                    {editGalleryPreview && <img src={editGalleryPreview} alt="Preview" className="mb-2 h-32 rounded-lg object-cover" />}
                    <div className="flex gap-2">
                      <button onClick={updateGallery} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? 'Saving...' : 'Save'}</button>
                      <button onClick={cancelEdit} className="bg-slate-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg p-3 rounded-lg relative">
                    <img src={resolveMediaUrl(item.url)} alt={item.caption} className="w-full h-32 object-cover rounded-lg" loading="lazy" />
                    <p className="mt-2 text-sm text-slate-100">{item.caption}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => startEditGallery(item)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex-1">Edit</button>
                      <button onClick={() => deleteGallery(item.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs flex-1">Delete</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Admissions</h2>
              <button onClick={fetchAdmissions} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg">Refresh</button>
            </div>
            {admissionList.length ? (
              <div className="grid gap-3">
                {admissionList.map((item) => (
                  <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg border border-white/10 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.student_name}</h3>
                        <p className="text-sm text-slate-300">Parent: {item.parent_name}</p>
                        <p className="text-sm text-slate-300">Grade: {item.grade}</p>
                      </div>
                      <div className="text-sm text-slate-300">
                        <p>Email: {item.email}</p>
                        <p>Phone: {item.phone}</p>
                        <p>Submitted: {new Date(item.submitted_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No admissions submitted yet.</p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Contact Messages</h2>
              <button onClick={fetchContacts} className="bg-amber-300 text-slate-900 px-4 py-2 rounded-lg">Refresh</button>
            </div>
            {contactList.length ? (
              <div className="grid gap-3">
                {contactList.map((item) => (
                  <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg border border-white/10 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-slate-300">Email: {item.email}</p>
                        {item.phone && <p className="text-sm text-slate-300">Phone: {item.phone}</p>}
                      </div>
                      <div className="text-sm text-slate-300">
                        <p>Submitted: {new Date(item.submitted_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-100 whitespace-pre-wrap">{item.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No contact messages submitted yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
