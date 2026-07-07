import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ClipboardCheck, Camera, FileText, Mail, ArrowRight, ShieldCheck, Rocket, TimerReset, Building2, Cloud, Drone, BarChart3 } from "lucide-react";

export default function AeroVistaLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="font-bold text-xl tracking-tight">AeroVista</a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#how" className="hover:text-slate-700">How it works</a>
            <a href="#benefits" className="hover:text-slate-700">Benefits</a>
            <a href="#deliverables" className="hover:text-slate-700">What you get</a>
            <a href="#pricing" className="hover:text-slate-700">Pricing</a>
            <a href="#faq" className="hover:text-slate-700">FAQ</a>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="#pricing">See pricing</a>
            </Button>
            <Button asChild>
              <a href="#contact">Book a 20‑min call</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Property <span className="text-sky-600">Turn & Inspection</span> Kit
            </motion.h1>
            <p className="mt-5 text-lg text-slate-700 max-w-xl">
              Cut unit turn time by ~30% with an M365‑native inspection app, automatic photo‑to‑PDF owner reports, a weekly “What Changed” email, and a clear KPI tile — live in 10–20 business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#contact" className="flex items-center gap-2">Book a call <ArrowRight className="w-4 h-4"/></a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how" className="flex items-center gap-2">How it works</a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4"/> Built inside your Microsoft 365 tenant • You keep the assets
            </div>
          </div>
          <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{duration:0.6, delay:0.1}} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <FeaturePill icon={<ClipboardCheck className="w-5 h-5"/>} title="Power Apps checklist"/>
              <FeaturePill icon={<Camera className="w-5 h-5"/>} title="Photo evidence"/>
              <FeaturePill icon={<FileText className="w-5 h-5"/>} title="Owner‑ready PDFs"/>
              <FeaturePill icon={<BarChart3 className="w-5 h-5"/>} title="KPI tile + digest"/>
            </div>
            <div className="absolute -z-10 blur-3xl opacity-50 w-64 h-64 bg-sky-200 rounded-full -top-10 -right-10"/>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Why teams choose AeroVista</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={Building2} title="M365‑native" desc="Lives in your SharePoint/Power Platform. No new logins, no extra silos."/>
            <ValueCard icon={FileText} title="Owner‑ready proof" desc="Automatic photo→PDF reports, plus a weekly ‘What Changed’ email."/>
            <ValueCard icon={Rocket} title="Fast turnaround" desc="Go live in 10–20 business days from access & approvals."/>
            <ValueCard icon={Drone} title="Drone optional" desc="Add safe, crisp exterior/roof evidence to the same report."/>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="mt-8 grid lg:grid-cols-5 gap-4">
            <StepCard n={1} title="Kickoff & access" desc="Define success (e.g., −30% days‑to‑turn). Add AeroVista as a guest."/>
            <StepCard n={2} title="SharePoint foundation" desc="Lists, libraries, permissions, naming & retention."/>
            <StepCard n={3} title="App & evidence" desc="Power Apps checklist + photo conventions; rename/move flow."/>
            <StepCard n={4} title="PDF & digest" desc="Populate branded Word template → PDF; schedule weekly digest."/>
            <StepCard n={5} title="KPI & go‑live" desc="Add KPI tile, train staff, run 3 ride‑alongs, ship results memo."/>
          </div>
        </div>
      </section>

      {/* What you get vs we do */}
      <section id="deliverables" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">What you get — and what we do</h2>
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Check className="w-5 h-5 text-sky-600"/> Deliverables (you keep)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-700">
                <Item>Turn & Inspection app (Power Apps)</Item>
                <Item>SharePoint lists/libraries + permissions</Item>
                <Item>Automated photo→PDF pipeline (Power Automate)</Item>
                <Item>Branded owner report template (Word/PDF)</Item>
                <Item>Weekly “What Changed” email + KPI tile</Item>
                <Item>Quickstart user/admin docs</Item>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-sky-600"/> Our leg work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-700">
                <Item>Discovery, success metric, scope guardrails</Item>
                <Item>Tenant‑safe setup: lists, flows, permissions</Item>
                <Item>PDF layout & evidence standards calibration</Item>
                <Item>Weekly check‑ins + one revision pass</Item>
                <Item>Results memo & next‑phase options</Item>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Simple, outcome‑focused pricing</h2>
          <p className="mt-2 text-slate-600">Pilot goes live within 10–20 business days of access & approvals. 50/50 milestone billing. Net‑7.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <PriceCard tier="Starter" price="$5,000" bullets={["Power Apps checklist","SharePoint structure","Photo→PDF workflow","Quickstart docs"]} cta="Get Starter"/>
            <PriceCard tier="Standard" price="$8,500" highlight bullets={["Everything in Starter","Weekly ‘What Changed’ email","KPI tile (Power BI)","3 ride‑along inspections"]} cta="Get Standard"/>
            <PriceCard tier="Pro" price="$12,000" bullets={["Everything in Standard","Drone exterior/roof pack (1 property)","Results memo & rollout plan"]} cta="Get Pro"/>
          </div>
          <p className="mt-4 text-sm text-slate-500">Licensing: client provides Microsoft 365 / Power Platform seats. We design around standard connectors to avoid premium add‑ons.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <FAQ q="Do you do the inspections?" a="Your team runs daily inspections. We deliver the system, training, and (optionally) ride‑alongs/audits and drone capture."/>
            <FAQ q="Who pays for Microsoft 365/Power Apps?" a="You do. We build in your tenant and keep it to standard connectors whenever possible."/>
            <FAQ q="How fast can we go live?" a="Fast‑track in 10 business days; standard is 20 business days from access & approvals."/>
            <FAQ q="Can you integrate with our current tool?" a="Yes. Keep it — we’ll automate the evidence handoff into M365 and owner‑ready PDFs."/>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to cut turn time ~30%?</h2>
          <p className="mt-3 text-slate-600">Book a 20‑minute discovery call. We’ll map success, confirm scope, and give you a written pilot plan.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button size="lg" asChild>
              <a href="mailto:hello@AeroVista.us" className="flex items-center gap-2"><Mail className="w-4 h-4"/> hello@AeroVista.us</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#pricing">See pricing</a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Coeur d’Alene, Idaho • Local & remote delivery</p>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-200 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AeroVista LLC — Property Turn & Inspection Kit
      </footer>
    </div>
  );
}

function FeaturePill({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="p-2 rounded-xl bg-sky-50 text-sky-700">{icon}</div>
      <div className="font-medium">{title}</div>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="w-5 h-5 text-sky-600"/>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-semibold shadow">{n}</div>
      <Card className="h-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-sm">{desc}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-1 text-sky-600"/><span>{children}</span></div>
  );
}

function PriceCard({ tier, price, bullets, cta, highlight }: { tier: string; price: string; bullets: string[]; cta: string; highlight?: boolean }) {
  return (
    <Card className={`h-full shadow-sm ${highlight ? 'ring-2 ring-sky-600' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tier}</span>
          <span className="text-2xl font-extrabold">{price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-slate-700">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 mt-1 text-sky-600"/><span>{b}</span></div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={highlight ? 'default' : 'outline'} asChild>
          <a href="#contact">{cta}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
