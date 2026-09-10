import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Flower2, Gem, Heart, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroBotanicalLayer } from "@/components/home/hero-botanical-layer";

const DETAILS = [
  { icon: Flower2, value: "Real botanicals", label: "Chosen and preserved with care" },
  { icon: Gem, value: "One at a time", label: "Composed personally by hand" },
  { icon: MapPin, value: "Made in Kathmandu", label: "Thoughtfully wrapped and delivered" },
];

const PRODUCT_FORMS = [
  "Bouquets",
  "Bottles",
  "Pots",
  "Shadow boxes",
  "Frames",
  "Keepsakes",
  "Custom work",
];

export function HeroSection() {
  return (
    <section className="hero-luxe relative isolate overflow-hidden border-b border-brand-brown/10">
      <div className="hero-grain absolute inset-0 -z-10" />
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <HeroBotanicalLayer />

      <Container size="xl" className="relative pb-7 pt-10 sm:pt-14 lg:pb-9 lg:pt-16">
        <div className="hero-primary-grid grid min-h-[clamp(610px,76vh,760px)] items-center gap-12 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] lg:gap-12">
          <div className="hero-copy relative z-10 text-center lg:text-left">
            <div className="hero-studio-line mb-8 inline-flex items-center gap-2 border-y border-brand-brown/15 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-brown-700">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink-600" />
              Preserved by hand in Kathmandu
            </div>

            <h1 className="max-w-3xl font-serif text-[clamp(3.05rem,14vw,4.75rem)] font-medium leading-[.9] tracking-[-.05em] text-brand-brown-900 lg:text-[clamp(4.75rem,6.2vw,6.25rem)]">
              Flowers fade.
              <span className="mt-2 block font-light italic text-brand-pink-700 lg:whitespace-nowrap">
                Feelings don&apos;t.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-[34rem] text-[15px] leading-7 text-brand-brown-600 sm:text-base lg:mx-0">
              Bespoke floral keepsakes designed around your photographs, words, and memories—made
              slowly, beautifully, and entirely for someone special.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/collections"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-14 w-full gap-3 px-7 shadow-[0_15px_35px_rgba(63,40,31,.18)] sm:w-auto"
                )}
              >
                Explore the collection
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/order"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 w-full border-brand-brown/20 bg-white/45 px-7 backdrop-blur-md sm:w-auto"
                )}
              >
                Create something personal
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-2" aria-hidden="true">
                {["bg-[#c48f86]", "bg-[#91a288]", "bg-[#d5b7a3]"].map((color, index) => (
                  <span
                    key={color}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f7f0e7] ${color}`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 fill-white text-white ${index === 1 ? "rotate-12" : ""}`}
                    />
                  </span>
                ))}
              </div>
              <p className="text-left text-xs leading-5 text-brand-brown-500">
                <strong className="block font-semibold text-brand-brown-800">
                  Made one at a time
                </strong>
                Never mass-produced. Always meaningful.
              </p>
            </div>
          </div>

          <div
            className="hero-visual relative mx-auto w-full max-w-[630px] lg:mx-0 lg:ml-auto"
            data-parallax="14"
          >
            <span className="hero-vertical-mark" aria-hidden="true">
              Petal Craft · Est. Kathmandu
            </span>
            <div className="hero-image-shell relative ml-auto aspect-[5/4] w-[94%] overflow-hidden border border-white/70 bg-brand-cream-200 shadow-[0_45px_100px_-35px_rgba(61,39,30,.42)] sm:aspect-[4/5] sm:w-[91%]">
              <Image
                src="https://pvjkjwrpqhzrhkuybeyk.supabase.co/storage/v1/object/public/product-images/site-assets/petal-craft-hero-editorial-5027737f47adb3f7.png"
                alt="Preserved blush flowers displayed in a glass cloche and handmade paper frame"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/10 via-transparent to-white/5" />
              <div className="absolute inset-x-6 bottom-6 flex items-end text-white">
                <div className="hero-photo-caption border-l border-white/60 bg-brand-brown-900/20 px-4 py-2 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-[.22em] text-white/75">
                    The forever edit
                  </p>
                  <p className="mt-1 font-serif text-xl">Memory, held in bloom.</p>
                </div>
              </div>
            </div>

            <div className="hero-float-card hero-paper-note absolute -left-1 top-[14%] hidden border border-brand-brown/10 bg-[#fffaf4] p-2.5 pr-4 shadow-[0_18px_38px_-20px_rgba(57,37,29,.25)] sm:-left-2 sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-brand-pink-200/70 bg-brand-pink-50">
                  <Flower2 className="h-4 w-4 text-brand-pink-700" />
                </span>
                <span className="text-[10px] font-medium leading-4 text-brand-brown-500">
                  <strong className="block font-serif text-base font-semibold text-brand-brown-800">
                    1 of 1
                  </strong>
                  made just for you
                </span>
              </div>
            </div>

            <div className="hero-float-card-delayed hero-ribbon-note absolute right-0 hidden max-w-[164px] rotate-1 border border-white/25 bg-brand-sage-800 p-3.5 text-brand-cream shadow-[0_18px_38px_-22px_rgba(57,37,29,.35)] sm:-right-2 sm:bottom-10 sm:block">
              <Sparkles className="mb-2 h-3.5 w-3.5 text-brand-pink-200" />
              <p className="font-serif text-base leading-5">Real flowers. A feeling that lasts.</p>
            </div>
          </div>
        </div>

        <div className="hero-details relative mt-14 grid border-y border-brand-brown/15 pt-5 sm:grid-cols-3 lg:mt-20">
          <span className="hero-details-label absolute left-0 top-0 -translate-y-1/2 bg-[#f5ede4] pr-4 text-[8px] font-bold uppercase tracking-[.24em] text-brand-brown-500">
            The Petal Craft signature
          </span>
          {DETAILS.map(({ icon: Icon, value, label }, index) => (
            <div
              key={value}
              className={`hero-detail flex items-start gap-3 px-4 py-5 text-left sm:px-6 ${index ? "border-t border-brand-brown/10 sm:border-l sm:border-t-0" : ""}`}
            >
              <span className="hero-detail-number" aria-hidden="true">
                0{index + 1}
              </span>
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-sage-700" aria-hidden="true" />
              <p className="text-xs leading-5 text-brand-brown-500">
                <strong className="block font-serif text-base font-semibold text-brand-brown-800">
                  {value}
                </strong>
                {label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#featured"
          className="hero-collection-bridge group mt-6 grid gap-4 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8"
        >
          <span className="text-[9px] font-bold uppercase tracking-[.22em] text-brand-pink-700">
            From the atelier
          </span>
          <span className="flex flex-wrap gap-x-3 gap-y-1 font-serif text-sm italic text-brand-brown-600 sm:justify-center">
            {PRODUCT_FORMS.map((form) => (
              <span key={form}>{form}</span>
            ))}
          </span>
          <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.2em] text-brand-brown-600">
            See the collection
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-1" />
          </span>
        </Link>
      </Container>
    </section>
  );
}
