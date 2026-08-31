"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@petalcraftflorals.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in both localStorage and cookies
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_name", data.admin.name);
        
        // Set cookie for middleware
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400`; // 24 hours
        
        router.push("/admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-100/40 flex items-center justify-center py-10 px-4">
      <Container size="sm">
        <div className="rounded-3xl border border-brand-beige-300 bg-white p-8 md:p-12 shadow-card space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="pink" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Protected Access</span>
              </Badge>
            </div>
            <Heading as="h1" size="2xl" className="font-serif">
              Admin Login
            </Heading>
            <Text className="text-brand-brown-400">
              Petal Craft Florals Studio Management
            </Text>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-brand-brown">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@petalcraftflorals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-brand-brown">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-brown-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-brand-beige-200 space-y-3">
            <div className="bg-brand-cream-100 rounded-xl p-3 text-xs text-brand-brown-600">
              <p className="font-semibold mb-1">Default Credentials:</p>
              <p>Email: admin@petalcraftflorals.com</p>
              <p>Password: ChangeMeInProd123!</p>
            </div>
            <div className="text-center">
              <Link href="/" className="text-sm text-brand-brown-400 hover:text-brand-pink-600 transition-colors">
                ← Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}