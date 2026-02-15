"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiClipboard, FiUsers } from "react-icons/fi";
import { ArrowRight, Bot, BarChart3, Globe, Megaphone, Menu, MessageSquare, Palette, Smartphone, Sparkles, Wrench, X } from "lucide-react";
import ForceLightMode from "@/components/ForceLightMode";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";
import NetworkCanvas from "@/components/NetworkCanvas";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const services = [
    {
      title: "Web Development",
      slug: "web-development",
      description: "Websites, portals, dashboards, and web apps.",
      tag: "Most requested",
      icon: Globe,
    },
    {
      title: "Mobile Apps",
      slug: "mobile-apps",
      description: "Android, iOS, and cross-platform builds.",
      tag: "Popular",
      icon: Smartphone,
    },
    {
      title: "UI/UX Design",
      slug: "ui-ux-design",
      description: "Modern UI, prototypes, and user research.",
      tag: "Popular",
      icon: Palette,
    },
    {
      title: "Branding & Identity",
      slug: "branding",
      description: "Logos, brand guides, and visual identity.",
      tag: "New",
      icon: Sparkles,
    },
    {
      title: "Digital Marketing",
      slug: "digital-marketing",
      description: "SEO, social content, and paid campaigns.",
      tag: "Popular",
      icon: Megaphone,
    },
    {
      title: "Data & Analytics",
      slug: "data-analytics",
      description: "Dashboards, reporting, and business insights.",
      tag: "Popular",
      icon: BarChart3,
    },
    {
      title: "AI Chatbots & Automation",
      slug: "ai-chatbots",
      description: "Support bots, workflows, and integrations.",
      tag: "New",
      icon: Bot,
    },
    {
      title: "Maintenance & Support",
      slug: "maintenance",
      description: "Updates, fixes, and continuous improvements.",
      tag: "Essential",
      icon: Wrench,
    },
  ];

  return (
    <div className="landing-shell min-h-screen bg-white dark:bg-[#181A20]">
      <ForceLightMode />
      <header className="landing-header landing-fade relative z-20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="SkillLink Nexus logo" width={32} height={32} className="sm:h-9 sm:w-9" priority />
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
              Log in
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
                Log in
              </Link>
              <Link href="/request" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg bg-purple-700 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-purple-800">
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero — single H1 for the page */}
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
                so you don&apos;t spend your time supervising freelancers.
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
                src="/mobile-app.png"
                alt="SkillLink Nexus mobile app preview"
                width={600}
                height={800}
                className="h-auto w-full max-w-[600px] drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <FloatingChatbot />

      {/* How it works */}
      <section id="how" className="landing-fade landing-band landing-band--tinted mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold text-purple-600 sm:text-3xl md:text-4xl lg:text-5xl">
            How it works
          </h2>
        </div>

        <div className="landing-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Project Scoping",
              body: "Chat with our AI to brainstorm your idea and draft a clear project brief. Once you're done, it summarizes everything and routes your request to the right specialist automatically.",
              image: "/project.png",
              icon: <FiClipboard />,
            },
            {
              title: "Specialist Matching",
              body: "Every request is matched to the best specialist based on skills, proven delivery performance, and availability — you get reliable execution without hiring or managing freelancers.",
              image: "/matching2.png",
              icon: <FiUsers />,
            },
            {
              title: "Delivery Management",
              body: "Milestones are reviewed, feedback is logged, and payments are tracked end-to-end.",
              image: "/management.png",
              icon: <FiCheckCircle />,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] p-6 shadow-lg shadow-slate-200/40 dark:shadow-none">
              <div className="relative mb-6 flex h-60 items-center justify-center">
                <Image
                  src={item.image}
                  alt={`${item.title} preview`}
                  width={320}
                  height={240}
                  className="relative h-60 w-auto object-contain drop-shadow"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--primary-purple)] to-[color:var(--purple-light)] text-white">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Payments */}
      <section id="payments" className="landing-fade mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="text-slate-900 dark:text-slate-100">Payments that </span>
            <span className="bg-gradient-to-r from-[color:var(--primary-purple)] to-[color:var(--purple-light)] bg-clip-text text-transparent">protect both sides</span>
          </h2>
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

        {/* Horizontal timeline stepper */}
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
                <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                  i === 0 ? "bg-purple-700" : i === 1 ? "bg-purple-600" : "bg-purple-500"
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

      {/* Product */}
      <section id="product" className="landing-fade relative overflow-hidden py-12 sm:py-16" style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #220e50 30%, #2a1260 60%, #311570 100%)" }}>
        {/* 3D animated particle network */}
        <NetworkCanvas />

        {/* Header */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Your project workspace</h2>
          <p className="mt-3 max-w-3xl mx-auto text-base text-purple-100/90 sm:text-lg">
            Track milestones, escrow, files, and approvals in one place while SkillLink Nexus coordinates vetted specialists behind the scenes.
          </p>
        </div>

        {/* Cards */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 2xl:max-w-[1400px] 2xl:px-12">
          <div className="landing-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Client HQ",
              body: "Track milestones, files, feedback, and approvals in one place.",
              image: "/client_hq.png",
              alt: "Client HQ dashboard showing milestones and project tracking",
              iconBg: "bg-purple-600",
              iconSvg: (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              ),
            },
            {
              title: "Assigned Specialist",
              body: "Chat with your vetted specialist and follow progress updates privately.",
              image: "/assigned_specialist.png",
              alt: "Assigned Specialist chat interface with progress updates",
              iconBg: "bg-purple-600",
              iconSvg: (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              ),
            },
            {
              title: "Invoices",
              body: "View invoices, download PDFs, and track payments across projects.",
              image: "/invoices.png",
              alt: "Invoices dashboard with payment tracking",
              iconBg: "bg-teal-500",
              iconSvg: (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="group rounded-xl border border-slate-100 bg-white dark:border-white/5 dark:bg-[#1E2329] overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              {/* Image area with tinted gradient that fades to white */}
              <div className="relative flex items-center justify-center px-4 pt-4 pb-3">
                {/* Tinted gradient background — purple/lavender top fading to transparent */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 via-purple-50/40 to-transparent dark:from-purple-900/20 dark:via-purple-900/10 dark:to-transparent" />
                <div className="relative z-10 w-full">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain drop-shadow-lg"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
              {/* Title + description */}
              <div className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${item.iconBg} shadow-md`}>
                    {item.iconSvg}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.body}</p>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-purple-900/20">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Ready to start your next project?</h3>
              <p className="mt-2.5 text-sm text-purple-100/80 sm:text-base">
                Get matched to a vetted specialist and manage delivery through milestones and escrow.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/request" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-purple-900"
                >
                  Request a service
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-purple-900"
                >
                  <MessageSquare className="h-4 w-4" />
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="landing-fade mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Request any digital service
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Choose what you need. We assign a vetted specialist, track milestones, and manage delivery until approval.
          </p>
        </div>

        <div className="landing-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={`/services/${service.slug}`} className="block">
                <Card className="group h-full rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/10 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-purple-500/40">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Icon className="h-[22px] w-[22px] text-purple-700 dark:text-purple-300" strokeWidth={2} aria-hidden="true" />
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-purple-300">
                      Request this service
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <div className="w-full max-w-5xl mx-auto">
            <div className="rounded-2xl border border-black/5 bg-white dark:bg-white/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] py-8 px-6 sm:py-10 sm:px-10">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
                  Not sure what you need?
                </h3>
                <p className="mt-3 mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                  Tell us your goal — we'll clarify the scope and match you to a vetted specialist.
                </p>
                <div className="mt-6">
                  <Link
                    href="/request"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-500 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Request a service
                  </Link>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Takes 2 minutes • Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Samples */}
      <section id="samples" className="landing-fade landing-band landing-band--tinted mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center sm:text-3xl">
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
              href: "https://online-shop-three-blond.vercel.app/",
            },
            {
              title: "NGO Website",
              description: "Impact-focused design with donation-ready structure.",
              tags: ["Web", "Nonprofit", "Branding"],
              image: "/image.png",
              href: "https://ngo-demo-website.vercel.app/",
            },
          ].map((sample) => (
            <Card
              key={sample.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/10 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-purple-500/40"
            >
              <div className="overflow-hidden relative h-48 w-full">
                <Image
                  src={sample.image}
                  alt={`${sample.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{sample.title}</h3>
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
      </section>

      {/* FAQ section for structured data */}
      <section id="faq" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 2xl:max-w-[1400px] 2xl:px-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Everything you need to know about working with SkillLink Nexus.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 dark:divide-slate-700">
          {[
            {
              q: "What is SkillLink Nexus?",
              a: "SkillLink Nexus is a managed delivery platform that matches businesses with vetted specialists for project-based work. We handle scoping, matching, milestone tracking, and escrow payments so you can focus on your business.",
            },
            {
              q: "How does the escrow payment system work?",
              a: "When you fund a project, your payment is held securely by SkillLink Nexus — not sent directly to the specialist. Funds are released per milestone only after you review and approve the deliverable.",
            },
            {
              q: "What services can I request?",
              a: "We offer web development, mobile apps, UI/UX design, branding & identity, digital marketing, data & analytics, AI chatbots & automation, and maintenance & support. Each service is delivered end-to-end by a vetted specialist.",
            },
            {
              q: "How are specialists vetted?",
              a: "Every specialist on our platform goes through a thorough vetting process that includes portfolio review, technical assessment, and delivery-track-record evaluation. Only top performers are matched to client projects.",
            },
            {
              q: "How long does a typical project take?",
              a: "Timelines vary based on scope and complexity. Simple projects like landing pages can be delivered in 1–2 weeks, while complex web apps or mobile apps may take 4–12 weeks. You'll receive a clear timeline during the scoping phase.",
            },
          ].map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-left text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                {faq.q}
                <span className="ml-4 shrink-0 text-purple-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
