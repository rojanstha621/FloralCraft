"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Heart } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20">
      <Container size="xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <Badge variant="pink">Kathmandu Studio</Badge>
          <Heading as="h1" size="2xl" className="font-serif">
            Get in Touch with Our Artisans
          </Heading>
          <Text size="base" variant="muted" className="max-w-md mx-auto">
            Have questions about custom framing, bulk corporate gifting, or urgent anniversary deliveries? We would love to hear from you.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Studio Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-8 shadow-card space-y-6">
              <h3 className="font-serif font-semibold text-lg text-brand-brown border-b border-brand-beige-200 pb-3">
                Studio &amp; Contact Details
              </h3>

              <div className="space-y-4 text-xs text-brand-brown">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-pink-100 text-brand-brown">
                    <MapPin className="h-4 w-4 text-brand-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Artisan Workshop &amp; Studio</h4>
                    <p className="text-brand-brown-500 mt-0.5">
                      Jhamsikhel, Lalitpur (Near St. Mary&apos;s High School Road)<br />
                      Kathmandu Valley, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-sage-100 text-brand-brown">
                    <Phone className="h-4 w-4 text-brand-sage-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Phone / Mobile</h4>
                    <p className="text-brand-brown-500 mt-0.5">+977 980-1234567 / 01-5544332</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-beige-200 text-brand-brown">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Email Support</h4>
                    <p className="text-brand-brown-500 mt-0.5">hello@petalcraftflorals.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream-200 text-brand-brown">
                    <Clock className="h-4 w-4 text-brand-brown-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown">Opening Hours</h4>
                    <p className="text-brand-brown-500 mt-0.5">
                      Sunday – Friday: 10:00 AM – 6:30 PM<br />
                      Saturday: 11:00 AM – 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat */}
              <div className="pt-2 border-t border-brand-beige-200">
                <a
                  href="https://wa.me/9779801234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-600/30 bg-green-50 px-4 py-3 text-xs font-bold text-green-800 hover:bg-green-100 transition-colors shadow-subtle"
                >
                  <MessageCircle className="h-4 w-4 text-green-700" />
                  <span>Chat with Us on WhatsApp (Instant Reply)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-8 md:p-10 shadow-card">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-sage-100 text-brand-sage-800 mx-auto">
                    <Heart className="h-8 w-8 text-brand-pink-500 fill-brand-pink-200" />
                  </div>
                  <Heading as="h3" size="lg" className="font-serif">
                    Message Received!
                  </Heading>
                  <Text size="sm" variant="muted" className="max-w-xs mx-auto">
                    Thank you for reaching out. A Petal Craft artisan will reply to your message within a few hours.
                  </Text>
                  <div className="pt-4">
                    <Button variant="primary" size="md" onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif font-semibold text-lg text-brand-brown border-b border-brand-beige-200 pb-3">
                    Send an Inquiry
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1.5">
                      Your Full Name *
                    </label>
                    <Input
                      placeholder="e.g. Aayushma Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brand-brown mb-1.5">
                        Nepal Mobile Number
                      </label>
                      <Input
                        placeholder="98XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-brand-brown mb-1.5">
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
                    <label className="block text-xs font-medium text-brand-brown mb-1.5">
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
                    <Button type="submit" variant="primary" size="lg" className="w-full gap-2 shadow-card hover:shadow-elevated">
                      <Send className="h-4 w-4" />
                      <span>Send Message to Studio</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
