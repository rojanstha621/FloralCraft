"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { createWhatsAppUrl } from "@/lib/config/business";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useBusinessSettings } from "@/components/providers/business-provider";

export default function ContactPage() {
  const business = useBusinessSettings();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    const inquiry = `Hi ${business.name} 🌸\n\nMy name is ${name}.${phone ? `\nPhone: ${phone}` : ""}${email ? `\nEmail: ${email}` : ""}\n\n${message}`;
    window.open(
      createWhatsAppUrl(inquiry, business.whatsappNumber),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="public-editorial-page contact-page">
      <Container size="xl">
        {/* Header */}
        <header className="editorial-page-header mb-14 space-y-3 text-center">
          <Badge variant="pink">Kathmandu Studio</Badge>
          <Heading as="h1" size="2xl" className="font-serif">
            Get in Touch with Our Artisans
          </Heading>
          <Text size="base" variant="muted" className="mx-auto max-w-md">
            Have questions about custom framing, bulk corporate gifting, or urgent anniversary
            deliveries? We would love to hear from you.
          </Text>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Studio Information */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-brand-beige-300 bg-white p-8 shadow-card">
              <h3 className="border-b border-brand-beige-200 pb-3 font-serif text-lg font-semibold text-brand-brown">
                Studio &amp; Contact Details
              </h3>

              <div className="space-y-4 text-xs text-brand-brown">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-pink-100 text-brand-brown">
                    <MapPin className="h-4 w-4 text-brand-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Artisan Workshop &amp; Studio</h4>
                    <p className="mt-0.5 text-brand-brown-500">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-sage-100 text-brand-brown">
                    <Phone className="h-4 w-4 text-brand-sage-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Phone / Mobile</h4>
                    <p className="mt-0.5 text-brand-brown-500">{business.phoneDisplay}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-beige-200 text-brand-brown">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Email Support</h4>
                    <p className="mt-0.5 text-brand-brown-500">{business.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream-200 text-brand-brown">
                    <Clock className="h-4 w-4 text-brand-brown-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Opening Hours</h4>
                    <p className="mt-0.5 text-brand-brown-500">
                      {business.openingHours || "Contact the studio for today’s hours."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat */}
              <div className="border-t border-brand-beige-200 pt-2">
                <WhatsAppButton label="Chat with us on WhatsApp" className="w-full" />
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-8 shadow-card md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="border-b border-brand-beige-200 pb-3 font-serif text-lg font-semibold text-brand-brown">
                  Send an Inquiry
                </h3>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-brown">
                    Your Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Aayushma Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-brand-brown">
                      Nepal Mobile Number
                    </label>
                    <Input
                      placeholder="98XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-brand-brown">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-brown">
                    Your Message / Custom Requirement *
                  </label>
                  <Textarea
                    placeholder="Tell us what memory or occasion you want to celebrate..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-[120px]"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full gap-2 shadow-card hover:shadow-elevated"
                  >
                    <Send className="h-4 w-4" />
                    <span>Continue on WhatsApp</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
