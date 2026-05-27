"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Briefcase,
  Droplet,
  CreditCard,
  User as UserIcon,
  AtSign,
  Home,
  Building2,
  Truck,
} from "lucide-react";

function CopyChip({ text, theme, small = false }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(
    (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    },
    [text],
  );
  const size = small ? 22 : 26;
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        width: size,
        height: size,
        border: `1px solid ${copied ? theme.accent : theme.borderSoft}`,
        background: copied ? theme.accentSoft : "transparent",
        color: copied ? theme.accent : theme.textMuted,
      }}
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function Field({ icon: Icon, label, value, theme, accent }) {
  return (
    <div className="flex items-start gap-3 py-2 group/field">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
        style={{
          background: `${accent}15`,
          color: accent,
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.12em] mb-0.5 font-mono"
          style={{ color: theme.textMuted }}
        >
          {label}
        </div>
        <div
          className="text-[13px] break-words leading-snug"
          style={{ color: theme.text, fontFamily: "var(--font-display)" }}
        >
          {value}
        </div>
      </div>
      <div className="opacity-0 group-hover/field:opacity-100 transition-opacity">
        <CopyChip text={value} theme={theme} small />
      </div>
    </div>
  );
}

function AddressBlock({ address, theme, accent }) {
  const cityLine = `${address.city}, ${address.state} ${address.zipCode}`;
  return (
    <div className="group/addr">
      <div className="flex items-start gap-3 py-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${accent}15`, color: accent }}
        >
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[13px] leading-snug"
            style={{ color: theme.text, fontFamily: "var(--font-display)" }}
          >
            {address.streetAddress}
          </div>
          <div
            className="text-[12px] mt-0.5"
            style={{ color: theme.textMuted }}
          >
            {cityLine}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs">{address.flag}</span>
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: theme.textDim || theme.textMuted }}
            >
              {address.country}
            </span>
          </div>
        </div>
        <div className="opacity-0 group-hover/addr:opacity-100 transition-opacity">
          <CopyChip text={address.formatted} theme={theme} small />
        </div>
      </div>
    </div>
  );
}

export default function IdentityCard({
  identity,
  onRemove,
  theme,
  index,
  isDark,
}) {
  const [mounted, setMounted] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [addressTab, setAddressTab] = useState("home");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), Math.min(index * 50, 800));
    return () => clearTimeout(t);
  }, [index]);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(identity.id), 250);
  };

  const cardOpacity = removing ? 0 : mounted ? 1 : 0;
  const cardTransform = removing
    ? "scale(0.94) translateY(-8px)"
    : mounted
      ? "scale(1) translateY(0)"
      : "scale(0.96) translateY(20px)";

  const avatarGradient = `linear-gradient(135deg, ${identity.avatarColor[0]}, ${identity.avatarColor[1]})`;
  const genderColor = identity.gender === "male" ? theme.cyan : theme.pink;

  const ADDRESS_TABS = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      data: identity.homeAddress,
      accent: theme.accent,
    },
    {
      id: "work",
      label: "Work",
      icon: Building2,
      data: identity.workAddress,
      accent: theme.cyan,
    },
    {
      id: "ship",
      label: "Shipping",
      icon: Truck,
      data: identity.shippingAddress,
      accent: theme.pink,
    },
  ];
  const activeAddr = ADDRESS_TABS.find((t) => t.id === addressTab);
  const isInternational =
    identity.shippingAddress.countryCode !== identity.countryCode;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500 group hover:-translate-y-1"
      style={{
        background: theme.panel,
        border: `1px solid ${theme.border}`,
        opacity: cardOpacity,
        transform: cardTransform,
        boxShadow: isDark
          ? `0 1px 0 ${theme.borderSoft} inset, 0 8px 24px rgba(0,0,0,0.3)`
          : `0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 16px rgba(15,23,42,0.06)`,
      }}
    >
      <div className="h-1 w-full" style={{ background: avatarGradient }} />

      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-white relative overflow-hidden"
              style={{
                background: avatarGradient,
                fontFamily: "var(--font-display)",
              }}
            >
              <span className="relative z-10 text-[15px] tracking-wide">
                {identity.initials}
              </span>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%)",
                }}
              />
            </div>
            <div className="min-w-0">
              <div
                className="text-[15px] font-semibold tracking-tight leading-tight"
                style={{
                  color: theme.text,
                  fontFamily: "var(--font-display)",
                }}
              >
                {identity.fullName}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-sm">{identity.flag}</span>
                <span
                  className="text-[11px] truncate"
                  style={{ color: theme.textMuted }}
                >
                  {identity.country}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{
                    background: `${genderColor}15`,
                    color: genderColor,
                  }}
                >
                  {identity.gender === "male" ? "♂" : "♀"} {identity.age}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="w-7 h-7 rounded-md inline-flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            style={{
              border: `1px solid ${theme.borderSoft}`,
              color: theme.textMuted,
            }}
            title="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[11px] px-2 py-0.5 rounded-md font-mono inline-flex items-center gap-1"
            style={{
              background: theme.bgSecondary,
              color: theme.textMuted,
              border: `1px solid ${theme.borderSoft}`,
            }}
          >
            <AtSign className="w-2.5 h-2.5" />
            {identity.username}
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-md inline-flex items-center gap-1"
            style={{
              background: theme.bgSecondary,
              color: theme.text,
              border: `1px solid ${theme.borderSoft}`,
              fontFamily: "var(--font-display)",
            }}
          >
            <Briefcase
              className="w-2.5 h-2.5"
              style={{ color: theme.textMuted }}
            />
            {identity.occupation}
          </span>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${theme.borderSoft}` }} />

      {/* Address tabs */}
      <div className="px-5 pt-3">
        <div className="flex items-center gap-1 mb-1">
          {ADDRESS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = addressTab === tab.id;
            const isShipTab = tab.id === "ship";
            return (
              <button
                key={tab.id}
                onClick={() => setAddressTab(tab.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
                style={{
                  background: isActive ? `${tab.accent}15` : "transparent",
                  color: isActive ? tab.accent : theme.textMuted,
                  border: `1px solid ${isActive ? `${tab.accent}40` : "transparent"}`,
                }}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {isShipTab && isInternational && (
                  <span
                    className="text-[9px] px-1 rounded"
                    style={{
                      background: isActive ? tab.accent : theme.borderSoft,
                      color: isActive ? "#fff" : theme.textMuted,
                    }}
                  >
                    INTL
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <AddressBlock
          address={activeAddr.data}
          theme={theme}
          accent={activeAddr.accent}
        />
      </div>

      <div style={{ borderTop: `1px solid ${theme.borderSoft}` }} />

      {/* Other fields */}
      <div
        className="px-5 py-2 divide-y"
        style={{ borderColor: theme.borderSoft }}
      >
        <Field
          icon={Phone}
          label="Phone"
          value={identity.phone}
          theme={theme}
          accent={theme.pink}
        />
        <Field
          icon={Mail}
          label="Email"
          value={identity.email}
          theme={theme}
          accent={theme.purple}
        />
        <Field
          icon={Calendar}
          label="Birthday"
          value={identity.birthday}
          theme={theme}
          accent={theme.green}
        />
      </div>

      {/* Bottom meta strip */}
      <div
        className="px-5 py-3 flex items-center gap-3 flex-wrap"
        style={{
          borderTop: `1px solid ${theme.borderSoft}`,
          background: theme.bgSecondary,
        }}
      >
        <div className="flex items-center gap-1.5">
          <Droplet className="w-3 h-3" style={{ color: theme.pink }} />
          <span className="text-[11px] font-mono" style={{ color: theme.text }}>
            {identity.bloodType}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserIcon className="w-3 h-3" style={{ color: theme.textMuted }} />
          <span className="text-[11px] font-mono" style={{ color: theme.text }}>
            {identity.nationalId}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <CreditCard className="w-3 h-3" style={{ color: theme.textMuted }} />
          <span
            className="text-[10px] font-mono truncate"
            style={{ color: theme.textMuted }}
          >
            {identity.iban.slice(0, 8)}...{identity.iban.slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
}
