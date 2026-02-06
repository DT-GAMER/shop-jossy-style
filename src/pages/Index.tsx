import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import heroBanner from "@/assets/hero-banner.jpg";

const features = [
  { icon: ShoppingBag, title: "Quality Fashion", desc: "Premium clothes, shoes, perfumes & accessories" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick delivery across Nigeria" },
  { icon: Shield, title: "Trusted Brand", desc: "Reg No: 7558028 — reliable & authentic" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary">
        <div className="container relative z-10 flex flex-col items-center gap-6 py-16 text-center md:flex-row md:py-24 md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-medium text-accent">
              Wholesale & Retail
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Your One-Stop{" "}
              <span className="text-accent">Fashion</span>{" "}
              Destination
            </h1>
            <p className="mt-4 max-w-md text-base text-primary-foreground/80 md:text-lg">
              Discover premium clothes, shoes, perfumes, creams, watches, and jewelry at unbeatable prices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <img
              src={heroBanner}
              alt="Jossy-Diva Collections — Fashion items display"
              className="mx-auto w-full max-w-sm rounded-2xl shadow-2xl md:max-w-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-card-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-secondary-foreground md:text-3xl">
            Ready to Explore?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Browse our full catalogue and place your order today. All payments via bank transfer — simple and secure.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Browse Catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
