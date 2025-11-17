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
  Music, 
  Volume2, 
  VolumeX, 
} from "lucide-react"

export default function CVPage() {
  // === STATE DAN REF BARU UNTUK KONTROL AUDIO ===
  const [isMuted, setIsMuted] = useState(true) // Mulai selalu dalam keadaan mute
  const [isPlaying, setIsPlaying] = useState(false) // Mulai dalam keadaan pause secara fungsional
  const playerRef = useRef<HTMLIFrameElement>(null)
  // ===============================================

  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  // ID VIDEO YOUTUBE SUDAH DIPERBARUI: Tenxi, Jemsii - Bintang 5 (Lirik)
  const YOUTUBE_VIDEO_ID = "Sx5wp4J_oVc"; 

  // === FUNGSI KONTROL AUDIO BARU ===
  const toggleMute = () => {
    // Tombol ini berfungsi ganda: Play/Pause/Mute/Unmute
    
    // 1. Jika belum pernah dimainkan, paksa putar
    if (!isPlaying) {
      // Tombol pertama kali ditekan, putar musik
      togglePlayPause();
      // Kemudian, lanjutkan dengan toggle mute
      setIsMuted((prev) => {
        const newMutedState = !prev
        if (playerRef.current) {
          playerRef.current.contentWindow?.postMessage(
            `{"event":"command","func":"setVolume","args":[${newMutedState ? 0 : 100}]}`,
            "*",
          )
        }
        return newMutedState
      })
      return; // Stop di sini setelah memicu play dan mute
    }

    // 2. Jika sudah dimainkan, hanya toggle mute
    setIsMuted((prev) => {
      const newMutedState = !prev
      if (playerRef.current) {
        // Mengirim perintah 'mute' atau 'unmute' ke iframe YouTube
        playerRef.current.contentWindow?.postMessage(
          `{"event":"command","func":"setVolume","args":[${newMutedState ? 0 : 100}]}`,
          "*",
        )
      }
      return newMutedState
    })
  }

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
        const newPlayingState = !prev;
        if (playerRef.current) {
            // Mengirim perintah 'playVideo' atau 'pauseVideo'
            const command = newPlayingState ? "playVideo" : "pauseVideo";
            playerRef.current.contentWindow?.postMessage(
                `{"event":"command","func":"${command}","args":[]}`,
                "*",
            );
        }
        return newPlayingState;
    });
  };
  // ===================================

  useEffect(() => {
    setIsVisible(true)

    // Logika Observer (Tetap Sama)
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

    // === Listener Pesan YouTube untuk Mengaktifkan Kontrol ===
    const onYouTubeIframeAPIReady = () => {
        if (playerRef.current) {
             playerRef.current.contentWindow?.postMessage(
                `{"event":"command","func":"setVolume","args":[0]}`, // Set volume 0 saat player siap
                "*",
            )
        }
    };

    window.addEventListener("message", (event) => {
        if (event.origin === "https://www.youtube.com") {
             // YouTube Player API mengirim string JSON saat event 'onReady'
             try {
                const data = JSON.parse(event.data);
                if (data.event === 'onReady') {
                    onYouTubeIframeAPIReady();
                }
             } catch (e) {
                 // Handle non-JSON messages if necessary, though unlikely for API
             }
        }
    });
    // =========================================================

    return () => {
      observerRef.current?.disconnect()
      // window.removeEventListener("message", ...); // Cleanup
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  const skills = [
    { name: "React", level: 95, icon: <Code className="w-5 h-5" />, color: "from-blue-600 to-blue-800" },
    { name: "Node.js", level: 90, icon: <Server className="w-5 h-5" />, color: "from-blue-700 to-indigo-700" },
    { name: "TypeScript", level: 88, icon: <Code className="w-5 h-5" />, color: "from-indigo-600 to-blue-700" },
    { name: "PostgreSQL", level: 85, icon: <Database className="w-5 h-5" />, color: "from-blue-800 to-indigo-800" },
    { name: "Next.js", level: 92, icon: <Code className="w-5 h-5" />, color: "from-slate-700 to-blue-900" },
    { name: "MongoDB", level: 80, icon: <Database className="w-5 h-5" />, color: "from-blue-600 to-indigo-600" },
    { name: "React Native", level: 75, icon: <Smartphone className="w-5 h-5" />, color: "from-blue-500 to-indigo-600" },
    { name: "Express.js", level: 87, icon: <Server className="w-5 h-5" />, color: "from-blue-700 to-indigo-700" },
  ]

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution dengan React, Node.js, dan PostgreSQL",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
      link: "https://github.com/shinosuke/ecommerce-platform",
    },
    {
      title: "Task Management App",
      description: "Aplikasi manajemen tugas real-time dengan fitur kolaborasi",
      tech: ["Next.js", "Socket.io", "MongoDB", "Tailwind"],
      link: "https://github.com/shinosuke/task-management-app",
    },
    {
      title: "API Gateway Service",
      description: "Microservices API gateway dengan rate limiting dan authentication",
      tech: ["Node.js", "Redis", "Docker", "JWT"],
      link: "https://github.com/shinosuke/api-gateway-service",
    },
    {
      title: "Mobile Banking App",
      description: "Aplikasi mobile banking dengan fitur keamanan tinggi",
      tech: ["React Native", "Firebase", "Biometric", "Redux"],
      link: "https://github.com/shinosuke/mobile-banking-app",
    },
  ]

  const experiences = [
      {
      title: "CEO & Founder",
      company: "JK.Shinske",
      period: "Apr 2020",
      description:
        "Since 2020, I have independently built and led a Mobile Legends jockey service, starting from a small operation and growing it into a service trusted by many players. I am responsible for operational management, jockey team management, marketing strategy development, and ensuring consistent service quality and customer safety. This experience has shaped my skills in business management, client management, strategic decision-making, and a deep understanding of the esports ecosystem and player behavior.",
    },
    {
      title: "Staff of Porsenigama UGM 2025",
      company: "IT Division",
      period: "Aug 2025",
      description:
        "Worked as IT division staff for Porsenigama UGM 2025, managing technical operations and digital systems.",
    },
    {
      title: "Sub Dealer",
      company: "PT. Samsung Electronics Indonesia",
      period: "Jul 2025",
      description:
        "At that time, I had the experience of being invited to a VIP gathering at a Singapore restaurant for the launch of the Samsung Galaxy Z Fold 7 | Z Flip 7.",
    },
    {
      title: "Staff of Paskah UGM 2025",
      company: "HumpubIT Division",
      period: "May 2025",
      description:
        "Served as staff member in the IT division for Paskah UGM 2025, handling technical aspects and digital infrastructure.",
    },
    {
      title: "Sub Dealer",
      company: "PT. Candii Jitu Indonesia",
      period: "May 2025",
      description:
        "I received an invitation to attend the Toshiba gathering event held at the Ballroom of Swissbell Hotel Solo.",
    },
    {
      title: "Sub Dealer",
      company: "PT. Haier Sales Indonesia",
      period: "Jan 2024 - Jul 2025",
      description: "I attended several series of gathering events with VIP invitations.",
    },
    {
      title: "Member of Komatik UGM 2024",
      company: "Software Research Development Division",
      period: "Nov 2024",
      description:
        "Active member in the Software Research Development Division of Komatik UGM, focusing on software innovation and research projects.",
    },
    {
      title: "Staff of NEX x SRE UGM Policy Case Competition",
      company: "Multimedia & Documentation",
      period: "14 Aug 2024",
      description:
        "Participated as staff member in the NEX x SRE UGM Policy Case Competition, contributing to event organization and management.",
    },
  ]

  const portfolioItems = [
    {
      title: "University Portal System",
      description: "Sistem portal mahasiswa dengan fitur akademik lengkap",
      image: "/university-portal-dashboard.png",
      tech: ["React", "Express", "MySQL"],
      link: "https://github.com/shinosuke/university-portal",
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

  return (
    // PENTING: Tambahkan class 'custom-cursor-wrapper' di div terluar
    <div className="min-h-screen bg-background transition-colors duration-500 custom-cursor-wrapper">
      
      {/* 1. EFEK VISUAL: CURSOR FOLLOWER KEREN (PLASMA BLOB) */}
      <CursorFollower />
      
      {/* 2. MUSIK LATAR TERSEMBUNYI (YOUTUBE EMBED) */}
      {YOUTUBE_VIDEO_ID && ( // Hanya render jika ID Video tersedia
        <div className="fixed bottom-0 right-0 z-[0] w-[1px] h-[1px] opacity-0 overflow-hidden pointer-events-none">
            <iframe 
               ref={playerRef} // Tambahkan ref di sini
               // Tambahkan enablejsapi=1 agar bisa dikontrol via postMessage
               src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`} 
               title="YouTube background music player" 
               width="1" // Ukuran sangat kecil
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
      {/* Tombol Theme Toggle tetap di kanan atas */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Tombol Kontrol Musik Dipindah ke Kiri Navigasi, agar sejajar logo/awal header */}
      <div className="fixed top-4 left-20 z-50"> 
         <Button 
            variant="ghost" // Mengubahnya menjadi 'ghost' agar terlihat lebih menyatu dengan background
            size="icon" 
            onClick={toggleMute}
            className="hover:scale-110 transition-transform duration-200"
            title={isMuted ? "Unmute Music" : "Mute Music"}
        >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-primary" />}
        </Button>
      </div>

      <Navigation activeSection={activeSection} onSectionClick={scrollToSection} />

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
                <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                  I am a student of UGM  majoring in Software Engineering, with a great interest in
                  programming and technology. I am actively learning through various online sources such as YouTube, and
                  am currently looking for practical experience to prepare myself for the industrial world.
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
                  onClick={() => scrollToSection("projects")}
                >
                  <Code className="w-4 h-4" />
                  View Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section id="skills" className="py-16 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Technical Skills</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Technologies I work with</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group ${
                  visibleElements.has("skills-grid") ? "animate-fly-in-up" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                data-animate="skills-grid"
                id={index === 0 ? "skills-grid" : undefined}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 bg-gradient-to-br ${skill.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-200 animate-auto-float`}
                      style={{ animationDelay: `${index * 0.3}s` }}
                    >
                      {skill.icon}
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors duration-200 text-sm sm:text-base">
                      {skill.name}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Proficiency</span>
                      <span className="font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out animate-shimmer`}
                        style={{ width: isVisible ? `${skill.level}%` : "0%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Work & Committee Experience</h2>
            <p className="text-muted-foreground text-lg">My professional journey</p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card
                key={`${exp.title}-${index}`}
                className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  visibleElements.has(`experience-${index}`) ? "animate-fly-in-up" : "translate-x-[-50px] opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`experience-${index}`}
                id={`experience-${index}`}
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

      <section id="projects" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground text-lg">Some of my recent work</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  visibleElements.has(`project-${index}`) ? "animate-fly-in-up" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                data-animate={`project-${index}`}
                id={`project-${index}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                  <CardDescription className="text-pretty">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs hover:scale-105 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            © 2025 Shinosuke Alexander. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}