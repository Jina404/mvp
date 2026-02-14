
"use client";

import React, { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter signup logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#121826] via-[#0b0f1a] to-[#070b14] text-slate-300 px-4 pt-14 pb-8 sm:px-6 sm:pt-20 sm:pb-10 lg:px-8 2xl:px-12">
      <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(76,29,149,0.24),transparent_60%)] blur-2xl"></div>
      <div className="mx-auto w-full max-w-7xl relative 2xl:max-w-[1400px]">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <div className="relative">
              <div className="pointer-events-none absolute -left-10 -top-8 h-24 w-40 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.25),transparent_70%)] blur-xl"></div>
              <Link href="/" className="text-2xl font-semibold text-white">
                SkillLink Nexus<span className="text-[color:var(--primary-purple)]">.</span>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-300">
              Managed delivery for SMEs — vetted specialists, tracked milestones, secure payments.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <div>info@skilllinknexus.com</div>
              <div>+254 202 009 009</div>
              <div>Nairobi, Kenya</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Product</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <li><Link href="/dashboard" className="hover:text-white hover:underline hover:translate-x-0.5">Dashboard</Link></li>
              <li><Link href="/projects" className="hover:text-white hover:underline hover:translate-x-0.5">Projects</Link></li>
              <li><Link href="/request" className="hover:text-white hover:underline hover:translate-x-0.5">Request Service</Link></li>
              <li><Link href="/invoices" className="hover:text-white hover:underline hover:translate-x-0.5">Invoices</Link></li>
              <li><Link href="/demo" className="hover:text-white hover:underline hover:translate-x-0.5">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Company</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <li><Link href="/about" className="hover:text-white hover:underline hover:translate-x-0.5">About</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline hover:translate-x-0.5">Contact</Link></li>
              <li><Link href="/help" className="hover:text-white hover:underline hover:translate-x-0.5">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Resources</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <li><Link href="/security" className="hover:text-white hover:underline hover:translate-x-0.5">Security</Link></li>
              <li><Link href="/platform-demo" className="hover:text-white hover:underline hover:translate-x-0.5">Platform Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Legal</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              <li><Link href="/client-terms" className="hover:text-white hover:underline hover:translate-x-0.5">Client Terms</Link></li>
              <li><Link href="/freelancer-terms" className="hover:text-white hover:underline hover:translate-x-0.5">Freelancer Terms</Link></li>
              <li><Link href="/matching-policy" className="hover:text-white hover:underline hover:translate-x-0.5">Matching Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:underline hover:translate-x-0.5">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-400">© 2026 SkillLink Nexus Ltd. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-4">
              <a
                href="https://facebook.com/skilllinknexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(109,40,217,0.35)]"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://twitter.com/skilllinknexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(109,40,217,0.35)]"
                aria-label="Twitter"
                title="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/skilllinknexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(109,40,217,0.35)]"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href="https://instagram.com/skilllinknexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(109,40,217,0.35)]"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://github.com/skilllinknexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(109,40,217,0.35)]"
                aria-label="GitHub"
                title="GitHub"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

