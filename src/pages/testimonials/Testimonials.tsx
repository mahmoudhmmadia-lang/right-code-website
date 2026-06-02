import Container from "@/components/Container"
import LangHandler from "@/components/LangHandler"
import SectionTitle from "@/components/SectionTitle"
import { useSignals } from "@preact/signals-react/runtime"
import { useEffect, useRef, useState } from "react"

function Testimonials() {
  useSignals()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const testimonials = [
    {
      quoteKey: "testimonial1Quote",
      nameKey: "testimonial1Name",
      titleKey: "testimonial1Title",
      companyKey: "testimonial1Company",
      gradient: "from-main to-alt",
      delay: 0,
    },
    {
      quoteKey: "testimonial2Quote",
      nameKey: "testimonial2Name",
      titleKey: "testimonial2Title",
      companyKey: "testimonial2Company",
      gradient: "from-alt to-main",
      delay: 100,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    })
  }

  return (
    <Container className="relative overflow-hidden py-28">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 h-96 w-96 rounded-full bg-main/10 blur-3xl transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-alt/10 blur-3xl transition-all delay-300 duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#006b70_1px,transparent_1px),linear-gradient(0deg,#006b70_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] bg-[size:40px_40px]" />
        </div>
      </div>

      <div ref={sectionRef}>
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <SectionTitle
            title="testimonialsTitle"
            subtitle="testimonialsSubtitle"
            badge="testimonialsBadge"
          />
        </div>

        {/* Main testimonial showcase */}
        <div
          className="perspective-1000 relative mx-auto mt-20 max-w-5xl"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            setMousePosition({ x: 0, y: 0 })
          }}
        >
          {/* Floating decorative circles */}
          <div className="animate-float absolute -top-10 -left-10 h-40 w-40 rounded-full bg-main/5 blur-2xl" />
          <div className="animate-float-delayed absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-alt/5 blur-2xl" />

          {/* Animated stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="animate-twinkle absolute h-1 w-1 rounded-full bg-main/20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Animated card */}
          <div
            className="relative transition-all duration-500 ease-out"
            style={{
              transform: isHovering
                ? `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
            }}
          >
            <div
              className={`rounded-3xl border border-main/20 bg-white/90 p-10 shadow-2xl backdrop-blur-sm transition-all duration-500 md:p-14 ${
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              {/* Gradient orb that follows mouse */}
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x * 5 + 50}% ${mousePosition.y * 5 + 50}%, rgba(0,107,112,0.1) 0%, transparent 70%)`,
                  opacity: isHovering ? 1 : 0,
                }}
              />

              <div className="relative text-center">
                <div className="animate-bounce-gentle absolute -top-8 left-1/2 -translate-x-1/2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-12 w-12 text-main/20"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Animated quote text */}
                <div
                  className="transition-all duration-500"
                  style={{ transitionDelay: "200ms" }}
                >
                  <p
                    className="text-2xl leading-relaxed font-medium text-alt/80 md:text-3xl md:leading-relaxed"
                    style={{
                      animation: isVisible
                        ? "fadeInUp 0.6s ease-out forwards"
                        : "none",
                    }}
                  >
                    “
                    <LangHandler
                      content={testimonials[activeIndex].quoteKey as any}
                    />
                    ”
                  </p>
                </div>

                {/* Animated divider */}
                <div
                  className={`my-8 flex justify-center transition-all duration-700 ${
                    isVisible
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-main to-transparent" />
                </div>

                {/* Author info with slide animation */}
                <div
                  className="space-y-2 transition-all duration-500"
                  style={{ transitionDelay: "600ms" }}
                >
                  <h4 className="text-2xl font-bold text-alt">
                    <LangHandler
                      content={testimonials[activeIndex].nameKey as any}
                    />
                  </h4>
                  <p className="text-main">
                    <LangHandler
                      content={testimonials[activeIndex].titleKey as any}
                    />
                  </p>
                  <p className="text-sm tracking-wider text-alt/40 uppercase">
                    <LangHandler
                      content={testimonials[activeIndex].companyKey as any}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modern navigation */}
          <div className="mt-12 flex justify-center gap-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="group relative transition-all duration-300"
              >
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "w-12 bg-gradient-to-r from-main to-alt"
                      : "w-3 bg-main/30 group-hover:bg-main/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes bounceGentle {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounceGentle 3s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </Container>
  )
}

export default Testimonials
