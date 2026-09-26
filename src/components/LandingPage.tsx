import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Landmark, ArrowRight, ShoppingBag, Sparkles, Mic, TrendingUp, Wallet,
  ShieldCheck, BadgeCheck, Star, Globe2, Languages, MapPin, ChevronDown
} from 'lucide-react';
import { Language, Product, Order } from '../types';
import { TRANSLATIONS } from '../data';

interface LandingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  products: Product[];
  orders: Order[];
  onStartShopping: () => void;
  onBecomeArtisan: () => void;
  onSignIn: () => void;
}

const pickLang = (language: Language) => ({ ...TRANSLATIONS.en, ...TRANSLATIONS[language] });

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  setLanguage,
  products,
  orders,
  onStartShopping,
  onBecomeArtisan,
  onSignIn
}) => {
  const t = pickLang(language);

  const listedProducts = useMemo(() => products.filter(p => p.status === 'Listed'), [products]);

  const stats = useMemo(() => {
    const regions = new Set(
      products
        .map(p => p.weaverRegion?.split(',').pop()?.trim())
        .filter(Boolean)
    );
    return {
      products: listedProducts.length,
      orders: orders.length,
      regions: regions.size
    };
  }, [products, listedProducts, orders]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of listedProducts) {
      const key = p.category || 'Handicrafts';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [listedProducts]);

  const featured = useMemo(() => listedProducts.slice(0, 6), [listedProducts]);

  const artisans = useMemo(() => {
    const seen = new Map<string, Product>();
    for (const p of products) {
      if (!seen.has(p.weaverName)) seen.set(p.weaverName, p);
    }
    return Array.from(seen.values()).slice(0, 4);
  }, [products]);

  const langOptions: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'kn', label: 'ಕ' },
    { code: 'ta', label: 'த' }
  ];

  return (
    <div id="landing-page" className="w-full font-sans text-charcoal">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-lg text-charcoal">KalaSetu</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-white border border-cream-border rounded-full p-0.5">
              {langOptions.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => setLanguage(opt.code)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                    language === opt.code ? 'bg-terracotta text-white' : 'text-gray-500 hover:text-charcoal'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={onSignIn}
              className="text-xs sm:text-sm font-bold text-charcoal hover:text-terracotta transition px-2 sm:px-3 py-2"
            >
              {t.landingNavSignIn}
            </button>
            <button
              onClick={onStartShopping}
              className="bg-terracotta hover:bg-terracotta/90 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition"
            >
              {t.landingNavGetStarted}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-dark/40 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif font-bold text-3xl sm:text-5xl leading-tight text-charcoal"
          >
            {t.landingHeroTitleLine1}{' '}
            <span className="text-terracotta">{t.landingHeroTitleAccent}</span>
          </motion.h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t.landingHeroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartShopping}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4" />
              {t.landingHeroCtaPrimary}
            </button>
            <button
              onClick={onBecomeArtisan}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-cream-dark border-2 border-charcoal text-charcoal font-bold px-6 py-3 rounded-xl transition"
            >
              <Sparkles className="w-4 h-4" />
              {t.landingHeroCtaSecondary}
            </button>
          </div>
        </div>

        {/* Stats bar - real, computed from live product/order state */}
        <div className="max-w-4xl mx-auto mt-14 grid grid-cols-3 gap-3 sm:gap-6">
          {[
            { value: stats.products, label: t.landingStatProducts },
            { value: stats.orders, label: t.landingStatOrders },
            { value: stats.regions, label: t.landingStatRegions }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-cream-border rounded-2xl py-4 sm:py-6 text-center shadow-xs">
              <p className="font-serif font-bold text-2xl sm:text-4xl text-terracotta">{s.value}</p>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 mt-1 px-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories - real, grouped from live product.category */}
      {categories.length > 0 && (
        <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingCategoriesTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{t.landingCategoriesSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {categories.map(([cat, count]) => (
              <div
                key={cat}
                className="bg-white border border-cream-border rounded-2xl p-4 sm:p-5 hover:border-terracotta/60 transition shadow-xs"
              >
                <p className="font-bold text-sm sm:text-base text-charcoal">{cat}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(t.landingCategoryCount || '{n} products').replace('{n}', String(count))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured products - real, live inventory */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-cream-dark/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingFeaturedTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{t.landingFeaturedSubtitle}</p>
          </div>

          {featured.length === 0 ? (
            <div className="text-center text-sm text-gray-500 bg-white border border-cream-border rounded-2xl py-10">
              {t.landingFeaturedEmpty}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {featured.map(p => (
                  <div key={p.id} className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-xs">
                    <div className="aspect-square bg-cream overflow-hidden">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <p className="font-bold text-xs sm:text-sm text-charcoal truncate">{p.title}</p>
                      <p className="text-terracotta font-bold text-xs sm:text-sm mt-1">₹{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={onStartShopping}
                  className="inline-flex items-center gap-2 bg-charcoal hover:bg-black text-cream font-bold px-5 py-2.5 rounded-xl text-sm transition"
                >
                  {t.landingFeaturedCta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How it works - maps to real implemented features */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingHowTitle}</h2>
          <p className="text-sm text-gray-500 mt-2">{t.landingHowSubtitle}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Mic, title: t.landingHowStep1Title, desc: t.landingHowStep1Desc },
            { icon: TrendingUp, title: t.landingHowStep2Title, desc: t.landingHowStep2Desc },
            { icon: Wallet, title: t.landingHowStep3Title, desc: t.landingHowStep3Desc }
          ].map((step, i) => (
            <div key={i} className="bg-white border border-cream-border rounded-2xl p-5 text-center space-y-3 shadow-xs">
              <div className="w-11 h-11 mx-auto rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-charcoal">{step.title}</p>
              <p className="text-xs text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={onBecomeArtisan}
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            {t.landingHowCta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Trust & Security - real implemented safeguards */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-indigo-custom/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingTrustTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{t.landingTrustSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, title: t.landingTrust1Title, desc: t.landingTrust1Desc },
              { icon: BadgeCheck, title: t.landingTrust2Title, desc: t.landingTrust2Desc },
              { icon: Star, title: t.landingTrust3Title, desc: t.landingTrust3Desc },
              { icon: Globe2, title: t.landingTrust4Title, desc: t.landingTrust4Desc }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-cream-border rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-custom/10 text-indigo-custom flex items-center justify-center">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-charcoal">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan spotlight - real, from live weaver fields */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingArtisansTitle}</h2>
          <p className="text-sm text-gray-500 mt-2">{t.landingArtisansSubtitle}</p>
        </div>
        {artisans.length === 0 ? (
          <div className="text-center text-sm text-gray-500 bg-white border border-cream-border rounded-2xl py-10">
            {t.landingArtisansEmpty}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {artisans.map(p => (
              <div key={p.weaverName} className="bg-white border border-cream-border rounded-2xl p-4 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full mx-auto overflow-hidden bg-cream border border-cream-border">
                  {p.weaverImage && <img src={p.weaverImage} alt={p.weaverName} className="w-full h-full object-cover" />}
                </div>
                <p className="font-bold text-sm text-charcoal mt-3">{p.weaverName}</p>
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {p.weaverRegion}
                </p>
                {p.weaverBio && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.weaverBio}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {/* TODO: no site-wide testimonial/review-quote feed exists yet at the platform level
            (Phase 2 built per-order verified-purchase reviews, not a curated testimonial feed) -
            omitted rather than inventing fake quotes. */}
      </section>

      {/* Grow / for artisans - real implemented features */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-cream-dark/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">{t.landingGrowTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{t.landingGrowSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: t.landingGrow1Title, desc: t.landingGrow1Desc },
              { title: t.landingGrow2Title, desc: t.landingGrow2Desc },
              { title: t.landingGrow3Title, desc: t.landingGrow3Desc }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-cream-border rounded-2xl p-5 shadow-xs">
                <p className="font-bold text-sm text-charcoal">{item.title}</p>
                <p className="text-xs text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-3xl mx-auto">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal text-center mb-8">{t.landingFaqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: t.landingFaq1Q, a: t.landingFaq1A },
            { q: t.landingFaq2Q, a: t.landingFaq2A },
            { q: t.landingFaq3Q, a: t.landingFaq3A },
            { q: t.landingFaq4Q, a: t.landingFaq4A }
          ].map((item, i) => (
            <details key={i} className="bg-white border border-cream-border rounded-2xl p-4 group">
              <summary className="flex items-center justify-between font-bold text-sm text-charcoal cursor-pointer list-none">
                {item.q}
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-gray-500 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      {/* TODO: no email/newsletter backend exists - a subscribe form was intentionally omitted
          rather than shipping a non-functional one. */}

      {/* Footer */}
      <footer className="bg-charcoal text-cream px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm">KalaSetu</p>
              <p className="text-[11px] text-gray-400">{t.landingFooterTagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Languages className="w-3.5 h-3.5" />
            <span>{t.landingFooterRights}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
