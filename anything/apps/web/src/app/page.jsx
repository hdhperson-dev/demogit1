"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  User,
  Calendar,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#EA580C] selection:text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-black tracking-tighter flex items-center gap-2"
        >
          <span className="text-white">HD</span>
          <span className="text-[#EA580C]">H.</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <a
            href="/generator"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
          >
            Sản phẩm nổi bật
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-24 pt-20">
        {/* Background Gradient & Image */}
        <motion.div
          className="absolute inset-0 z-0 opacity-40"
          style={{ y: y1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop"
            alt="Abstract dark tech"
            className="w-full h-full object-cover mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          {/* Orange Glow */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#EA580C]/20 rounded-full blur-[120px]" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA580C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA580C]"></span>
            </span>
            <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">
              System Online
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-6"
          >
            HỒ DIÊN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F59E0B]">
              HÀ
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-3xl text-gray-400 font-light max-w-3xl mb-12 leading-relaxed"
          >
            Admin chủ lực quản lý page. Định hình trải nghiệm số, tối ưu hóa hệ
            thống và quản trị dữ liệu chuyên nghiệp.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-6 py-4 rounded-xl border border-white/10">
              <Calendar className="text-[#EA580C] w-6 h-6" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Ngày sinh
                </p>
                <p className="text-lg font-medium">09.09.2009</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-6 py-4 rounded-xl border border-white/10">
              <Shield className="text-[#EA580C] w-6 h-6" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Vai trò
                </p>
                <p className="text-lg font-medium">Admin Quản Lý</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest font-medium">
            Cuộn xuống
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-[#EA580C]" />
          </motion.div>
        </motion.div>
      </section>

      {/* About & Features Section */}
      <section className="relative py-32 px-8 md:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              alt="Cyber security concept"
              className="rounded-3xl shadow-[0_0_60px_-15px_rgba(234,88,12,0.3)] border border-white/10 object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Sáng tạo & <span className="text-[#EA580C]">Tối ưu hóa</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Với vai trò là admin chủ lực, tôi tập trung vào việc xây dựng hệ
              thống quản lý mạnh mẽ, đảm bảo tính ổn định và cung cấp các công
              cụ tiện ích vượt trội cho người dùng.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Tư duy logic, giải quyết vấn đề nhanh gọn và tập trung vào trải
              nghiệm UI/UX là những tiêu chí hàng đầu trong định hướng công
              việc.
            </p>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Zap className="text-[#EA580C]" /> Trải nghiệm tính năng
              </h3>

              <div className="bg-[#111] p-8 rounded-2xl border border-white/5 hover:border-[#EA580C]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EA580C]/10 rounded-full blur-[50px] group-hover:bg-[#EA580C]/20 transition-colors" />

                <h4 className="text-xl font-bold mb-2">
                  Fake Identity Generator
                </h4>
                <p className="text-gray-400 mb-8 max-w-sm relative z-10">
                  Hệ thống tạo lập dữ liệu giả lập chuẩn xác, phục vụ quá trình
                  testing và trải nghiệm giao diện người dùng.
                </p>

                <a
                  href="/generator"
                  className="relative z-10 inline-flex items-center gap-2 bg-[#EA580C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#C2410C] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                >
                  Sang trang tiếp theo <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Hồ Diên Hà. All rights reserved.</p>
      </footer>
    </div>
  );
}
