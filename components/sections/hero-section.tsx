import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Flower2, Gem, Heart, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DETAILS = [
  { icon: Flower2, value: "Real botanicals", label: "Naturally preserved" },
  { icon: Gem, value: "Made for you", label: "Personalised by hand" },
  { icon: MapPin, value: "Kathmandu", label: "Local studio & delivery" },
];

export function HeroSection() {
  return (
    <section className="hero-luxe relative isolate overflow-hidden border-b border-brand-brown/10">
      <div className="hero-grain absolute inset-0 -z-10" />
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />

      <Container size="xl" className="relative pb-8 pt-12 sm:pt-16 lg:pb-10 lg:pt-20">
        <div className="grid min-h-[720px] items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
          <div className="relative z-10 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-brown/15 bg-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-brown-700 shadow-[0_8px_30px_rgba(74,49,39,.07)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink-600" />
              Preserved by hand in Kathmandu
            </div>

            <h1 className="max-w-3xl font-serif text-[clamp(3.65rem,8vw,7.5rem)] font-medium leading-[.82] tracking-[-.055em] text-brand-brown-900">
              Flowers fade.
              <span className="mt-3 block font-light italic text-brand-pink-700">
                Feelings don&apos;t.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-7 text-brand-brown-600 sm:text-base lg:mx-0">
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

          <div className="relative mx-auto w-full max-w-[570px] lg:mx-0 lg:ml-auto">
            <div className="hero-image-shell relative ml-auto aspect-[4/5] w-[90%] overflow-hidden rounded-[2.6rem] border border-white/70 bg-brand-cream-200 shadow-[0_45px_100px_-35px_rgba(61,39,30,.42)] sm:w-[86%]">
              <Image
                src="/images/petal-craft-hero-editorial.png"
                alt="Preserved blush flowers displayed in a glass cloche and handmade paper frame"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/10 via-transparent to-white/5" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
                <div className="rounded-2xl border border-white/35 bg-brand-brown-900/20 px-4 py-3 backdrop-blur-lg">
                  <p className="text-[9px] font-bold uppercase tracking-[.22em] text-white/75">
                    The forever edit
                  </p>
                  <p className="mt-1 font-serif text-xl">Memory, held in bloom.</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-lg">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="hero-float-card absolute -left-1 top-[14%] rounded-2xl border border-white/70 bg-[#fffaf4]/80 p-3 pr-5 shadow-[0_24px_50px_-18px_rgba(57,37,29,.35)] backdrop-blur-xl sm:-left-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pink-100 shadow-inner">
                  <Flower2 className="h-5 w-5 text-brand-pink-700" />
                </span>
                <span className="text-[10px] font-medium leading-4 text-brand-brown-500">
                  <strong className="block font-serif text-base font-semibold text-brand-brown-800">
                    1 of 1
                  </strong>
                  made just for you
                </span>
              </div>
            </div>

            <div className="hero-float-card-delayed absolute -bottom-4 right-0 max-w-[190px] rotate-2 rounded-[1.4rem] border border-white/75 bg-brand-sage-800 p-4 text-brand-cream shadow-[0_24px_50px_-18px_rgba(57,37,29,.45)] sm:-right-3 sm:bottom-10">
              <Sparkles className="mb-3 h-4 w-4 text-brand-pink-200" />
              <p className="font-serif text-lg leading-5">Real flowers. A feeling that lasts.</p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[1.75rem] border border-brand-brown/10 bg-white/45 shadow-[0_22px_60px_-42px_rgba(61,39,30,.5)] backdrop-blur-xl sm:grid-cols-3 lg:mt-20">
          {DETAILS.map(({ icon: Icon, value, label }, index) => (
            <div
              key={value}
              className={`flex items-center justify-center gap-4 px-6 py-5 text-left sm:justify-start ${index ? "border-t border-brand-brown/10 sm:border-l sm:border-t-0" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-cream shadow-[inset_0_1px_0_white,0_7px_18px_rgba(74,49,39,.08)]">
                <Icon className="h-[18px] w-[18px] text-brand-sage-700" />
              </span>
              <p className="text-xs leading-5 text-brand-brown-500">
                <strong className="block font-serif text-lg font-semibold text-brand-brown-800">
                  {value}
                </strong>
                {label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#featured"
          className="mx-auto mt-8 flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-brand-brown-500"
        >
          Discover more <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </Link>
      </Container>
    </section>
  );
}
