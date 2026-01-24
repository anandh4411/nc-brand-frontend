import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlescomingsoon"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Gradient Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-40 pointer-events-none">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        <div className="absolute inset-0 w-full h-full bg-[#030303] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo - Hero Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative inline-block mb-8 mt-16 md:mt-20"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-20 blur-2xl animate-pulse" />
            <div className="absolute inset-0 -m-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 opacity-30 blur-xl" />

            {/* Logo container */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">
              <div className="w-full h-full rounded-full bg-[#030303] p-1">
                <img
                  src="/logo.jpg"
                  alt="NC Brand Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Brand Name - Main Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 tracking-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent",
                  "bg-gradient-to-r from-indigo-300 via-white to-rose-300",
                  "drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                )}
              >
                NC Brand Products
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-white/70 font-light tracking-[0.2em] uppercase mb-8"
            >
              Pvt Ltd
            </motion.p>
          </motion.div>

          {/* Coming Soon Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 border border-white/10 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm sm:text-base text-white/80 font-medium tracking-wide">
              Coming Soon
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-10 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Premium quality products, exceptional designs, and an experience you'll love.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <Button
              onClick={() => router.navigate({ to: "/shop/products" })}
              className={cn(
                "group relative overflow-hidden",
                "bg-white hover:bg-white/90",
                "text-black font-semibold",
                "px-8 py-2.5 h-auto text-base",
                "rounded-full",
                "transition-all duration-300",
                "shadow-lg shadow-white/20",
                "hover:shadow-xl hover:shadow-white/30",
                "hover:scale-105"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Shop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
          >
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm">Custom Designs</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm">Fast Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
