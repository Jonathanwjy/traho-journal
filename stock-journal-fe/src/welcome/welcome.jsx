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
import ScrollStack from "@/components/lightswind/scroll-stack";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const benefits = [
  {
    id: 1,
    title: "Membuat Keputusan Berdasarkan Informasi yang Lengkap",
    description:
      "Analisa secara real-time dan grafik yang jelas menggambarkan kondisi saham kamu. Kamu melihat gambaran secara keselurhan sebelum beraksi",
  },
  {
    id: 2,
    title: "Tidak Pernah Ketinggalan atas Analisa Saham",
    description:
      "Setiap alasan entry, catatan, update diatur sedemikian rupa dan mudah ditemukan. Trading terdahulumu menjadi sebuah sumber pembelajaran",
  },
  {
    id: 3,
    title: "Stop Buka Tutup SpreadSheet",
    description:
      "Kalkulasi secara otomatis dan record yang terorganisir artinya lebih sedikit waktu untuk mengatur data dan lebih banyak waktu untuk memikirkan strategi trading.",
  },
];

const howItWorks = [
  {
    title: "Buat akun",
    subtitle: "Buat akun dengan email untuk memulai perjalanan trading mu",
    badge: "Step 1",
    gradient: "linear-gradient(135deg, #f87171, #991b1b)",
  },
  {
    title: "Tambahkan posisi",
    subtitle: "Tambah posisi sahammu dengan catatan analisa yang kamu punya",
    badge: "Step 2",
    gradient: "linear-gradient(135deg, #ef4444, #1e3a8a, #f59e0b)",
  },
  {
    title: "Buat analisa",
    subtitle:
      "Tambahkan analisa terbaru ke saham kamu dengan tanggal untuk mengikuti perkembangan makro maupun teknikal",
    badge: "Step 3",
    gradient: "linear-gradient(135deg, #10b981, #064e3b)",
  },
  {
    title: "Melihat analisa",
    subtitle:
      "Melihat analisamu pada suatu saham untuk membantu menentukan keputusan tradingmu",
    badge: "Step 4",
    gradient: "linear-gradient(135deg, #ef4444, #1e3a8a, #f59e0b)",
  },
  {
    title: "Jual saham",
    subtitle:
      "Jual saham secara keseluruhan atau sebagian dengan catatan analisa mu",
    badge: "Step 5",
    gradient: "linear-gradient(135deg, #10b981, #064e3b)",
  },
  {
    title: "History Trading",
    subtitle:
      "Lihat trading lama mu beserta dengan analisa yang ada sebagai pembelajaran",
    badge: "Step 6",
  },
  {
    title: "Grafik statistik",
    subtitle:
      "Tampilan grafik pertumbuhan balance dan statistik trading ditampilkan secara menarik untuk menganalisa performa trading",
    badge: "Step 7",
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

        <section id="features" className="relative h-screen mt-12 pt-24 px-48">
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

        <section id="benefits" className="relative h-screen mt-12 pt-24 px-48">
          <div className="mb-10">
            <h1 className="text-5xl text-center font-bold">Benefits</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((benefit) => (
              <Card
                key={benefit.id}
                className="flex flex-col cursor-pointer items-center justify-center text-center p-6 md:p-10 h-full transition-all hover:shadow-xl border-muted-foreground/10 bg-card/50 backdrop-blur-sm shadow-md overflow-hidden"
              >
                <CardHeader className="p-0 flex flex-col items-center justify-center w-full">
                  <CardTitle className="text-3xl md:text-2xl font-bold tracking-tight leading-[1.1] mb-6 w-full px-2">
                    {benefit.title}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed w-full opacity-80">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="howItWorks" className="relative mt-12 pt-24 px-48">
          <div className="text-center mb-0">
            <h1 className="text-5xl font-bold">How It Works</h1>
            <p className="text-xl">8 Simple steps for better trades</p>
          </div>

          <ScrollStack
            cards={howItWorks}
            sectionHeightMultiplier={8}
            animationDuration="0.8s"
          />
        </section>

        <footer
          id="footer"
          className="bg-background mt-24 py-20 px-48 border-t"
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
              <div className="max-w-md">
                <div className="font-bold text-2xl uppercase mb-6">
                  Traho Journal
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Kami hadir menciptakan solusi bagi anda! Masalah jurnaling
                  trading anda dapat kami selesaikan disini. Desain yang user
                  friendly dan interaktif membuat gampang dibaca.
                </p>
              </div>
              <div className="flex gap-20">
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold">Links</h4>
                  <a href="#home" className="text-sm hover:underline">
                    Home
                  </a>
                  <a href="#features" className="text-sm hover:underline">
                    Features
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold">Social</h4>
                  <a href="#" className="text-sm hover:underline">
                    Twitter
                  </a>
                  <a href="#" className="text-sm hover:underline">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2026 MyApp Analytics. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
