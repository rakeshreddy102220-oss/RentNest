import { Link } from 'react-router-dom';
import { PortalCard } from '../components/PortalCard';
import { SectionHeading } from '../components/SectionHeading';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';

const stats = [
  { label: 'Verified Owners', value: '1.2K+' },
  { label: 'Properties Live', value: '4.8K+' },
  { label: 'Tenant Matches', value: '97%' }
];

export default function LandingPage() {
  return (
    <div className="space-y-20 py-8">
      <section className="grid gap-10 rounded-[40px] border border-white/70 bg-white/80 p-8 shadow-glass backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-violet-100/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            Premium rental experience for modern tenants and owners
          </div>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              RentNest connects owners and tenants directly with effortless luxury.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Discover premium homes, manage property portfolios, and book your next stay without brokers. Beautiful search and polished dashboards keep every user journey seamless.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/properties" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:opacity-95">
              Explore Properties <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary">
              Join RentNest
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-900/95 px-5 py-6 text-white shadow-xl shadow-slate-900/10">
                <p className="text-3xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,91,255,0.4),_transparent_38%)]" />
          <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur-lg">
                Live modern apartment previews • curated for premium users
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">Featured listing</p>
                  <h2 className="mt-2 text-3xl font-semibold">Moonlight Suites</h2>
                  <p className="mt-2 text-sm text-slate-200/90">
                    A glass-morphism oasis with rooftop lounge, smart access and concierge-ready management.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rent</p>
                    <p className="mt-2 text-2xl font-semibold">₹28,500</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Availability</p>
                    <p className="mt-2 text-2xl font-semibold">From 10 Aug</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/50">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Compare portals</p>
                <p className="text-lg font-semibold text-white">RentNest is built for owners, tenants, and admins together.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-semibold">Direct owner connections</p>
                  <p className="mt-2 text-slate-400">No middlemen, no delays.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-semibold">Verified, polished listings</p>
                  <p className="mt-2 text-slate-400">Trusted profiles with complete transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading title="Choose the portal that fits your journey" subtitle="Three dedicated workflows for owners, tenants and administrators, each with premium UI, polished actions and easy navigation." />
        <div className="grid gap-6 lg:grid-cols-3">
          <PortalCard
            title="I Want to Rent My Property"
            description="Upload stunning property galleries, manage listings, and connect directly with interested tenants."
            button="Owner Portal"
            to="/owner/login"
            accent=""
          />
          <PortalCard
            title="I Need a Property"
            description="Discover modern homes with smart filters, save favorites, and message owners instantly."
            button="Tenant Portal"
            to="/tenant/login"
            accent=""
          />
          <PortalCard
            title="Admin Portal"
            description="Review listings, manage users, and protect trust across the RentNest ecosystem."
            button="Admin Portal"
            to="/admin/login"
            accent=""
          />
        </div>
      </section>

      <section className="grid gap-12 rounded-[36px] bg-white/90 p-8 shadow-glass backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <p className="uppercase tracking-[0.32em] text-primary">How it works</p>
          <h2 className="text-4xl font-semibold text-slate-900">RentNest streamlines leasing from search to interest in three smooth steps.</h2>
          <div className="space-y-4 text-slate-600">
            <p>Owners post modern listings with polished galleries and verified details.</p>
            <p>Tenants browse curated results, filter by city, budget, amenities, and request visits.</p>
            <p>Admins maintain platform quality with approvals, reports, and property moderation.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: <Sparkles size={24} />, title: 'Premium presentation', text: 'Glassmorphism cards, gradients and smooth transitions across every page.' },
            { icon: <ShieldCheck size={24} />, title: 'Verified listings', text: 'Admin review ensures trusted owners and accurate property details.' },
            { icon: <Star size={24} />, title: 'Fast connections', text: 'Interest notifications arrive instantly for owner and admin review.' },
            { icon: <ArrowRight size={24} />, title: 'Clear dashboards', text: 'Separate owner, tenant and admin portals with focused tools.' }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <SectionHeading title="Why choose RentNest" subtitle="A premium alternative to outdated listing portals, crafted for modern properties and mobile searches." />
          <div className="mt-8 grid gap-4">
            {[
              'Direct owner contact without broker fees',
              'Advanced filtering by city, budget, amenities and availability',
              'Dedicated dashboards for landlords, tenants and administrators'
            ].map((text) => (
              <div key={text} className="flex items-start gap-4 rounded-3xl bg-slate-50 p-5">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-primary/10 text-primary">✓</span>
                <p className="text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[36px] border border-slate-200/70 bg-[radial-gradient(circle_at_top,_rgba(59,91,255,0.12),transparent_35%),linear-gradient(180deg,white,rgba(248,250,252,0.95))] p-8 shadow-glass">
          <h3 className="text-3xl font-semibold text-slate-900">Premium features across every portal</h3>
          <div className="mt-8 grid gap-4">
            {['Wishlist & recently viewed', 'Property reviews & verified badges', 'Admin moderation panel', 'Smooth mobile-first layout'].map((feature) => (
              <div key={feature} className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="font-semibold text-slate-900">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading title="Customer reviews" subtitle="What property owners and tenants love about RentNest." />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { quote: 'RentNest transformed our rental process. The owner dashboard is crisp and easy to use.', author: 'Aman, Owner' },
            { quote: 'I found a premium apartment within minutes. The filters and wishlist make it feel luxurious.', author: 'Riya, Tenant' },
            { quote: 'Admin tools are polished with excellent reporting and notification control.', author: 'Neha, Admin' }
          ].map((review) => (
            <div key={review.author} className="rounded-[28px] border border-slate-200/70 bg-white/90 p-7 shadow-glass">
              <p className="text-slate-700">“{review.quote}”</p>
              <p className="mt-5 font-semibold text-slate-900">{review.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-[36px] bg-white/90 p-10 shadow-glass">
        <SectionHeading title="Frequently asked questions" subtitle="Clear answers for owners, tenants and admins." />
        <div className="grid gap-4">
          {[
            { q: 'Can I list my apartment instantly?', a: 'Yes, owners can create listings with photos, videos and amenities in a polished add property flow.' },
            { q: 'How do tenants express interest?', a: 'A tenant uses the “I’m Interested” button on the property detail page to notify the owner and admin instantly.' },
            { q: 'Is there an admin approval workflow?', a: 'Yes, administrators can approve, reject, flag or delete any listings from the dashboard.' }
          ].map((item) => (
            <div key={item.q} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-2 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="rounded-[36px] border border-slate-200/70 bg-slate-950/95 p-8 text-white shadow-glass">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xl font-semibold">RentNest</p>
            <p className="mt-3 max-w-sm text-sm text-slate-300">A premium rental platform designed for owners, tenants and admins with modern UX and direct connections.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            <p className="font-semibold text-white">Explore</p>
            <p>About Us</p>
            <p>Features</p>
            <p>Contact</p>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            <p className="font-semibold text-white">Connect</p>
            <p>
  <a href="mailto:rakesh@rentnest.com">
    rakesh@rentnest.com
  </a>
</p>
           <p>
  <a href="tel:+919550910514">
    +91 9550910514
  </a>
</p>
            <p>India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
