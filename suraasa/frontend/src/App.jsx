import { useState, useEffect, useMemo, useRef, useCallback } from 'react'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

import { FaGraduationCap, FaAtom, FaLightbulb, FaPencilRuler, FaSchool, FaChevronUp, FaBars } from 'react-icons/fa'

import { useInView } from 'react-intersection-observer'

import axios from 'axios'

import AdminDashboard from './AdminDashboard.jsx'

import { API_BASE, resolveMediaUrl } from './utils/media'



const fadeInUp = {

  hidden: { opacity: 0, y: 40 },

  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },

}



const staggerContainer = {

  hidden: { opacity: 0 },

  visible: {

    opacity: 1,

    transition: { staggerChildren: 0.08, delayChildren: 0.2 },

  },

}



// Scroll-reveal wrapper component

function ScrollReveal({ children, className = '', delay = 0 }) {

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (

    <motion.div

      ref={ref}

      initial={{ opacity: 0, y: 50 }}

      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}

      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}

      className={className}

    >

      {children}

    </motion.div>

  )

}



// 3D tilt card component

function TiltCard({ children, className = '', intensity = 25 }) {

  const cardRef = useRef(null)

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 })



  const handleMouseMove = useCallback((e) => {

    const card = cardRef.current

    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left

    const y = e.clientY - rect.top

    const centerX = rect.width / 2

    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -intensity

    const rotateY = ((x - centerX) / centerX) * intensity

    setTilt({ rotateX, rotateY, scale: 1.08 })

  }, [intensity])



  const handleMouseLeave = useCallback(() => {

    setTilt({ rotateX: 0, rotateY: 0, scale: 1 })

  }, [])



  return (

    <motion.div

      ref={cardRef}

      onMouseMove={handleMouseMove}

      onMouseLeave={handleMouseLeave}

      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale: tilt.scale }}

      transition={{ type: 'spring', stiffness: 300, damping: 20 }}

      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}

      className={className}

    >

      {children}

    </motion.div>

  )

}



// Mouse parallax hook

function useMouseParallax(strength = 30) {

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  

  useEffect(() => {

    const handleMouseMove = (e) => {

      const cx = window.innerWidth / 2

      const cy = window.innerHeight / 2

      const x = ((e.clientX - cx) / cx) * strength

      const y = ((e.clientY - cy) / cy) * strength

      setOffset({ x, y })

    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)

  }, [strength])

  

  return offset

}



// Parallax section wrapper

function ParallaxSection({ children, bgImage, bgColor, overlay, className = '', speed = 0.3, id, style = {} }) {

  const ref = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  const bgY = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}px`, `${speed * 100}px`])



  return (

    <section ref={ref} id={id} className={`relative overflow-hidden ${className}`} style={style}>

      {bgImage && (

        <motion.div

          className="absolute inset-0 w-full h-[130%] -top-[15%]"

          style={{ y: bgY, backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}

        />

      )}

      {overlay && <div className="absolute inset-0" style={overlay} />}

      {children}

    </section>

  )

}



const defaultHero = {

  hero_title: 'SURAASA SCHOOL (IIT Campus), Vemulawada',

  hero_subtitle: 'ADMISSIONS OPEN 2026–27',

  hero_cta: 'Enquire Now',

  hero_background: '/home%20page%20suraasa.jpg',

  campus_title: 'THE CAMPUS EXPERIENCE',

  campus_description: 'A modern campus crafted for learning, innovation and global excellence.',

  campus_image: '/home%20page%20suraasa.jpg',

  logo_url: '/suraasa-logo.jpeg',

}



const defaultCarousel = [

  { title: 'IIT Campus Vemulawada', url: 'https://images.unsplash.com/photo-1596495577886-d920f847fedd?auto=format&fit=crop&w=1800&q=80' },

  { title: 'Premium Learning Spaces', url: 'https://images.unsplash.com/photo-1516455590571-18256e4e5d64?auto=format&fit=crop&w=1800&q=80' },

  { title: 'Global Level Facilities', url: 'https://images.unsplash.com/photo-1583239541334-82b1b5e5a79b?auto=format&fit=crop&w=1800&q=80' },

]



const fallbackEventImages = [

  '/WhatsApp Image 2026-04-02 at 22.57.22.jpeg',

  '/WhatsApp Image 2026-04-02 at 22.57.23.jpeg',

].map((path) => encodeURI(path))



const fallbackGalleryItems = [

  { id: 'holi-celebration', url: encodeURI('/holi celeb.jpeg'), caption: 'Holi Celebration' },

  { id: 'outdoor-event', url: encodeURI('/outdoor event.jpeg'), caption: 'Outdoor Event' },

]



const premiumFeatureSections = [

  {

    title: 'Academics',

    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80',

    items: [

      'Quality Education',

      'Project-Based Learning',

      'Updated Teaching Methods',

      'Play Way Method',

      'Free IIT Coaching',

    ],

  },

  {

    title: 'Facilities',

    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=80',

    items: [

      'Smart Classrooms',

      'Comfortable Single-Seater Benches',

      'Semi-Residential (Nutritious Lunch)',

      'Free Lunch Accommodation',

      'Free Vehicle Facility',

      'Free Uniform',

      'Free Textbooks',

      'Free Notebooks',

    ],

  },

  {

    title: 'EXTRA CURRICULAR ACTIVITIES',

    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80',

    items: [

      'Meditation',

      'Sports and Games',

      'Entertainment Programs',

    ],

  },

  {

    title: 'SPECIAL HIGHLIGHT',

    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',

    items: [

      'Visiting Outdoor Monthly Once',

    ],

  },

  {

    title: 'DISTINCTIVE FEATURES',

    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=80',

    items: [

      'Qualified, Dedicated and Inspiring Faculty',

      'Well Furnished Classrooms',

      'Semi-Residential School',

      'No Baggage (No Bag Concept)',

      'Creating English Atmosphere',

      "Predicting Child's Aptitude",

      'Shaping Minds of Tiny Tots',

    ],

  },

  {

    title: 'Why Choose Us',

    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1400',

    items: [

      'Active Participation',

      'Communication Skills',

      'Limited Students per Class (24 Students)',

      'No Bag Concept',

      'Monthly Educational Outings',

      '1st Rank IIT Focused Preparation',

    ],

  },

]



function CountUp({ end, start }) {

  const [count, setCount] = useState(0)



  useEffect(() => {

    if (!start) {

      setCount(0)

      return

    }



    const duration = 1200

    const startTime = performance.now()

    let frameId



    const animate = (now) => {

      const progress = Math.min((now - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) frameId = requestAnimationFrame(animate)

    }



    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)

  }, [end, start])



  return <>{count}</>

}



function App() {

  const [siteContent, setSiteContent] = useState(defaultHero)

  const [carouselItems, setCarouselItems] = useState(defaultCarousel)

  const [carouselIndex, setCarouselIndex] = useState(0)

  const [galleryIndex, setGalleryIndex] = useState(0)

  const [facilities, setFacilities] = useState([])

  const [events, setEvents] = useState([])

  const [results, setResults] = useState([])

  const [gallery, setGallery] = useState([])

  const [contactSent, setContactSent] = useState(false)

  const [admissionSent, setAdmissionSent] = useState(false)

  const [adminPanelVisible, setAdminPanelVisible] = useState(false)

  const [showTop, setShowTop] = useState(false)

  const [navOpen, setNavOpen] = useState(false)

  const [navScrolled, setNavScrolled] = useState(false)

  const [resultsInView, setResultsInView] = useState(false)

  const [lightboxImage, setLightboxImage] = useState(null)

  const mouse = useMouseParallax(25)



  const getContent = (key) => siteContent[key] || defaultHero[key] || ''

  const getImageContent = (key) => resolveMediaUrl(getContent(key))

  const galleryItems = useMemo(() => (gallery.length ? gallery : fallbackGalleryItems), [gallery])

  const sortedResults = useMemo(() => [...results].sort((left, right) => left.rank - right.rank), [results])



  const loadSiteData = async () => {

    try {

      const [site, eventRes, resultRes, galleryRes, facilityRes] = await Promise.all([

        axios.get(`${API_BASE}/site-content`).catch(() => null),

        axios.get(`${API_BASE}/events`).catch(() => null),

        axios.get(`${API_BASE}/results`).catch(() => null),

        axios.get(`${API_BASE}/gallery`).catch(() => null),

        axios.get(`${API_BASE}/facilities`).catch(() => null),

      ])



      if (site?.data?.length) {

        const map = site.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})

        setSiteContent((prev) => ({ ...prev, ...map }))

      }



      if (eventRes?.data) setEvents(eventRes.data)

      if (resultRes?.data) setResults(resultRes.data)

      if (galleryRes?.data) {

        setGallery(galleryRes.data)

        if (galleryRes.data.length > 0) {

          setCarouselItems(galleryRes.data.map((item) => ({ title: item.caption || 'Campus', url: resolveMediaUrl(item.url) })))

        }

      }

      if (facilityRes?.data) setFacilities(facilityRes.data)

    } catch (err) {

      console.warn('API fetch failure', err)

    }

  }



  useEffect(() => {

    const interval = setInterval(() => {

      setCarouselIndex((prev) => (prev + 1) % carouselItems.length)

    }, 5500)

    return () => clearInterval(interval)

  }, [carouselItems.length])



  useEffect(() => {

    if (!galleryItems.length) return

    const interval = setInterval(() => {

      setGalleryIndex((prev) => (prev + 1) % galleryItems.length)

    }, 5200)

    return () => clearInterval(interval)

  }, [galleryItems.length])



  useEffect(() => {

    if (galleryIndex >= galleryItems.length) {

      setGalleryIndex(0)

    }

  }, [galleryIndex, galleryItems.length])



  useEffect(() => {

    loadSiteData()



    const onScroll = () => {
      setShowTop(window.scrollY > 500)
      setNavScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)

  }, [])



  const handleAdminClose = async () => {

    setAdminPanelVisible(false)

    await loadSiteData()

  }



  const handleContact = async (e) => {

    e.preventDefault()

    const formData = new FormData(e.target)

    try {

      await axios.post(`${API_BASE}/contacts`, {

        name: formData.get('name'),

        email: formData.get('email'),

        phone: formData.get('phone'),

        message: formData.get('message'),

      })

      setContactSent(true)

      e.target.reset()

      setTimeout(() => setContactSent(false), 3000)

    } catch (err) {

      console.error('Contact error', err)

    }

  }



  const handleAdmission = async (e) => {

    e.preventDefault()

    const formData = new FormData(e.target)

    try {

      await axios.post(`${API_BASE}/admissions`, {

        student_name: formData.get('student_name'),

        parent_name: formData.get('parent_name'),

        email: formData.get('email'),

        phone: formData.get('phone'),

        grade: formData.get('grade'),

      })

      setAdmissionSent(true)

      e.target.reset()

      setTimeout(() => setAdmissionSent(false), 3000)

    } catch (err) {

      console.error('Admission error', err)

    }

  }



  const scrollToSection = (sectionId) => {

    const section = document.getElementById(sectionId)

    if (!section) return



    const headerOffset = 96

    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset

    window.scrollTo({ top: sectionTop, behavior: 'smooth' })

  }



  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })



  const [splashDone, setSplashDone] = useState(false)

  const [splashStage, setSplashStage] = useState(0) // 0=SS appear, 1=split & reveal, 2=fade out



  useEffect(() => {

    const t1 = setTimeout(() => setSplashStage(1), 1400)

    const t2 = setTimeout(() => setSplashStage(2), 3400)

    const t3 = setTimeout(() => setSplashDone(true), 4200)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }

  }, [])



  if (!splashDone) {

    const fontStyle = { fontFamily: "'Playfair Display', serif", color: '#FFFFFF', textShadow: '0 4px 30px rgba(0,0,0,0.2)' }

    return (

      <motion.div

        className="fixed inset-0 z-[200] flex items-center justify-center"

        style={{ background: 'linear-gradient(135deg, #0A1F44, #020617)' }}

        animate={splashStage === 2 ? { opacity: 0 } : { opacity: 1 }}

        transition={{ duration: 0.8 }}

      >

        <div className="relative flex flex-col items-center">

          {/* Top row: S + URAASA */}

          <div className="flex items-center justify-center" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>

            {/* Left S — starts centered, moves left */}

            <motion.span

              className="font-black inline-block"

              style={fontStyle}

              initial={{ x: 'clamp(1.5rem, 5vw, 4rem)', opacity: 0, scale: 0.5 }}

              animate={{

                x: splashStage >= 1 ? 0 : 'clamp(1.5rem, 5vw, 4rem)',

                opacity: 1,

                scale: 1,

              }}

              transition={splashStage >= 1 ? { duration: 0.8, ease: 'easeInOut' } : { duration: 0.6, ease: 'easeOut' }}

            >

              S

            </motion.span>

            {/* URAASA — reveals after split */}

            <motion.span

              className="font-black inline-block overflow-hidden"

              style={{ ...fontStyle, whiteSpace: 'nowrap' }}

              initial={{ width: 0, opacity: 0 }}

              animate={splashStage >= 1 ? { width: 'auto', opacity: 1 } : { width: 0, opacity: 0 }}

              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}

            >

              URAASA

            </motion.span>

          </div>



          {/* Bottom row: S + CHOOL */}

          <div className="flex items-center justify-center" style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)' }}>

            {/* Right S — starts centered top, moves down */}

            <motion.span

              className="font-bold inline-block tracking-[0.4em]"

              style={fontStyle}

              initial={{ y: 'clamp(-2rem, -5vw, -5rem)', x: 'clamp(-0.5rem, -1vw, -1.5rem)', opacity: 0, scale: 0.5 }}

              animate={{

                y: splashStage >= 1 ? 0 : 'clamp(-2rem, -5vw, -5rem)',

                x: splashStage >= 1 ? 0 : 'clamp(-0.5rem, -1vw, -1.5rem)',

                opacity: splashStage >= 1 ? 1 : 0,

                scale: 1,

              }}

              transition={{ duration: 0.8, delay: splashStage >= 1 ? 0.1 : 0, ease: 'easeInOut' }}

            >

              S

            </motion.span>

            {/* CHOOL — reveals after split */}

            <motion.span

              className="font-bold inline-block tracking-[0.4em] overflow-hidden"

              style={{ ...fontStyle, whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.9)' }}

              initial={{ width: 0, opacity: 0 }}

              animate={splashStage >= 1 ? { width: 'auto', opacity: 1 } : { width: 0, opacity: 0 }}

              transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}

            >

              CHOOL

            </motion.span>

          </div>

        </div>

      </motion.div>

    )

  }



  return adminPanelVisible ? (

    <AdminDashboard onClose={handleAdminClose} onDataChange={loadSiteData} />

  ) : (

    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1F44 0%, #020617 100%)', color: '#FFFFFF' }}>

      <div className="absolute inset-0" />



      <header className={`sticky top-0 z-50 transition-all duration-500 ${navScrolled ? 'navbar-glass shadow-xl' : ''}`} style={{ background: navScrolled ? undefined : 'rgba(10, 31, 68, 0.6)', borderBottom: '2px solid rgba(255, 215, 0, 0.3)' }}>

        <div className="container mx-auto flex items-center justify-between p-4 md:p-6">

          <div className="flex items-center gap-3">

            {getContent('logo_url') ? (

              <img src={getImageContent('logo_url')} alt="SURAASA Logo" className="w-12 h-12 rounded-full object-cover shadow-lg gold-pulse" style={{ border: '2px solid #FFD700' }} />

            ) : (

              <div className="w-10 h-10 rounded-full font-black flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #FFD700, #FFE44D)', color: '#1a1a1a' }}>S</div>

            )}

            <div>

              <h1 className="text-lg md:text-xl font-extrabold tracking-widest gold-shimmer" style={{ fontFamily: "'Playfair Display', serif" }}>SURAASA SCHOOL</h1>

              <p className="text-xs tracking-wider" style={{ color: '#EAEAEA' }}>IIT Campus, Vemulawada</p>

            </div>

          </div>



          <nav className="hidden md:flex items-center gap-5 text-sm uppercase tracking-widest" style={{ color: '#EAEAEA' }}>

            {['home', 'about', 'academics', 'admissions', 'campus', 'news', 'contact'].map((item) => (

              <a key={item} href={`#${item}`} className="hover:text-[#FFD700] transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:transition-all after:duration-300" style={{ '--tw-after-bg': '#FFD700' }}>{item}</a>

            ))}

            <button onClick={() => setAdminPanelVisible(true)} className="btn-glow rounded-lg px-5 py-2 text-xs">Admin Login</button>

          </nav>



          <button className="md:hidden" style={{ color: '#FFD700' }} onClick={() => setNavOpen(!navOpen)}><FaBars /></button>

        </div>

        {navOpen && (

          <div className="p-4 md:hidden" style={{ background: 'rgba(10, 31, 68, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>

            {['home', 'about', 'academics', 'admissions', 'campus', 'news', 'contact'].map((item) => (

              <a key={item} href={`#${item}`} onClick={() => setNavOpen(false)} className="block py-2.5 text-sm uppercase tracking-wider hover:text-[#FFD700] transition" style={{ color: '#EAEAEA' }}>{item}</a>

            ))}

            <button onClick={() => { setAdminPanelVisible(true); setNavOpen(false)}} className="btn-glow w-full mt-3 rounded-lg px-4 py-2.5 text-sm">Admin Login</button>

          </div>

        )}

      </header>



      <ParallaxSection
        id="home"
        className="relative min-h-[80vh]"
        bgImage={`linear-gradient(180deg, rgba(255, 215, 0, 0.35) 0%, rgba(245, 197, 24, 0.5) 40%, rgba(255, 230, 128, 0.7) 70%, rgba(255, 253, 247, 0.95) 100%), url('${getImageContent('hero_background')}')`}
        speed={0.5}
      >

        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 60%)' }} />

        <div className="relative container mx-auto py-28 text-center">

          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1, x: mouse.x * 0.5, translateY: mouse.y * 0.3 }} transition={{ duration: 1.2, x: { duration: 0.15, ease: 'linear' }, translateY: { duration: 0.15, ease: 'linear' } }} className="text-4xl md:text-7xl font-black leading-tight heading-premium" style={{ color: '#FFFFFF', textShadow: '0 4px 20px rgba(212,175,55,0.3)' }}>{getContent('hero_title')}</motion.h2>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, x: mouse.x * -0.3, translateY: mouse.y * -0.2 }} transition={{ delay: 0.3, duration: 1, x: { duration: 0.15, ease: 'linear' }, translateY: { duration: 0.15, ease: 'linear' } }} className="mt-5 text-lg md:text-2xl font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif", color: '#EAEAEA' }}>{getContent('hero_subtitle')}</motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, x: mouse.x * 0.2, translateY: mouse.y * 0.15 }} transition={{ delay: 0.5, duration: 1, x: { duration: 0.15, ease: 'linear' }, translateY: { duration: 0.15, ease: 'linear' } }} className="mt-10 flex flex-col md:flex-row justify-center gap-5">

            <button type="button" onClick={() => scrollToSection('contact')} className="btn-glow rounded-full px-10 py-4 text-base">{getContent('hero_cta')}</button>

            <a href="#admissions" className="btn-gold rounded-full px-10 py-4">Apply Now</a>

          </motion.div>

        </div>

        <button type="button" onClick={() => scrollToSection('contact')} className="absolute right-4 bottom-8 z-20 btn-glow rounded-full py-3 px-6 animate-bounce cursor-pointer text-sm">Enquire Now</button>

      </ParallaxSection>



      <section id="about" className="py-24 relative" style={{ background: '#0A1F44' }}>

        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%)' }} />

        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <motion.div variants={fadeInUp} className="glass card-lift rounded-3xl p-10">

              <div className="gold-accent-left">

              <h3 className="text-3xl font-bold mb-5 heading-premium gold-shimmer">{getContent('campus_title')}</h3>

              <p className="leading-relaxed text-lg" style={{ color: '#EAEAEA' }}>{getContent('campus_description')}</p>

              </div>

            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-2xl gold-border-glow" style={{ border: '1px solid rgba(255, 215, 0, 0.2)' }}>

              <img src={getImageContent('campus_image')} alt="Campus" className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />

            </motion.div>

          </motion.div>

          </ScrollReveal>

        </div>

      </section>



      <section id="academics" className="py-24 relative" style={{ background: '#0A1F44' }}>


        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%)' }} />

        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-center heading-premium gold-shimmer">Premium Facilities</motion.h2>

          <div className="section-divider mb-12 mt-4" />

          </ScrollReveal>



          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-7">

            {premiumFeatureSections.map((section) => (

              <TiltCard key={section.title} className="h-full" intensity={40}>

              <motion.div

                variants={fadeInUp}

                whileTap={{ scale: 0.98 }}

                transition={{ type: 'spring', stiffness: 260, damping: 18 }}

                className="relative overflow-hidden rounded-3xl shadow-2xl h-full gold-shadow"

                style={{ border: '1px solid rgba(255, 255, 255, 0.12)', background: section.title === 'Why Choose Us' ? 'rgba(255, 255, 255, 0.05)' : undefined }}

              >

                {section.title !== 'Why Choose Us' && (

                  <>

                    <img src={section.image} alt={section.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />

                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10, 31, 68, 0.7) 0%, rgba(8, 24, 51, 0.92) 100%)' }} />

                  </>

                )}

                <div className="relative z-10 p-7">

                  {section.title === 'Why Choose Us' && (

                    <div className="mb-5 overflow-hidden rounded-2xl shadow-xl" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>

                      <img

                        src={section.image}

                        alt="Why Choose Us"

                        className="h-52 w-full object-cover object-center hover:scale-105 transition-transform duration-700"

                        loading="lazy"

                        onError={(e) => {

                          e.currentTarget.src = '/suraasa-logo.jpeg'

                        }}

                      />

                    </div>

                  )}

                  <div className="gold-accent-left">

                  <h3 className="text-3xl font-extrabold mb-4 heading-premium" style={{ color: '#FFFFFF' }}>{section.title}</h3>

                  </div>

                  <ul className="space-y-2.5 mt-4" style={{ color: '#FFFFFF' }}>

                    {section.items.map((item) => (

                      <li key={item} className="flex items-start gap-2.5">

                        <span style={{ color: '#FFD700' }} className="mt-1">&#9670;</span>

                        <span>{item}</span>

                      </li>

                    ))}

                  </ul>

                </div>

              </motion.div>

              </TiltCard>

            ))}

          </motion.div>

        </div>

      </section>



      <section id="news" className="py-24 relative" style={{ background: '#0A1F44' }}>


        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-center heading-premium gold-shimmer">News & Events</motion.h2>

          <div className="section-divider mb-12 mt-4" />

          </ScrollReveal>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {events.length ? events.map((event) => (

              <motion.div key={event.id} variants={fadeInUp} className="glass rounded-3xl overflow-hidden cursor-pointer transition-all duration-400" onClick={() => setLightboxImage(resolveMediaUrl(event.image_url))} style={{ ':hover': { borderColor: 'rgba(255, 215, 0, 0.4)' } }}>

                <div style={{ background: '#0A1F44' }}>

                  <img

                    src={resolveMediaUrl(event.image_url) || 'https://images.unsplash.com/photo-1542868100-9a2f2d4109cc?auto=format&fit=crop&w=1600&q=80'}

                    alt={event.title || 'Event'}

                    className="w-full h-auto max-h-[360px] object-contain hover:scale-[1.02] transition-transform duration-500"

                    loading="lazy"

                  />

                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{event.title}</h3>

                  {event.date && <p className="text-sm mt-1" style={{ color: '#FFD700' }}>{event.date}</p>}

                </div>

              </motion.div>

            )) : fallbackEventImages.map((url, idx) => (

              <motion.div key={`fallback-${idx}`} variants={fadeInUp} className="glass rounded-3xl overflow-hidden cursor-pointer transition-all duration-400" onClick={() => setLightboxImage(url)}>

                <div style={{ background: '#0A1F44' }}>

                  <img src={url} alt="Event" className="w-full h-auto max-h-[360px] object-contain hover:scale-[1.02] transition-transform duration-500" loading="lazy" />

                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Event</h3>

                </div>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>



      <section id="admissions" className="py-24 text-center relative" style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #081833 50%, #0A1F44 100%)' }}>


        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)' }} />

        <div className="container mx-auto relative">

          <motion.h2 initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold mb-4 heading-premium gold-shimmer">Admissions Open</motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Reserve your child's spot now for the 2026-27 academic year.</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="mx-auto mt-8 max-w-md">

            <motion.img
              src="/Ready%20for%20school%20smiles%20transparent.png"
              alt="Ready for school smiles"
              className="w-full h-auto object-contain drop-shadow-2xl"
              animate={{ y: [0, -15, 0], x: mouse.x * 0.8, rotateY: mouse.x * 0.3, rotateX: mouse.y * -0.3 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', x: { duration: 0.2, ease: 'linear' }, rotateY: { duration: 0.2, ease: 'linear' }, rotateX: { duration: 0.2, ease: 'linear' } }}
              style={{ transformStyle: 'preserve-3d' }}
              loading="lazy"
            />

          </motion.div>



          <motion.form initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} onSubmit={handleAdmission} className="mx-auto mt-10 max-w-4xl gold-highlight-box p-8" style={{ borderWidth: '2px' }}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">

              <input name="student_name" placeholder="Student Name" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="parent_name" placeholder="Parent Name" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="email" type="email" placeholder="Email Address" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="phone" placeholder="Phone Number" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="grade" placeholder="Applying For Grade" required className="input-premium w-full rounded-xl px-5 py-3.5 md:col-span-2" />

            </div>

            <button type="submit" className="btn-gold mt-8 inline-block rounded-full px-12 py-4 text-lg">Start Application</button>

            {admissionSent && <p className="mt-4 text-center font-semibold text-emerald-400">Application submitted successfully.</p>}

          </motion.form>

        </div>

      </section>



      <section id="results" className="py-24 relative" style={{ background: '#0A1F44' }}>


        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-center heading-premium gold-shimmer">Student Results</motion.h2>

          <div className="section-divider mb-12 mt-4" />

          </ScrollReveal>



          <motion.div

            initial="hidden"

            whileInView="visible"

            viewport={{ once: false, amount: 0.35 }}

            variants={staggerContainer}

            onViewportEnter={() => setResultsInView(true)}

            onViewportLeave={() => setResultsInView(false)}

            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"

          >

            <TiltCard intensity={40}>
            <motion.div variants={fadeInUp} className="gold-highlight-box card-lift rounded-2xl p-8 text-center gold-shadow">

              <p className="text-5xl font-black gold-shimmer"><CountUp end={100} start={resultsInView} />+</p>

              <p className="mt-3 tracking-wide" style={{ color: '#EAEAEA' }}>Students Trained</p>

            </motion.div>
            </TiltCard>

            <TiltCard intensity={40}>
            <motion.div variants={fadeInUp} className="gold-highlight-box card-lift rounded-2xl p-8 text-center gold-shadow">

              <p className="text-5xl font-black gold-shimmer"><CountUp end={1} start={resultsInView} />st</p>

              <p className="mt-3 tracking-wide" style={{ color: '#EAEAEA' }}>1st Rank in Olympiad</p>

            </motion.div>
            </TiltCard>

            <TiltCard intensity={40}>
            <motion.div variants={fadeInUp} className="gold-highlight-box card-lift rounded-2xl p-8 text-center gold-shadow">

              <p className="text-5xl font-black gold-shimmer"><CountUp end={30} start={resultsInView} />+</p>

              <p className="mt-3 tracking-wide" style={{ color: '#EAEAEA' }}>Expert Faculty</p>

            </motion.div>
            </TiltCard>

          </motion.div>



          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {sortedResults.length ? sortedResults.map((item) => (

              <TiltCard key={item.id} intensity={40}>

              <motion.div variants={fadeInUp} className="glass card-lift rounded-3xl p-7 h-full">

                <div className="flex items-center gap-3 mb-4"><FaGraduationCap className="text-4xl" style={{ color: '#FFD700' }} /><h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{item.student_name}</h3></div>

                <p style={{ color: '#EAEAEA' }}>{item.grade} &bull; {item.subject}</p>

                <p className="text-3xl font-extrabold gold-shimmer mt-2">Rank {item.rank}</p>

                {item.is_topper && <p className="mt-2 text-sm font-semibold text-emerald-400">Topper</p>}

              </motion.div>

              </TiltCard>

            )) : <p style={{ color: '#EAEAEA' }}>No results added yet.</p>}

          </motion.div>

        </div>

      </section>



      <section id="campus" className="py-24 relative" style={{ background: '#0A1F44' }}>


        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-center heading-premium gold-shimmer">Gallery</motion.h2>

          <div className="section-divider mb-12 mt-4" />

          </ScrollReveal>



          {galleryItems.length ? (

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="relative rounded-3xl overflow-hidden border border-[#FFD700]/20 shadow-2xl mb-8">

              <AnimatePresence mode="wait">

                <motion.img

                  key={galleryItems[galleryIndex].id || galleryIndex}

                  src={resolveMediaUrl(galleryItems[galleryIndex].url)}

                  alt={galleryItems[galleryIndex].caption || 'Gallery slide'}

                  className="w-full h-[420px] md:h-[520px] object-contain"

                  style={{ background: '#0A1F44' }}

                  initial={{ opacity: 0, scale: 1.04 }}

                  animate={{ opacity: 1, scale: 1 }}

                  exit={{ opacity: 0, scale: 0.98 }}

                  transition={{ duration: 0.45 }}

                />

              </AnimatePresence>

              <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(255,253,247,0.7) 0%, transparent 40%)' }} />

              <button

                onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}

                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 btn-glow rounded-full px-4 py-2 text-sm"

              >

                Prev

              </button>

              <button

                onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryItems.length)}

                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 btn-glow rounded-full px-4 py-2 text-sm"

              >

                Next

              </button>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center">

                <p className="text-lg font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{galleryItems[galleryIndex].caption || `Slide ${galleryIndex + 1}`}</p>

              </div>

              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">

                {galleryItems.map((_, idx) => (

                  <button

                    key={`dot-${idx}`}

                    onClick={() => setGalleryIndex(idx)}

                    className="h-2.5 w-2.5 rounded-full transition-all duration-300"

                    style={{ background: idx === galleryIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.3)', boxShadow: idx === galleryIndex ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none' }}

                    aria-label={`Go to slide ${idx + 1}`}

                  />

                ))}

              </div>

            </motion.div>

          ) : (

            <p className="text-gray-500">No gallery pictures provided yet.</p>

          )}

        </div>

      </section>



      <section id="contact" className="py-24 relative" style={{ background: '#0A1F44' }}>


        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%)' }} />

        <div className="container mx-auto relative">

          <ScrollReveal>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-center heading-premium gold-shimmer">Get in Touch</motion.h2>

          <div className="section-divider mb-12 mt-4" />

          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="glass card-lift rounded-3xl p-10">

              <div className="gold-accent-left mb-6">

              <h3 className="text-2xl font-bold heading-premium" style={{ color: '#FFD700' }}>Contact Details</h3>

              </div>

              <p className="mb-4 text-lg" style={{ color: '#EAEAEA' }}>🏫 Suraasa High School, Vemulawada</p>

              <p className="mb-4 text-lg" style={{ color: '#EAEAEA' }}>📞 <a href="tel:9440242264" className="hover:text-[#FFD700] transition-all duration-300" style={{ color: '#EAEAEA' }}>9440242264</a></p>

              <div className="rounded-xl overflow-hidden h-64 mt-6" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>

                <iframe title="Suraasa High School Map" src="https://www.google.com/maps?q=Suraasa+High+School,+Vemulawada&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />

              </div>

            </motion.div>

            <motion.form initial="hidden" whileInView="visible" variants={fadeInUp} onSubmit={handleContact} className="glass card-lift rounded-3xl p-10 space-y-5">

              <input name="name" placeholder="Your Name" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="email" type="email" placeholder="Email Address" required className="input-premium w-full rounded-xl px-5 py-3.5" />

              <input name="phone" placeholder="Phone Number" className="input-premium w-full rounded-xl px-5 py-3.5" />

              <textarea name="message" placeholder="Your Message" rows="4" className="input-premium w-full rounded-xl px-5 py-3.5" />

              <button type="submit" className="btn-glow rounded-xl px-6 py-3.5 w-full text-lg">Send Message</button>

              {contactSent && <p className="text-emerald-400 text-center font-semibold">✓ Message sent successfully!</p>}

            </motion.form>

          </div>

        </div>

      </section>



      <footer className="py-10 text-center relative" style={{ background: '#0A1F44' }}>


        <p className="tracking-widest text-sm" style={{ color: '#EAEAEA' }}>© {new Date().getFullYear()} <span className="gold-shimmer font-semibold">Suraasa High School</span>, Vemulawada</p>

      </footer>



      {showTop && (

        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full btn-glow shadow-2xl hover:scale-110 transition-transform duration-300">

          <FaChevronUp />

        </button>

      )}



      {lightboxImage && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(255, 253, 247, 0.92)' }} onClick={() => setLightboxImage(null)}>

          <button className="absolute top-6 right-6 text-4xl font-bold transition-all duration-300 hover:scale-110" style={{ color: '#FFD700' }} onClick={() => setLightboxImage(null)}>&times;</button>

          <img src={lightboxImage} alt="Event" className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl" style={{ boxShadow: '0 0 60px rgba(255, 215, 0, 0.15)' }} onClick={(e) => e.stopPropagation()} />

        </div>

      )}

    </div>

  )

}



export default App

