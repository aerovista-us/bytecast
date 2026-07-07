import React, { useEffect } from "react";

// Minimal, dependency-free UI primitives (Tailwind only)
function Button({ asChild, href, children, variant = "default", size = "md", className = "" }: any) {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium shadow-sm transition px-4 py-2";
  const sizes: any = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2", lg: "px-5 py-3 text-base" };
  const variants: any = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const Cmp: any = asChild ? "a" : "button";
  return (
    <Cmp href={href} className={cls}>
      {children}
    </Cmp>
  );
}
function Card({ children, className = "" }: any) {
  return <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ children }: any) { return <div className="px-6 pt-6">{children}</div>; }
function CardTitle({ children, className = "" }: any) { return <h3 className={`font-semibold ${className}`}>{children}</h3>; }
function CardContent({ children, className = "" }: any) { return <div className={`px-6 pb-6 ${className}`}>{children}</div>; }
function CardFooter({ children }: any) { return <div className="px-6 pb-6">{children}</div>; }

// Tiny inline icons (no external libs)
const IconCheck = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconMail = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>
  </svg>
);
const IconArrowRight = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14"/><path d="m13 18 6-6-6-6"/>
  </svg>
);

export default function AeroVistaLanding() {
  // Sanity check: warn if any anchor points to a missing id
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]')) as HTMLAnchorElement[];
    anchors.forEach(a => {
      const id = a.getAttribute('href')?.slice(1);
      if (id && id.length && !document.getElementById(id)) {
        // eslint-disable-next-line no-console
        console.warn(`[AnchorCheck] Missing target for #${id}`);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand link → set to your site root to avoid dead link */}
          <a href="/" className="font-bold text-xl tracking-tight">AeroVista</a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#how" className="hover:text-slate-700">How it works</a>
            <a href="#benefits" className="hover:text-slate-700">Benefits</a>
            <a href="#deliverables" className="hover:text-slate-700">What you get</a>
            <a href="#pricing" className="hover:text-slate-700">Pricing</a>
            <a href="#faq" className="hover:text-slate-700">FAQ</a>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" asChild href="#pricing">
              <a>See pricing</a>
            </Button>
            <Button asChild href="#contact">
              <a className="flex items-center gap-2">Book a 20‑min call <IconArrowRight className="w-4 h-4"/></a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" id="hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Property <span className="text-sky-600">Turn & Inspection</span> Kit
            </h1>
            <p className="mt-5 text-lg text-slate-700 max-w-xl">
              Cut unit turn time by ~30% with an M365‑native inspection app, automatic photo‑to‑PDF owner reports, a weekly “What Changed” email, and a clear KPI tile — live in 10–20 business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild href="#contact">
                <a className="flex items-center gap-2">Book a call <IconArrowRight className="w-4 h-4"/></a>
              </Button>
              <Button size="lg" variant="outline" asChild href="#how">
                <a className="flex items-center gap-2">How it works</a>
              </Button>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Built inside your Microsoft 365 tenant • You keep the assets
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <FeaturePill title="Power Apps checklist"/>
              <FeaturePill title="Photo evidence"/>
              <FeaturePill title="Owner‑ready PDFs"/>
              <FeaturePill title="KPI tile + digest"/>
            </div>
            <div className="absolute -z-10 blur-3xl opacity-50 w-64 h-64 bg-sky-200 rounded-full -top-10 -right-10"/>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Why teams choose AeroVista</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard title="M365‑native" desc="Lives in your SharePoint/Power Platform. No new logins, no extra silos."/>
            <ValueCard title="Owner‑ready proof" desc="Automatic photo→PDF reports, plus a weekly ‘What Changed’ email."/>
            <ValueCard title="Fast turnaround" desc="Go live in 10–20 business days from access & approvals."/>
            <ValueCard title="Drone optional" desc="Add safe, crisp exterior/roof evidence to the same report."/>
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

      {/* Deliverables vs Leg work */}
      <section id="deliverables" className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">What you get — and what we do</h2>
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-sky-600"/> Deliverables (you keep)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-700">
                <Item>Turn & Inspection app (Power Apps)</Item>
                <Item>SharePoint lists/libraries + permissions</Item>
                <Item>Automated photo→PDF pipeline</Item>
                <Item>Branded owner report template (Word/PDF)</Item>
                <Item>Weekly “What Changed” email + KPI tile</Item>
                <Item>Quickstart user/admin docs</Item>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-sky-600"/> Our leg work</CardTitle>
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
            <Button size="lg" asChild href="mailto:hello@AeroVista.us">
              <a className="flex items-center gap-2"><IconMail className="w-4 h-4"/> hello@AeroVista.us</a>
            </Button>
            <Button size="lg" variant="outline" asChild href="#pricing">
              <a>See pricing</a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Coeur d’Alene, Idaho • Local & remote delivery</p>
        </div>
      </section>

      {/* Hidden smoke tests */}
      <div className="sr-only" aria-hidden data-testid="faq-tests">
        <FAQ q="Edge: Empty answer" a="" />
        <FAQ q="Edge: Long answer" a={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris."} />
      </div>

      <footer className="py-8 border-t border-slate-200 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AeroVista LLC — Property Turn & Inspection Kit
      </footer>
    </div>
  );
}

function FeaturePill({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="p-2 rounded-xl bg-sky-50 text-sky-700"><IconCheck className="w-4 h-4"/></div>
      <div className="font-medium">{title}</div>
    </div>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-sky-600"/>{title}</CardTitle>
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
      <Card>
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
    <div className="flex items-start gap-2"><IconCheck className="w-4 h-4 mt-1 text-sky-600"/><span>{children}</span></div>
  );
}

function PriceCard({ tier, price, bullets, cta, highlight }: { tier: string; price: string; bullets: string[]; cta: string; highlight?: boolean }) {
  return (
    <Card className={`h-full ${highlight ? 'ring-2 ring-sky-600' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tier}</span>
          <span className="text-2xl font-extrabold">{price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-slate-700">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2"><IconCheck className="w-4 h-4 mt-1 text-sky-600"/><span>{b}</span></div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={highlight ? 'default' : 'outline'} asChild href="#contact">
          <a>{cta}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

// FAQ component (plain text)
function FAQ({ q, a }: { q: string; a: string }) {
  const question = q?.trim() || "Question";
  const answer = (a ?? "").toString();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 text-sm whitespace-pre-line">{answer}</p>
      </CardContent>
    </Card>
  );
}
