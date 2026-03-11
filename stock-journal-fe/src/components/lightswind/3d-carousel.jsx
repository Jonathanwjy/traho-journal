"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const ThreeDCarousel = ({
  items = [],
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
  isMobileSwipe = true,
}) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering && items.length > 0) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndAction = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      id="ThreeDCarousel"
      className="bg-transparent min-w-full flex items-center justify-center py-10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div
          className="relative overflow-hidden h-[600px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndAction}
          ref={carouselRef}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ease-in-out ${getCardAnimationClass(index)}`}
              >
                <Card
                  className="overflow-hidden bg-background border shadow-lg flex flex-col"
                  style={{ height: `${cardHeight}px` }}
                >
                  <div
                    className="relative p-6 flex items-center justify-center h-80"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "contain",
                      backgroundPosition: "top",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium mb-2">
                      {item.brand}
                    </p>
                    <p className="text-muted-foreground text-sm flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-medium uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.link}
                        className="text-primary flex items-center hover:underline group"
                      >
                        <span className="text-sm font-semibold">
                          Learn more
                        </span>
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {!isMobile && (
            <div className="absolute inset-0 flex bg-transparent items-center justify-between px-4 z-30 pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 pointer-events-auto shadow-md"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 pointer-events-auto shadow-md"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  active === idx
                    ? "bg-primary w-5"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
                onClick={() => setActive(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
