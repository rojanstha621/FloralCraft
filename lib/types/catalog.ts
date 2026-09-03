export interface CatalogImage {
  id?: string;
  url: string;
  alt?: string | null;
  primary?: boolean;
  sortOrder?: number;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogProductType {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  featured: boolean;
  available: boolean;
  customizable: boolean;
  customizationSummary?: string | null;
  dimensions?: string | null;
  materials?: string | null;
  preparationDays?: number | null;
  categoryId: string;
  category: CatalogCategory;
  productType: CatalogProductType;
  images: CatalogImage[];
  averageRating: number;
  reviewCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
