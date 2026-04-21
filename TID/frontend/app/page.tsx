"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Fingerprint,
  Lock,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Decentralized Identity",
    desc: "Your DID lives on-chain. You own it — no authority can revoke your identity.",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Proofs",
    desc: "Prove you're over 18 without revealing your birthday. Math, not trust.",
  },
  {
    icon: Shield,
    title: "Verifiable Credentials",
    desc: "Government, university, or employer — all credentials in one sovereign wallet.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen grid-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-brand-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-brand-400" />
          </div>
          <span className="font-semibold tracking-tight text-slate-100">
            TrustID
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/verify"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Verify
          </Link>
          <Link
            href="/onboarding"
            className="text-sm px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Powered by Zero-Knowledge Proofs & Noir
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-50 mb-8 leading-tight">
              Prove who you are.
              <br />
              <span className="text-brand-400">Share nothing more.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              TrustID is a sovereign identity wallet. Store credentials,
              generate ZK proofs, and verify your identity without exposing
              personal data.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/20"
              >
                Create Identity <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-brand-500/50 text-slate-300 font-medium transition-colors"
              >
                Verify a Proof
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-2xl h-[600px]"
          >
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-4cK5Ymg4P6kCdJWOAiszR9FU/"
              frameBorder="0"
              className="w-full h-full rounded-2xl shadow-2xl shadow-brand-500/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 pb-32 border-t border-brand-500/5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="glow-card rounded-2xl p-8 bg-surface-900 text-left transition-transform hover:scale-[1.02]"
            >
              <f.icon className="w-8 h-8 text-brand-400 mb-6" />
              <h3 className="text-xl font-bold text-slate-200 mb-3">
                {f.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
