"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ScanLine, Link2 } from "lucide-react";
import { useZKVerifier } from "@/hooks/useZKVerifier";

type VerifyState = "idle" | "loading" | "valid" | "invalid";

export default function VerifyPage() {
  const [proofInput, setProofInput]   = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [result, setResult]           = useState<Record<string, string> | null>(null);
  const { verifyProof }               = useZKVerifier();

  async function handleVerify() {
    if (!proofInput.trim()) return;
    setVerifyState("loading");
    try {
      const res = await verifyProof(proofInput.trim());
      setResult(res);
      setVerifyState(res.valid ? "valid" : "invalid");
    } catch {
      setVerifyState("invalid");
    }
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-4">
            <ScanLine className="w-7 h-7 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50">Verify a Proof</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Paste a proof link or nullifier to verify on-chain — no personal data exchanged.
          </p>
        </div>

        <div className="glow-card rounded-2xl bg-surface-900 p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
              Proof Link or Nullifier Hash
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value)}
                placeholder="trustid://proof/0x... or paste nullifier"
                className="flex-1 bg-surface-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 font-mono"
              />
              <button
                onClick={handleVerify}
                disabled={!proofInput || verifyState === "loading"}
                className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                {verifyState === "loading"
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Link2 className="w-4 h-4" />
                }
                Verify
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex-1 h-px bg-slate-800" />
            or scan QR
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* QR scanner placeholder */}
          <div className="h-48 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-600 hover:border-brand-500/30 transition-colors cursor-pointer">
            <ScanLine className="w-8 h-8" />
            <span className="text-xs">Click to open camera scanner</span>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {verifyState !== "idle" && verifyState !== "loading" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 rounded-xl border p-5 ${
                verifyState === "valid"
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {verifyState === "valid"
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />
                }
                <span className={`font-semibold text-sm ${verifyState === "valid" ? "text-green-300" : "text-red-300"}`}>
                  {verifyState === "valid" ? "Proof Valid ✓" : "Proof Invalid ✗"}
                </span>
              </div>
              {result && (
                <div className="space-y-1.5 text-xs font-mono text-slate-400">
                  {Object.entries(result).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-slate-600">{k}:</span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
