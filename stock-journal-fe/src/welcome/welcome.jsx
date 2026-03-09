import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ThreeDCarousel from "@/components/lightswind/3d-carousel";
import FallBeamBackground from "@/components/lightswind/fall-beam-background";

const navItems = [
  { key: "home", label: "Home", link: "#home" },
  { key: "about", label: "About", link: "#about" },
  { key: "features", label: "Features", link: "#features" },
  { key: "benefits", label: "Benefits", link: "#benefits" },
  { key: "howItWorks", label: "How It Works", link: "#howItWorks" },
];

const heroImages = [
  {
    id: 1,
    url: "/images/hero_images/hero-1.png",
  },
  {
    id: 2,
    url: "/images/hero_images/hero-2.png",
  },
  {
    id: 3,
    url: "/images/hero_images/hero-3.png",
  },
];

const features = [
  {
    id: 1,
    title: "Portofolio monitoring",
    brand: "Realtime Portofolio Monitoring",
    description:
      "Lihat saham apa saja yang sedang kamu pengang dan informasi terkait seperti average harga, ",
    imageUrl: "/images//features/porto.png",
    link: "/projects/firecat",
  },
  {
    id: 2,
    title: "Stock Manage",
    brand: "Manage Your Stock Easily",
    description:
      "Add a new position easily with value calculation or edit the stocks data and close stock position",
    imageUrl: "/images/features/add.png",
    link: "/projects/firecat",
  },
  {
    id: 3,
    title: "Notes for adaption",
    brand: "Add notes to your stock",
    description:
      "Tambahkan catatan analisa terbaru dengan tanggal untuk memudahkan pembacaan analisa mengikuti perkembangan makro ekonomi yang terus berubah dan teknikal",
    imageUrl: "/images/features/adapt.png",
    link: "/projects/firecat",
  },
  {
    id: 4,
    title: "Chart Visualitazion",
    brand: "Track your trading performance",
    description:
      "Tampilan grafik yang memudahkan anda memantau progress trading anda",
    imageUrl: "/images/features/visual.png",
    link: "/projects/firecat",
  },
  {
    id: 5,
    title: "Trade History",
    brand: "Look up to past",
    description:
      "Lihat trade terdahulu anda dengan data yang ada serta catatannya untuk mengevaluasi trading plan anda",
    imageUrl: "/images/features/review.png",
    link: "/projects/firecat",
  },
];

export default function Welcome() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );
  return (
    <>
      <nav className="fixed top-0 w-full bg-background/60 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-12">
          <div className="font-bold text-xl tracking-tight uppercase">
            My<span className="text-primary">App</span>
          </div>

          {/* Navigation Items */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Button variant="ghost" asChild>
                  <a
                    href={item.link}
                    className="text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm">Get Started</Button>
            </motion.div>
          </div>
        </div>
      </nav>

      <main>
        <section
          id="hero"
          className="pt-24 min-h-screen flex flex-6 container mx-auto px-4 items-center"
        >
          <div className="">
            <h1 className="text-8xl">Keep your trades organized and clear</h1>
            <p className="mt-12 text-xl">
              TradeLog Analytics Platform handles the complexity of trade
              logging. Append real-time analysis to your positions as markets
              shift and conditions change.
            </p>
            <Button className="mt-6 cursor-pointer">Learn More</Button>
          </div>
          <div>
            <Carousel
              plugins={[plugin.current]}
              className="w-full h-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent className="ml-0 h-[600px]">
                {heroImages.map((item) => (
                  <CarouselItem key={item.id} className="pl-0 h-full relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-fit"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        <section id="about" className="h-screen mt-12 pt-32 px-48">
          <h1 className="text-5xl text-center font-bold mb-12">About Us</h1>
          <div className="flex px-12 gap-12 justify-evenly items-center">
            <img src="/images/logo.png" className="rounded-2xl"></img>
            <p className="text-justify text-lg">
              Kami hadir menciptakan solusi bagi anda! Masalah jurnaling trading
              anda dapat kami selesaikan disini. Desain yang user friendly dan
              interaktif membuat gampang dibaca dan diemengerti oleh banyak
              orang bahkan oleh pemula. maka dari itu kami kami cuma ingin
              memberi tahu bahwa tempat kami adalah yang terbaik.
            </p>
          </div>
        </section>

        <section id="features" className="relative h-screen mt-12 pt-32 px-48">
          <FallBeamBackground lineCount={25} beamColorClass="primary" />
          <h1 className="text-5xl text-center font-bold">Features</h1>
          <div className="flex px-12 justify-evenly items-center">
            <ThreeDCarousel
              items={features}
              autoRotate={true}
              rotateInterval={4000}
              cardHeight={500}
            />
          </div>
        </section>
      </main>
    </>
  );
}
