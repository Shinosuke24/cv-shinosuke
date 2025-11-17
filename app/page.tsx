"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Navigation } from "@/components/navigation"
import { CursorFollower } from "@/components/cursor-follower" 
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Database,
  Server,
  Smartphone,
  Instagram,
  User,
  GraduationCap,
  MapPin,
  Volume2, 
  VolumeX, 
  RotateCcw, // Ikon Repeat
  Briefcase, // Ikon untuk Work Experience
  BookOpen,  // Ikon untuk Training
  Users,     // Ikon untuk Committee
  BookOpenCheck, // Ikon untuk Education
} from "lucide-react"

export default function CVPage() {
  // === HANYA MENGGUNAKAN SATU ID VIDEO ===
  const YOUTUBE_VIDEO_ID = "Sx5wp4J_oVc"; 
  
  // === STATE DAN REF UNTUK KONTROL AUDIO ===
  const [isMuted, setIsMuted] = useState(true) 
  const playerRef = useRef<HTMLIFrameElement>(null)
  // ===============================================

  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  // === FUNGSI KONTROL MUTE/UNMUTE & PLAY/PAUSE (DIGABUNG) ===
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev
      
      if (playerRef.current) {
        // 1. Mengatur Volume (Mute/Unmute)
        playerRef.current.contentWindow?.postMessage(
          `{"event":"command","func":"setVolume","args":[${newMutedState ? 0 : 100}]}`,
          "*",
        )
        
        // 2. Mengatur Play/Pause (Jika Mute, maka Pause; Jika Unmute, maka Play)
        const command = newMutedState ? "pauseVideo" : "playVideo";
        playerRef.current.contentWindow?.postMessage(
            `{"event":"command","func":"${command}","args":[]}`,
            "*",
        );
      }
      return newMutedState
    })
  }
  
  // === FUNGSI REPLAY TRACK (Ulang dari Awal) ===
  const replayCurrentTrack = () => {
      if (playerRef.current) {
          playerRef.current.contentWindow?.postMessage(
              `{"event":"command","func":"seekTo","args":[0, true]}`,
              "*",
          )
          
          if (!isMuted) {
               playerRef.current.contentWindow?.postMessage(
                  `{"event":"command","func":"playVideo","args":[]}`,
                  "*",
              );
          }
      }
  }
  // ===================================

  useEffect(() => {
    setIsVisible(true)

    // Logika Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    // Listener Pesan YouTube untuk Mengaktifkan Kontrol
    const onYouTubeIframeAPIReady = () => {
        if (playerRef.current) {
             playerRef.current.contentWindow?.postMessage(
                `{"event":"command","func":"setVolume","args":[0]}`, 
                "*",
            )
        }
    };

    const handleMessage = (event: MessageEvent) => {
        if (event.origin === "https://www.youtube.com") {
             try {
                const data = JSON.parse(event.data);
                if (data.event === 'onReady') {
                    onYouTubeIframeAPIReady();
                }
             } catch (e) {
                 // Ignore non-JSON messages
             }
        }
    };

    window.addEventListener("message", handleMessage);
    
    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener("message", handleMessage); 
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }


  // --- DATA PENGALAMAN KERJA (DARI GAMBAR CV) ---
  const workExperiences = [
    {
      title: "CEO & Founder",
      company: "JK.Shinske",
      period: "Apr 2020",
      description: "Since 2020, I have independently built and led a Mobile Legends joki service, starting from small operations to becoming a trusted service for many players. Responsible for operational management, joki team, marketing strategies, and ensuring consistent service quality. This experience shaped my skills in business management, client relations, strategic decision-making, and deep understanding of the esports ecosystem.",
      logo: "/jkshinske-logo.png" 
    },
    {
      title: "Project Manager",
      company: "Toko Roti Wunoasari",
      period: "Aug 2025",
      description: "Employed as a project manager for a bakery located in the Wunoasari area.",
      logo: "/lion-logo.png"
    },
    {
      title: "Full Stack Developer",
      company: "PT. Lion Wings Indonesia",
      period: "Sept 2025",
      description: "Worked on developing a special website for admin purposes.",
      logo: "/lion-logo.png"
    },
    {
      title: "Sub Dealer",
      company: "PT. Samsung Electronics Indonesia",
      period: "Jul 2025",
      description: "Invited to attend a VIP meeting at a Singapore restaurant for the launch of Samsung Galaxy Z Fold 7 | Z Flip 7.",
      logo: "/samsung-logo.png"
    },
    {
      title: "Sub Dealer",
      company: "PT. Candii Jitu Indonesia",
      period: "May 2025",
      description: "Received an invitation to attend the Toshiba gathering event held at Ballroom Swissbell Hotel Solo.",
      logo: "/candii-jitu-logo.png"
    },
    {
      title: "Sub Dealer",
      company: "PT. Haier Group",
      period: "Jan 2024 - Jul 2025",
      description: "Attended several VIP invitation gathering events.",
      logo: "/haier-logo.png"
    },
  ];

  // --- DATA PELATIHAN & KURSUS (DARI GAMBAR CV) ---
  const trainingAndCourses = [
    {
      title: "IT Multimedia",
      company: "Humas UGM",
      period: "Sept 2025",
      description: "Participated in various trainings and courses in the UGM Public Relations Department, specifically in Multimedia. Topics included visual communication management, digital media, photography, videography, graphic design, and event documentation. This experience enhanced my skills in design, creative processes, and using technology for institutional information and branding.",
    },
  ];

  // --- DATA PENGALAMAN KOMITE (DARI GAMBAR CV) ---
  const committeeExperiences = [
    {
      title: "Member of Komatik UGM",
      company: "Software Research Development Division",
      period: "Nov 2024",
      description: "Active member of the Software Research Development Division at Komatik UGM, focusing on software innovation and research projects.",
    },
    {
      title: "Staff of Paskah UGM",
      company: "HumpubIT Division",
      period: "May 2025",
      description: "Served as staff in the HumpubIT Division for Paskah UGM, handling public relations and digital infrastructure aspects.",
    },
    {
      title: "Staff of NEX x SRE UGM Policy Case Competition",
      company: "Multimedia & Documentation Division",
      period: "Aug 2025",
      description: "Participated as staff in the NEX x SRE UGM Policy Case Competition, contributing to event organization and multimedia documentation.",
    },
    {
      title: "Staff of Porsenigama UGM",
      company: "IT Division",
      period: "Aug 2025",
      description: "Worked as staff in the IT Division for Porsenigama UGM, managing technical operations and digital systems."
    },
    {
      title: "Event Support Inauguration of Professor",
      company: "IT Multimedia",
      period: "Sept 2025",
      description: "Provided IT Multimedia support for the professor inauguration event.",
    },
    {
      title: "Event Support UKM Swagayugama",
      company: "IT Multimedia",
      period: "Oct 2025",
      description: "Provided IT Multimedia support for the Swagayugama student activity unit event.",
    },
    {
      title: "Event Support the 16th Anniversary of UGM Vocational",
      company: "IT Multimedia",
      period: "Oct 2025",
      description: "Provided IT Multimedia support for the 16th Anniversary of UGM Vocational.",
    },
    {
      title: "Event Support UGM Graduation",
      company: "IT Multimedia",
      period: "Nov 2025",
      description: "Provided IT and Multimedia support for the UGM graduation event.",
    },
  ];
  
  // --- DATA BARU: EDUCATION (DARI GAMBAR CV) ---
  const education = [
    {
      school: "Gadjah Mada University",
      major: "Software Engineering",
      period: "Juni 2021 - Mei 2024",
      description: "Currently pursuing a degree in Software Engineering, focusing on full-stack development, database management, and system architecture. Actively participating in campus organizations and independent projects to gain practical skills."
    },
  ];

  // === DATA PORTOFOLIO (YANG SEBELUMNYA HILANG/BELUM ADA) ===
  const portfolioItems = [
    {
      title: "Lion Wings Indonesia",
      description: "Development of an admin website for managing products and orders",
      image: "/lionwings.png",
      tech: ["TypeScript", "JavaScipt", "CSS"],
      link: "https://github.com/Shinosuke24/pt-lion-wings-stock-system.git",
    },
    {
      title: "Restaurant Management",
      description: "Aplikasi manajemen restoran dengan POS system",
      image: "/restaurant-pos-system.png",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      link: "https://github.com/shinosuke/restaurant-pos",
    },
    {
      title: "Learning Management System",
      description: "Platform pembelajaran online untuk institusi pendidikan",
      image: "/learning-management-system.png",
      tech: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/shinosuke/lms-platform",
    },
    {
      title: "IoT Dashboard",
      description: "Dashboard monitoring untuk perangkat IoT",
      image: "/iot-monitoring-dashboard.png",
      tech: ["Vue.js", "Socket.io", "InfluxDB"],
      link: "https://github.com/shinosuke/iot-dashboard",
    },
  ]
  // --- AKHIR DATA ---
  
  // ... (JSX dimulai) ...

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 custom-cursor-wrapper">
      
      {/* 1. EFEK VISUAL: CURSOR FOLLOWER KEREN (PLASMA BLOB) */}
      <CursorFollower />
      
      {/* 2. MUSIK LATAR TERSEMBUNYI (YOUTUBE EMBED) */}
      {YOUTUBE_VIDEO_ID && ( 
        <div className="fixed bottom-0 right-0 z-[0] w-[1px] h-[1px] opacity-0 overflow-hidden pointer-events-none">
            <iframe 
               ref={playerRef} 
               src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`} 
               title="YouTube background music player" 
               width="1" 
               height="1"
               allow="autoplay; encrypted-media; gyroscope;" 
               frameBorder="0"
               allowFullScreen
            ></iframe>
        </div>
      )}
      
      {/* BACKGROUND ANIMASI */}
      <div className="animated-background"></div>
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* FIXED BUTTONS - TEMA DAN KONTROL MUSIK */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Kontrol Musik di Kiri Navigasi - HANYA TOMBOL SPEAKER DAN REPLAY */}
      <div className="fixed top-4 left-20 z-50 flex space-x-2"> 
         
         {/* TOMBOL MUTE/UNMUTE (SEKALIGUS PLAY/PAUSE) */}
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            className="hover:scale-110 transition-transform duration-200"
            title={isMuted ? "Unmute & Play Music" : "Mute & Pause Music"}
        >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-primary" />}
        </Button>
        
        {/* TOMBOL REPLAY / REPEAT CURRENT TRACK */}
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={replayCurrentTrack} 
            className="hover:scale-110 transition-transform duration-200"
            title="Replay Current Track"
        >
            <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <Navigation activeSection={activeSection} onSectionClick={scrollToSection} /> 

      {/* SECTION HOME (Tidak Berubah) */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 px-4 min-h-screen flex items-center"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`relative ${isVisible ? "animate-bounce-in animation-delay-200" : "opacity-0"}`}>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse-slow animate-glow animate-auto-float-slow"></div>
                <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center animate-float hover:scale-105 transition-all duration-200 overflow-hidden animate-gentle-bob">
                  <img
                    src="/professional-headshot-of-a-young-male-software-dev.png"
                    alt="Shinosuke Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"
                      }
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center hover:scale-105 transition-all duration-200">
                        <Code className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg">Shinosuke Alexander</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Full Stack Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`space-y-6 ${isVisible ? "animate-bounce-in" : "opacity-0"}`}>
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-balance">
                  <span className="text-foreground">My name is</span>
                  <br />
                  <span className="text-primary animate-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
                    Shinosuke Alexander
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground text-pretty flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Gadjah Mada University
                </p>
              </div>

              <div
                className={`flex flex-wrap gap-2 sm:gap-4 ${isVisible ? "animate-bounce-in animation-delay-400" : "opacity-0"}`}
                data-animate="social-buttons"
                id="social-buttons"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent text-xs sm:text-sm animate-auto-float float-delay-1 ${
                    visibleElements.has("social-buttons")
                      ? "animate-fly-in-up animation-delay-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  asChild
                >
                  <a href="https://instagram.com/shinosukeas" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                    Instagram
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent text-xs sm:text-sm animate-auto-float-slow float-delay-2 ${
                    visibleElements.has("social-buttons")
                      ? "animate-fly-in-up animation-delay-200"
                      : "translate-y-8 opacity-0"
                  }`}
                  asChild
                >
                  <a href="https://linkedin.com/in/shinosuke" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent text-xs sm:text-sm animate-auto-float-reverse float-delay-3 ${
                    visibleElements.has("social-buttons")
                      ? "animate-fly-in-up animation-delay-300"
                      : "translate-y-8 opacity-0"
                  }`}
                  asChild
                >
                  <a href="mailto:shinosuke675@gmail.com">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    Gmail
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent text-xs sm:text-sm animate-gentle-bob float-delay-4 ${
                    visibleElements.has("social-buttons")
                      ? "animate-fly-in-up animation-delay-400"
                      : "translate-y-8 opacity-0"
                  }`}
                  asChild
                >
                  <a href="https://github.com/Shinosuke24" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                    GitHub
                  </a>
                </Button>
              </div>

              <div
                className={`flex flex-col sm:flex-row gap-4 ${isVisible ? "animate-bounce-in animation-delay-600" : "opacity-0"}`}
              >
                <Button
                  size="lg"
                  className="gap-2 hover:scale-105 transition-all duration-200 animate-glow"
                  onClick={() => scrollToSection("contact")}
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-transparent hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  onClick={() => scrollToSection("portfolio")}
                >
                  <Code className="w-4 h-4" />
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ABOUT (Tidak Berubah) */}
      <section id="about" className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Get to know me better</p>
          </div>

          <Card
            className={`${visibleElements.has("about-card") ? "animate-fly-in-up" : "translate-y-8 opacity-0"} transition-all duration-700`}
            data-animate="about-card"
            id="about-card"
          >
            <CardContent className="p-6 sm:p-8">
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    <img
                      src="/wisuda.jpg"
                      alt="Shinosuke"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"
                        }
                      }}
                    />
                    <User className="hidden w-16 h-16 sm:w-24 sm:h-24 text-primary-foreground" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold">Shinosuke Alexander</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Kabupaten Sleman, Yogyakarta, Indonesia</span>
                  </div>
                  <p className="text-muted-foreground text-pretty leading-relaxed text-sm sm:text-base">
                    I am a student of UGM  majoring in Software Engineering, with a great interest in
                    programming and technology. I am actively learning through various online sources such as YouTube,
                    and am currently looking for practical experience to prepare myself for the industrial world.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="hover:scale-105 transition-all duration-200 text-xs">
                     Gadjah Mada University
                    </Badge>
                    <Badge variant="secondary" className="hover:scale-105 transition-all duration-200 text-xs">
                      Full Stack Developer
                    </Badge>
                    <Badge variant="secondary" className="hover:scale-105 transition-all duration-200 text-xs">
                      Tech Enthusiast
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION BARU: PENGALAMAN KERJA */}
      <section id="work" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Briefcase className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Work Experience</h2>
            <p className="text-muted-foreground text-lg">My professional journey in the industry</p>
          </div>

          <div className="space-y-8">
            {workExperiences.map((exp, index) => (
              <Card
                key={`${exp.title}-${index}`}
                className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  visibleElements.has(`work-${index}`) ? "animate-fly-in-up" : "translate-x-[-50px] opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`work-${index}`}
                id={`work-${index}`}
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <div className="text-sm text-muted-foreground mb-2">{exp.period}</div>
                      <div className="font-semibold text-primary">{exp.company}</div>
                    </div>
                    <div className="lg:col-span-3">
                      <h3 className="text-xl font-bold mb-3">{exp.title}</h3>
                      <p className="text-muted-foreground text-pretty">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BARU: PELATIHAN & KURSUS */}
      <section id="training" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Training & Courses</h2>
            <p className="text-muted-foreground text-lg">Structured learning and certification</p>
          </div>

          <div className="space-y-8">
            {trainingAndCourses.map((exp, index) => (
              <Card
                key={`${exp.title}-${index}`}
                className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  visibleElements.has(`training-${index}`) ? "animate-fly-in-up" : "translate-x-50px opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`training-${index}`}
                id={`training-${index}`}
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <div className="text-sm text-muted-foreground mb-2">{exp.period}</div>
                      <div className="font-semibold text-primary">{exp.company}</div>
                    </div>
                    <div className="lg:col-span-3">
                      <h3 className="text-xl font-bold mb-3">{exp.title}</h3>
                      <p className="text-muted-foreground text-pretty">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BARU: PENGALAMAN KOMITE */}
      <section id="committee" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Committee Experience</h2>
            <p className="text-muted-foreground text-lg">My organizational and event involvement</p>
          </div>

          <div className="space-y-8">
            {committeeExperiences.map((exp, index) => (
              <Card
                key={`${exp.title}-${index}`}
                className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  visibleElements.has(`committee-${index}`) ? "animate-fly-in-up" : "translate-x-[-50px] opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`committee-${index}`}
                id={`committee-${index}`}
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <div className="text-sm text-muted-foreground mb-2">{exp.period}</div>
                      <div className="font-semibold text-primary">{exp.company}</div>
                    </div>
                    <div className="lg:col-span-3">
                      <h3 className="text-xl font-bold mb-3">{exp.title}</h3>
                      <p className="text-muted-foreground text-pretty">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION BARU: EDUCATION (Menggantikan Featured Projects) */}
      <section id="education" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <BookOpenCheck className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Education</h2>
            <p className="text-muted-foreground text-lg">My academic background</p>
          </div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card
                key={edu.school}
                className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  visibleElements.has(`education-${index}`) ? "animate-fly-in-up" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`education-${index}`}
                id={`education-${index}`}
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <div className="text-sm text-muted-foreground mb-2">{edu.period}</div>
                      <div className="font-semibold text-primary">{edu.major}</div>
                    </div>
                    <div className="lg:col-span-3">
                      <h3 className="text-xl font-bold mb-3">{edu.school}</h3>
                      <p className="text-muted-foreground text-pretty">{edu.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PORTFOLIO (Dipindahkan ke bawah Education) */}
      <section id="portfolio" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Portfolio</h2>
            <p className="text-muted-foreground text-lg">Showcase of my work</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portfolioItems.map((item, index) => (
              <Card
                key={item.title}
                className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden ${
                  visibleElements.has(`portfolio-${index}`) ? "animate-fly-in-up" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`portfolio-${index}`}
                id={`portfolio-${index}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg?height=300&width=500&query=modern web application dashboard"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="group-hover:text-primary transition-colors duration-300 text-lg">
                      {item.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce-hover hover:bg-primary hover:text-primary-foreground shrink-0"
                      asChild
                    >
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                  <CardDescription className="text-pretty text-sm leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Want to see more of my work?</p>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
              asChild
            >
              <a href="https://github.com/Shinosuke24" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                View All Projects on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION CONTACT (Tidak Berubah) */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div
            className={`space-y-8 ${
              visibleElements.has("contact-content") ? "animate-fly-in-up" : "translate-y-8 opacity-0"
            } transition-all duration-700`}
            data-animate="contact-content"
            id="contact-content"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Let's Work Together</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Ready to bring your ideas to life? Let's discuss your next project.
              </p>
            </div>

            <div className="flex justify-center gap-6 flex-wrap">
              <Button size="lg" className="gap-2 hover:scale-105 transition-all duration-300 animate-glow" asChild>
                <a href="mailto:shinosuke675@gmail.com">
                  <Mail className="w-5 h-5" />
                 shinosuke675@gmail.com
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                asChild
              >
                <a href="https://linkedin.com/in/shinosuke" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                asChild
              >
                <a href="https://github.com/Shinosuke24" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 sm:py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © 2025 Shinosuke Alexander.
          </p>
        </div>
      </footer>
    </div>
  )
}