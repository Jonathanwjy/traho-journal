"use client";
import React, { useEffect, useRef, useState } from "react";

const ScrollStack = ({
  cards = [],
  cardHeight = "60vh",
  animationDuration = "0.5s",
  sectionHeightMultiplier = 3,
  className = "",
}) => {
  const scrollableSectionRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);

  // --- Logic Scroll & Intersection (Sama seperti sebelumnya) ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const sectionHeight = sectionRef.current.offsetHeight;
          const scrollableDistance = sectionHeight - viewportHeight;

          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(
              Math.abs(sectionRect.top) / scrollableDistance,
              1,
            );
          }

          const newActiveIndex = Math.floor(progress * cards.length);
          setActiveCardIndex(Math.min(newActiveIndex, cards.length - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [cards.length]);

  const getCardTransform = (index) => {
    const isVisible = isIntersecting && activeCardIndex >= index;
    const scale = 0.9 + index * 0.02; // Membuat efek tumpukan di bawah
    const translateY = isVisible ? `${-index * 10}px` : "100px"; // Sesuaikan agar menumpuk rapi

    return {
      transform: `translateX(-50%) translateY(${translateY}) scale(${scale})`,
      opacity: isVisible ? 1 : 0,
      zIndex: 10 + index,
    };
  };

  return (
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${sectionHeightMultiplier * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <div
          className="relative w-full max-w-4xl mx-auto"
          style={{ height: cardHeight }}
        >
          {cards.map((card, index) => {
            const transformState = getCardTransform(index);

            return (
              <div
                key={index}
                className="absolute left-1/2 rounded-[32px] shadow-2xl transition-all p-12 flex flex-col justify-center overflow-hidden" // Ganti justify-end menjadi justify-center
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: card.bgColor || "#333",
                  backgroundImage: card.gradient || "none",
                  ...transformState,
                  transitionDuration: animationDuration,
                }}
              >
                {/* Konten Kartu */}
                <div className="relative z-10 text-white w-full">
                  {/* Badge diletakkan di kanan atas relatif terhadap kartu */}
                  {card.badge && (
                    <div className="absolute -top-24 right-0">
                      {" "}
                      {/* Menggunakan top negatif untuk menariknya ke atas menjauhi judul yang di tengah */}
                      <span className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-medium border border-white/10">
                        {card.badge}
                      </span>
                    </div>
                  )}

                  {/* Judul dan Subjudul sekarang otomatis berada di tengah karena justify-center pada parent */}
                  <div className="max-w-2xl">
                    <h3 className="text-5xl font-bold mb-6 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xl text-white/80 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollStack;
