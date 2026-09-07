import { MarketplaceListing } from '../types';

const STORAGE_KEY = 'karigan_marketplace_listings_v1';

export const CONNECTED_MARKETPLACES = [
  {
    id: 'ondc',
    name: 'ONDC Network',
    badge: 'Govt Protocol',
    description: 'Open Network for Digital Commerce connecting direct buyers across India.',
    supportedTypes: ['product', 'raw_material'],
  },
  {
    id: 'gem',
    name: 'GeM (Govt e-Marketplace)',
    badge: 'Public Procurement',
    description: 'Direct procurement portal for government departments and institutions.',
    supportedTypes: ['product', 'raw_material'],
  },
  {
    id: 'amazon_karigar',
    name: 'Amazon Karigar',
    badge: 'National Reach',
    description: 'Specialized storefront showcasing authentic Indian handlooms & handicrafts.',
    supportedTypes: ['product'],
  },
  {
    id: 'craftsvilla',
    name: 'Craftsvilla / Open Artisan Hub',
    badge: 'Direct Consumer',
    description: 'Dedicated ethnic marketplace for verified rural artisans and SHGs.',
    supportedTypes: ['product', 'raw_material'],
  },
];

export const marketplaceService = {
  getPublishedListings(): MarketplaceListing[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading marketplace listings', e);
      return [];
    }
  },

  getListingByItemId(itemId: string): MarketplaceListing | undefined {
    const list = this.getPublishedListings();
    return list.find((l) => l.itemId === itemId);
  },

  async publishListing(listing: Omit<MarketplaceListing, 'id' | 'status' | 'publishedAt'>): Promise<MarketplaceListing> {
    // Artificial small delay simulating marketplace catalog gateway registration
    await new Promise((resolve) => setTimeout(resolve, 800));

    const list = this.getPublishedListings();
    const existingIndex = list.findIndex((l) => l.itemId === listing.itemId);

    const fullListing: MarketplaceListing = {
      ...listing,
      id: existingIndex !== -1 ? list[existingIndex].id : `listing-${Date.now().toString(36)}`,
      status: 'published',
      publishedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      list[existingIndex] = fullListing;
    } else {
      list.unshift(fullListing);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return fullListing;
  },

  getListingStatus(listingId: string): MarketplaceListing | undefined {
    const list = this.getPublishedListings();
    return list.find((l) => l.id === listingId);
  },
};
