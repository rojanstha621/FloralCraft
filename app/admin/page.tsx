"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { PRODUCTS, ProductData } from "@/lib/data/products";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Check,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Star,
  Truck,
  DollarSign,
  LogOut,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  area: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  status: "PENDING" | "PAID" | "IN_PRODUCTION" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  itemsCount: number;
  createdAt: string;
  customization?: {
    frameColor: string;
    flowerStyle: string;
    photoUrl: string;
    messageText: string;
    recipientName: string;
  };
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-101",
    orderNumber: "PC-20250829-8492",
    customerName: "Suman Shakya",
    customerPhone: "9841234567",
    customerEmail: "suman@gmail.com",
    area: "Jhamsikhel",
    city: "Lalitpur",
    totalAmount: 3299,
    paymentMethod: "ESEWA",
    status: "IN_PRODUCTION",
    itemsCount: 1,
    createdAt: "2025-08-29T10:30:00Z",
    customization: {
      frameColor: "Natural Teak",
      flowerStyle: "Pastel Blush & Rose",
      photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      messageText: "To my forever love on our 2nd anniversary.",
      recipientName: "Aaila & Suman",
    },
  },
  {
    id: "ord-102",
    orderNumber: "PC-20250829-7319",
    customerName: "Priyanka Gurung",
    customerPhone: "9808765432",
    customerEmail: "priyanka.g@yahoo.com",
    area: "Lazimpat",
    city: "Kathmandu",
    totalAmount: 2899,
    paymentMethod: "KHALTI",
    status: "PENDING",
    itemsCount: 1,
    createdAt: "2025-08-29T09:15:00Z",
    customization: {
      frameColor: "Nordic White",
      flowerStyle: "Ivory & Baby's Breath",
      photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
      messageText: "Happy Birthday Mom! Thank you for everything.",
      recipientName: "Mom",
    },
  },
  {
    id: "ord-103",
    orderNumber: "PC-20250828-6201",
    customerName: "Rohan Manandhar",
    customerPhone: "9851098765",
    customerEmail: "rohan.m@outlook.com",
    area: "Sanepa",
    city: "Lalitpur",
    totalAmount: 3599,
    paymentMethod: "CASH_ON_DELIVERY",
    status: "READY",
    itemsCount: 1,
    createdAt: "2025-08-28T14:45:00Z",
  },
  {
    id: "ord-104",
    orderNumber: "PC-20250827-5192",
    customerName: "Anjali Thapa",
    customerPhone: "9812345678",
    customerEmail: "anjali.thapa@gmail.com",
    area: "Baneshwor",
    city: "Kathmandu",
    totalAmount: 6198,
    paymentMethod: "ESEWA",
    status: "DELIVERED",
    itemsCount: 2,
    createdAt: "2025-08-27T11:20:00Z",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "reviews">("orders");
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductImages, setNewProductImages] = useState<{ url: string; alt?: string }[]>([]);

  useEffect(() => {
    // Check for authentication token in localStorage first
    const token = localStorage.getItem("admin_token");
    
    if (!token) {
      // If no token in localStorage, redirect to login
      router.push("/admin/login");
    } else {
      // Set cookie for middleware validation
      document.cookie = `admin_token=${token}; path=/; max-age=86400`;
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    // Clear the cookie as well
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream-100/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink-600 mx-auto"></div>
          <p className="mt-4 text-brand-brown-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const handleStatusChange = (orderId: string, newStatus: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== "ALL" && ord.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerPhone.includes(q)
      );
    }
    return true;
  });

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const inProductionCount = orders.filter((o) => o.status === "IN_PRODUCTION").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="py-10 md:py-16 bg-brand-cream-100/40 min-h-screen">
      <Container size="xl">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="pink">Studio Administration</Badge>
              <span className="text-xs text-brand-brown-400">Kathmandu Central</span>
            </div>
            <Heading as="h1" size="2xl" className="font-serif mt-1">
              Petal Craft Operations Dashboard
            </Heading>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 bg-white">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Storefront</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-1.5 bg-white border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-2">
            <div className="flex items-center justify-between text-brand-brown-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="h-5 w-5 text-brand-sage-700" />
            </div>
            <div className="font-serif text-2xl font-bold text-brand-brown">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-[11px] text-green-700 font-medium">↑ 18% from last week</p>
          </div>

          <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-2">
            <div className="flex items-center justify-between text-brand-brown-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <Package className="h-5 w-5 text-brand-pink-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-brand-brown">
              {orders.length} orders
            </div>
            <p className="text-[11px] text-brand-brown-400">Kathmandu Valley orders</p>
          </div>

          <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-2">
            <div className="flex items-center justify-between text-brand-brown-400">
              <span className="text-xs font-semibold uppercase tracking-wider">In Studio Production</span>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-brand-brown">
              {inProductionCount} keepsakes
            </div>
            <p className="text-[11px] text-amber-700 font-medium">Active artisan crafting</p>
          </div>

          <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-2">
            <div className="flex items-center justify-between text-brand-brown-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="font-serif text-2xl font-bold text-brand-brown">
              {pendingCount} requires action
            </div>
            <p className="text-[11px] text-red-600 font-medium">Verify payment / proof</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-brand-beige-300 gap-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === "orders"
                ? "text-brand-brown after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-brown"
                : "text-brand-brown-400 hover:text-brand-brown"
            }`}
          >
            Orders &amp; Keepsake Production ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === "products"
                ? "text-brand-brown after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-brown"
                : "text-brand-brown-400 hover:text-brand-brown"
            }`}
          >
            Product Catalog ({PRODUCTS.length})
          </button>
        </div>

        {/* Tab 1: Orders Pipeline */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-brown-400" />
                <Input
                  placeholder="Search order #, customer, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-medium text-brand-brown-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-2xl border border-brand-beige-400/60 bg-white px-3 text-xs text-brand-brown"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="IN_PRODUCTION">In Production</option>
                  <option value="READY">Ready</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-3xl border border-brand-beige-300 bg-white shadow-card">
              <table className="w-full text-left text-xs text-brand-brown">
                <thead className="border-b border-brand-beige-200 bg-brand-cream-100/70 text-[11px] font-bold uppercase tracking-wider text-brand-brown-500">
                  <tr>
                    <th className="px-6 py-4">Order #</th>
                    <th className="px-6 py-4">Customer &amp; Location</th>
                    <th className="px-6 py-4">Total &amp; Payment</th>
                    <th className="px-6 py-4">Custom Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige-200">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-cream-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-brand-brown">
                        {ord.orderNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-brand-brown">{ord.customerName}</div>
                        <div className="text-[11px] text-brand-brown-500">{ord.customerPhone}</div>
                        <div className="text-[10px] text-brand-sage-800">{ord.area}, {ord.city}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-serif font-bold text-sm text-brand-brown">
                          {formatCurrency(ord.totalAmount)}
                        </div>
                        <span className="rounded bg-brand-cream-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand-brown-600">
                          {ord.paymentMethod}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {ord.customization ? (
                          <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-brand-beige-300">
                              <Image
                                src={ord.customization.photoUrl}
                                alt="Customer Upload"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-[11px] text-brand-brown block truncate max-w-[120px]">
                                {ord.customization.frameColor}
                              </span>
                              <span className="text-[9px] text-brand-brown-400 block truncate max-w-[120px]">
                                {ord.customization.recipientName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-brand-brown-400 italic">Ready-made</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                            ord.status === "IN_PRODUCTION"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : ord.status === "DELIVERED"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : ord.status === "READY"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-brand-cream-200 text-brand-brown border border-brand-beige-400"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="IN_PRODUCTION">IN PRODUCTION</option>
                          <option value="READY">READY</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="soft"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => setSelectedOrder(ord)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Heading as="h2" size="xl" className="font-serif">
                Product Catalog
              </Heading>
              <Button onClick={() => setShowAddProductModal(true)} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Add New Product
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-4"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-cream-100">
                  <Image
                    src={prod.images[0]?.url || ""}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-800">
                    {prod.category}
                  </span>
                  <h3 className="font-serif font-semibold text-base text-brand-brown">
                    {prod.name}
                  </h3>
                  <p className="font-serif font-bold text-sm text-brand-brown mt-1">
                    {formatCurrency(prod.basePrice)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-brand-beige-200 pt-3 text-xs">
                  <span className="text-green-700 font-semibold">● Active in Store</span>
                  <Link href={`/products/${prod.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Page
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Customization Details Inspector Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown-900/50 backdrop-blur-xs animate-fadeIn">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-brand-beige-300 bg-white p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-brand-beige-200 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-brown">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-brand-brown-400">
                    Placed by {selectedOrder.customerName} ({selectedOrder.customerPhone})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full p-2 text-brand-brown-400 hover:bg-brand-cream-200"
                >
                  ✕
                </button>
              </div>

              {selectedOrder.customization ? (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-beige-300 bg-brand-cream-100">
                    <Image
                      src={selectedOrder.customization.photoUrl}
                      alt="Customer Uploaded Photo"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="rounded-2xl bg-brand-cream-100 p-4 space-y-2 text-xs text-brand-brown-700">
                    <div>
                      <span className="font-bold text-brand-brown">Frame Finish:</span>{" "}
                      {selectedOrder.customization.frameColor}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown">Flower Style:</span>{" "}
                      {selectedOrder.customization.flowerStyle}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown">Names:</span>{" "}
                      {selectedOrder.customization.recipientName}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown">Engraved Inscription:</span>
                      <p className="italic text-brand-brown-900 mt-1">
                        &ldquo;{selectedOrder.customization.messageText}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-brand-brown-500">
                  This order contains ready-made botanical gifts without custom photo attachments.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="primary" size="md" onClick={() => setSelectedOrder(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown-900/50 backdrop-blur-xs animate-fadeIn">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-brand-beige-300 bg-white p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-brand-beige-200 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-brown">
                    Add New Product
                  </h3>
                  <p className="text-xs text-brand-brown-400">
                    Add product images from external hosting services
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setNewProductImages([]);
                  }}
                  className="rounded-full p-2 text-brand-brown-400 hover:bg-brand-cream-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-brand-brown mb-3">Product Images</h4>
                  <ImageUploader
                    onImagesChange={setNewProductImages}
                    initialImages={newProductImages}
                    maxImages={5}
                    allowExternal={true}
                  />
                </div>

                {newProductImages.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <Check className="h-5 w-5" />
                      <span className="font-semibold text-sm">
                        {newProductImages.length} image(s) ready to add
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      These images will be saved with your product. URLs from free hosting services like ImgLink, im.ge, or 8upload work perfectly.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddProductModal(false);
                      setNewProductImages([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    disabled={newProductImages.length === 0}
                    onClick={() => {
                      // Here you would typically save the product with images
                      console.log("Product images:", newProductImages);
                      alert("Product images added! (In production, this would save to database)");
                      setShowAddProductModal(false);
                      setNewProductImages([]);
                    }}
                  >
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
