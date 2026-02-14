"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiClipboard, FiUsers } from "react-icons/fi";
import { ArrowRight, Bot, BarChart3, Globe, HelpCircle, Megaphone, Menu, Palette, Smartphone, Sparkles, Wrench, X } from "lucide-react";
import ForceLightMode from "@/components/ForceLightMode";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "../logo.png";
import mobileApp from "../mobile-app.png";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const services = [
    {
      title: "Web Development",
      description: "Websites, portals, dashboards, and web apps.",
      tag: "Most requested",
      icon: Globe
    },
    {
      title: "Mobile Apps",
      description: "Android, iOS, and cross-platform builds.",
      tag: "Popular",
      icon: Smartphone
    },
    {
      title: "UI/UX Design",
      description: "Modern UI, prototypes, and user research.",
      tag: "Popular",
      icon: Palette
    },
    {
      title: "Branding & Identity",
      description: "Logos, brand guides, and visual identity.",
      tag: "New",
      icon: Sparkles
    },
    {
      title: "Digital Marketing",
      description: "SEO, social content, and paid campaigns.",
      tag: "Popular",
      icon: Megaphone
    },
    {
      title: "Data & Analytics",
      description: "Dashboards, reporting, and business insights.",
      tag: "Popular",
      icon: BarChart3
    },
    {
      title: "AI Chatbots & Automation",
      description: "Support bots, workflows, and integrations.",
      tag: "New",
      icon: Bot
    },
    {
      title: "Maintenance & Support",
      description: "Updates, fixes, and continuous improvements.",
      tag: "Essential",
      icon: Wrench
    }
  ];

  return (
    <div className="landing-shell min-h-screen bg-white dark:bg-[#181A20]">
      <ForceLightMode />
      <header className="landing-header landing-fade relative z-20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
          <div className="flex items-center gap-2.5">
            <Image src={logo} alt="SkillLink Nexus logo" width={32} height={32} className="sm:h-9 sm:w-9" priority />
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">SkillLink Nexus</div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-400 md:flex">
            <a href="#how" className="transition hover:text-slate-900 dark:hover:text-slate-200">How it works</a>
            <a href="#product" className="transition hover:text-slate-900 dark:hover:text-slate-200">Product</a>
            <a href="#services" className="transition hover:text-slate-900 dark:hover:text-slate-200">Services</a>
            <a href="#samples" className="transition hover:text-slate-900 dark:hover:text-slate-200">Samples</a>
          </nav>
          <div className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-400 md:flex">
            <Link className="transition hover:text-slate-900 dark:hover:text-slate-200" href="/login">
              Sign in
            </Link>
            <Link className="inline-flex items-center rounded-full bg-purple-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800" href="/request">
              Get started
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">How it works</a>
              <a href="#product" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">Product</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">Services</a>
              <a href="#samples" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">Samples</a>
            </nav>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Sign in
              </Link>
              <Link href="/request" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg bg-purple-700 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-purple-800">
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>
      <section className="landing-hero w-full min-h-[calc(100vh-90px)] py-12 lg:py-16 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
          <div className="relative z-10 grid gap-10 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="landing-fade inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-800 dark:text-purple-300">
                Built for modern delivery teams
              </div>
              <h1 className="landing-fade mt-6 text-[clamp(2.25rem,3.2vw,3.9rem)] font-semibold text-slate-900 dark:text-slate-100">
                <strong>Stop hiring full-time for work that should be project-based.</strong>
              </h1>
              <p className="landing-fade mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg lg:text-xl">
                SkillLink Nexus assigns your project to vetted specialists and manages delivery milestones and quality,
                so you don’t spend your time supervising freelancers.
              </p>
              <div className="landing-fade mt-8 flex flex-wrap items-center gap-4">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800"
                  href="/request"
                >
                  Get started
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="landing-float-slow flex items-center justify-center">
              <Image
                src={mobileApp}
                alt="SkillLink Nexus mobile app preview"
                className="h-auto w-full max-w-[600px] drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <FloatingChatbot />

      <section id="how" className="landing-fade landing-band landing-band--tinted mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center mt-6">
          <h1 className="text-2xl font-semibold text-purple-600 sm:text-3xl md:text-4xl lg:text-5xl">
            How it works
          </h1>
        </div>

        <div className="landing-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Project Scoping",
              body: "Chat with our AI to brainstorm your idea and draft a clear project brief. Once you’re done, it summarizes everything and routes your request to the right specialist automatically.",
              image: "/project.png",
              icon: <FiClipboard />
            },
            {
              title: "Specialist Matching",
              body: "Every request is matched to the best specialist based on skills, proven delivery performance, and availability,  you get reliable execution without hiring or managing freelancers.",
              image: "/matching2.png",
              icon: <FiUsers />
            },
            {
              title: "Delivery Management",
              body: "Milestones are reviewed, feedback is logged, and payments are tracked end-to-end.",
              image: "/management.png",
              icon: <FiCheckCircle />
            }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] p-6 shadow-lg shadow-slate-200/40 dark:shadow-none">
              <div className="relative mb-6 flex h-60 items-center justify-center">
                <img
                  src={item.image}
                  alt={`${item.title} preview`}
                  className="relative h-60 w-auto object-contain drop-shadow"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--primary-purple)] to-[color:var(--purple-light)] text-white">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="payments" className="landing-fade mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center mt-6">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-slate-900 dark:text-slate-100">Payments that </span>
            <span className="bg-gradient-to-r from-[color:var(--primary-purple)] to-[color:var(--purple-light)] bg-clip-text text-transparent">protect both sides</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            SkillLink Nexus uses an escrow-style workflow so your money is protected while the specialist stays motivated to deliver quality work.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm">
            <span>Secure Funding</span>
            <span className="text-purple-400">•</span>
            <span>Milestone Tracking</span>
            <span className="text-purple-400">•</span>
            <span>Instant Release</span>
          </div>
        </div>

        {/* ── Horizontal timeline stepper ── */}
        <div className="landing-stagger relative mt-14">
          {/* connector line */}
          <div className="absolute left-[calc(16.66%-4px)] right-[calc(16.66%-4px)] top-[18px] hidden h-[3px] rounded-full bg-slate-200 dark:bg-slate-700 lg:block" />

          <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Fund Securely",
                body: "Your payment is placed in a secure hold inside SkillLink Nexus — not sent directly to the specialist. No paying upfront with risk.",
              },
              {
                step: "2",
                title: "Track Progress",
                body: "The specialist begins immediately and you track progress through milestones. Each milestone is submitted for your review.",
              },
              {
                step: "3",
                title: "Approve & Release",
                body: "Once you approve the milestone or final delivery, funds are disbursed to the specialist automatically. Fast, fair, and transparent.",
              },
            ].map((item, i) => (
              <div key={item.title} className="relative flex flex-col items-center text-center">
                {/* step circle */}
                <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                  i === 0
                    ? "bg-purple-700"
                    : i === 1
                    ? "bg-purple-600"
                    : "bg-purple-500"
                }`}>
                  {item.step}
                </div>

                <h3 className="mt-5 text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="landing-fade landing-band landing-band--tinted mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-purple-600">Product preview</div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">A workspace built for delivery teams.</h2>
          </div>
          <Link className="btn btn-secondary" href="/request">
            Book a walkthrough
          </Link>
        </div>
        <div className="landing-stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: "Client HQ", 
              body: "Track milestones, files, feedback, and approvals in one place.",
              image: "/client_hq.png",
              alt: "Client HQ dashboard showing milestones and project tracking"
            },
            { 
              title: "Assigned Specialist", 
              body: "Chat with your vetted specialist and follow progress updates privately.",
              image: "/assigned_specialist.png",
              alt: "Assigned Specialist chat interface with progress updates"
            },
            { 
              title: "Invoices", 
              body: "View invoices, download PDFs, and track payments across projects.",
              image: "/invoices.png",
              alt: "Invoices dashboard with payment tracking"
            }
          ].map((item) => (
            <div key={item.title} className="group rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image 
                  src={item.image} 
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority={false}
                />
              </div>
              <div className="p-6">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="landing-fade mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">SERVICES</div>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Request any digital service — delivered end-to-end
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              Choose what you need. We assign a vetted specialist, track milestones, and manage delivery until approval.
            </p>
          </div>
        </div>

        <div className="landing-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group h-full rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/10 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-purple-500/40"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Icon className="h-[22px] w-[22px] text-purple-700 dark:text-purple-300" strokeWidth={2} aria-hidden="true" />
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {service.tag}
                    </span>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {service.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-purple-300">
                    Request this service
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/idea-chatbot"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          >
            <span className="text-slate-500 dark:text-slate-400">Not sure what you need?</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">Request a service</span>
          </Link>
        </div>
      </section>

      <section id="samples" className="landing-fade landing-band landing-band--tinted mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600 text-center">SAMPLES</div>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center sm:text-3xl">
          Sample deliveries through SkillLink Nexus
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg text-center">
          A few example websites scoped, assigned, and delivered through tracked milestones.
        </p>

        <div className="landing-stagger mx-auto mt-10 max-w-5xl grid gap-6 md:grid-cols-2">
          {[
            {
              title: "E-commerce Website",
              description: "Product catalog layout with modern storefront UI.",
              tags: ["Web", "E-commerce", "UI"],
              image: "/onlinestore.png",
              href: "https://online-shop-three-blond.vercel.app/"
            },
            {
              title: "NGO Website",
              description: "Impact-focused design with donation-ready structure.",
              tags: ["Web", "Nonprofit", "Branding"],
              image: "/image.png",
              href: "https://ngo-demo-website.vercel.app/"
            }
          ].map((sample) => (
            <Card
              key={sample.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/10 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-purple-500/40"
            >
              <div className="overflow-hidden">
                <img
                  src={sample.image}
                  alt={`${sample.title} preview`}
                  className="h-48 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{sample.title}</div>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{sample.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sample.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={sample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700 transition hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-200"
                >
                  View Sample
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/idea-chatbot"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          >
            <span className="text-slate-500 dark:text-slate-400">Want something similar?</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">Request a service</span>
          </Link>
        </div>
      </section>

      <Footer />

    </div>
  );
}
