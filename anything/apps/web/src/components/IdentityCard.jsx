"use client";

import { motion } from "motion/react";
import { Copy, MapPin, Phone, Mail, Briefcase, Droplet } from "lucide-react";

export default function IdentityCard({ identity, index }) {
  const avatarGradient = `linear-gradient(135deg, ${identity.avatarColor[0]}, ${identity.avatarColor[1]})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="relative overflow-hidden rounded-2xl bg-[#1A1625]/80 backdrop-blur-xl border border-white/5 p-6 hover:border-orange-500/30 transition-colors group"
    >
      {/* Top Section */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
          style={{ background: avatarGradient }}
        >
          {identity.initials}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
            {identity.fullName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <span>
              {identity.flag} {identity.country}
            </span>
            <span>•</span>
            <span>
              {identity.gender === "male" ? "♂ Male" : "♀ Female"},{" "}
              {identity.age}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-200">
              {identity.homeAddress.streetAddress}
            </p>
            <p className="text-xs text-gray-500">
              {identity.homeAddress.city}, {identity.homeAddress.state}{" "}
              {identity.homeAddress.zipCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-orange-500" />
          <p className="text-sm text-gray-200 font-mono">{identity.phone}</p>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-orange-500" />
          <p className="text-sm text-gray-200">{identity.email}</p>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Occupation
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Briefcase className="w-3 h-3 text-orange-500/70" />
              <span className="truncate">{identity.occupation}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Blood Type
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Droplet className="w-3 h-3 text-red-500/70" />
              <span>{identity.bloodType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -inset-24 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
