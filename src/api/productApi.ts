import { INITIAL_MOCK_PRODUCTS } from '../data/mockProducts';
import { Product } from '../types';
import { apiRequest, isMockModeEnabled } from './apiClient';

const STORAGE_KEY = 'sih_artisan_products_v1';

function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PRODUCTS));
      return INITIAL_MOCK_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading products from localStorage', e);
    return INITIAL_MOCK_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed saving products to localStorage', e);
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (isMockModeEnabled()) {
    return getLocalProducts();
  }

  try {
    const products = await apiRequest<Product[]>('/api/products');
    // Keep local cache updated for offline resilience
    saveLocalProducts(products);
    return products;
  } catch (err) {
    console.warn('Backend /api/products unreachable, serving cached catalog', err);
    return getLocalProducts();
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (isMockModeEnabled()) {
    const products = getLocalProducts();
    return products.find((p) => p.id === id) || null;
  }

  try {
    return await apiRequest<Product>(`/api/products/${encodeURIComponent(id)}`);
  } catch (err) {
    console.warn(`Backend /api/products/${id} unreachable, checking cache`, err);
    const products = getLocalProducts();
    return products.find((p) => p.id === id) || null;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newId = `prod-${Date.now().toString(36)}`;
  const newProduct: Product = {
    ...product,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  if (isMockModeEnabled()) {
    const products = getLocalProducts();
    const updated = [newProduct, ...products];
    saveLocalProducts(updated);
    return newProduct;
  }

  try {
    const created = await apiRequest<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    // Update local cache
    const current = getLocalProducts();
    saveLocalProducts([created, ...current]);
    return created;
  } catch (err) {
    console.warn('Backend /api/products create failed, saving locally', err);
    const products = getLocalProducts();
    const updated = [newProduct, ...products];
    saveLocalProducts(updated);
    return newProduct;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  if (isMockModeEnabled()) {
    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    const updated: Product = {
      ...products[index],
      ...updates,
      id,
    };
    products[index] = updated;
    saveLocalProducts(products);
    return updated;
  }

  try {
    const updated = await apiRequest<Product>(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    const products = getLocalProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = updated;
      saveLocalProducts(products);
    }
    return updated;
  } catch (err) {
    console.warn(`Backend /api/products/${id} update failed, applying locally`, err);
    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    const updated: Product = {
      ...products[index],
      ...updates,
      id,
    };
    products[index] = updated;
    saveLocalProducts(products);
    return updated;
  }
}

export async function resetMockDataToDefault(): Promise<Product[]> {
  saveLocalProducts(INITIAL_MOCK_PRODUCTS);
  return INITIAL_MOCK_PRODUCTS;
}
