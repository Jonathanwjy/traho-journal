import { animate, motion } from "framer-motion";
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
import { heroImages, features, benefits, howItWorks } from "./welcome_data";
import { Link } from "react-router-dom";

const navItems = [
  { key: "home", label: "Home", link: "#hero" },
  { key: "about", label: "About", link: "#about" },
  { key: "features", label: "Features", link: "#features" },
  { key: "benefits", label: "Benefits", link: "#benefits" },
  { key: "howItWorks", label: "How It Works", link: "#howItWorks" },
];

export default function Welcome() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  const fadeUp = {
    initial: { y: 40, opacity: 0 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
    viewport: { once: false },
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    viewport: { once: false },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    viewport: { once: false },
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/60 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-12">
          <div className="font-bold text-xl tracking-tight uppercase">
            Traho<span className="text-primary">Journal</span>
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
              <Link to="/login">Login</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      <main>
        <section
          id="hero"
          className="pt-24 min-h-screen flex flex-6 container mx-auto px-4 items-center"
        >
          <motion.div
            className="px-12 mr-6"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 100 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
          >
            <h1 className="text-8xl">Keep your trades organized and clear</h1>
            <p className="mt-12 text-xl">
              TradeLog Analytics Platform handles the complexity of trade
              logging. Append real-time analysis to your positions as markets
              shift and conditions change.
            </p>
            <Button className="mt-6 cursor-pointer">Learn More</Button>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 100 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
          >
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
          </motion.div>
        </section>

        <motion.section
          id="about"
          className="h-screen mt-12 pt-32 px-48"
          initial="initial"
          whileInView="whileInView"
          viewport="viewport"
          variants={fadeUp}
        >
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
        </motion.section>

        <motion.section
          id="features"
          className="relative h-screen mt-12 pt-24 px-48"
          initial="initial"
          whileInView="whileInView"
          viewport="viewport"
          variants={fadeUp}
        >
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
        </motion.section>

        <motion.section
          id="benefits"
          className="relative h-screen mt-12 pt-24 px-48"
          variants={fadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport="viewport"
        >
          <div className="mb-10">
            <h1 className="text-5xl text-center font-bold">Benefits</h1>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport="viewport"
          >
            {benefits.map((benefit) => (
              <motion.div key={benefit.id} variants={cardVariant}>
                <Card className="flex flex-col cursor-pointer items-center justify-center text-center p-6 md:p-10 h-full transition-all hover:shadow-xl border-muted-foreground/10 bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
                  <CardHeader className="p-0 flex flex-col items-center justify-center w-full">
                    <CardTitle className="text-3xl md:text-2xl font-bold tracking-tight leading-[1.1] mb-6 w-full px-2">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed w-full opacity-80">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="howItWorks"
          className="relative mt-12 pt-24 px-48"
          variants={fadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport="viewport"
        >
          <div className="text-center mb-0">
            <h1 className="text-5xl font-bold">How It Works</h1>
            <p className="text-xl">8 Simple steps for better trades</p>
          </div>

          <ScrollStack
            cards={howItWorks}
            sectionHeightMultiplier={8}
            animationDuration="0.8s"
          />
        </motion.section>

        <motion.footer
          id="footer"
          className="bg-background mt-24 py-20 px-48 border-t"
          initial={{ y: 500 }}
          transition={{ duration: 2, ease: "easeOut" }}
          whileInView={{ y: 0 }}
          viewport={{ once: false }}
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
        </motion.footer>
      </main>
    </>
  );
}
