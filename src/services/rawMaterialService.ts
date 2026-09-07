import { RawMaterial } from '../types';

const STORAGE_KEY = 'karigan_raw_materials_v1';

const INITIAL_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-001',
    name: 'Bamboo Poles',
    quantity: 12,
    unit: 'kg',
    category: 'Natural Fiber & Wood',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    notes: 'Seasoned flexible bamboo suitable for basketry, trays, and home decor.',
    createdAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'mat-002',
    name: 'River Terracotta Clay',
    quantity: 25,
    unit: 'kg',
    category: 'Pottery & Clay',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    notes: 'Refined natural earthen clay prepared for pottery and diya making.',
    createdAt: '2026-09-05T11:30:00Z',
  },
  {
    id: 'mat-003',
    name: 'Organic Cotton Yarn',
    quantity: 6,
    unit: 'kg',
    category: 'Textiles & Loom',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    notes: 'Handspun unbleached cotton skeins for handloom weaving.',
    createdAt: '2026-09-06T08:15:00Z',
  },
  {
    id: 'mat-004',
    name: 'Sun-Dried Palm Fronds',
    quantity: 8,
    unit: 'bundles',
    category: 'Natural Fiber & Wood',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    notes: 'Sun-cured palm leaves ideal for table mats and eco storage baskets.',
    createdAt: '2026-09-06T14:40:00Z',
  },
];

export const rawMaterialService = {
  getRawMaterials(): RawMaterial[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MATERIALS));
        return INITIAL_MATERIALS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load raw materials from storage', e);
      return INITIAL_MATERIALS;
    }
  },

  getRawMaterialById(id: string): RawMaterial | undefined {
    const all = this.getRawMaterials();
    return all.find((m) => m.id === id);
  },

  saveRawMaterial(material: Omit<RawMaterial, 'id' | 'createdAt'> & { id?: string }): RawMaterial {
    const all = this.getRawMaterials();
    if (material.id) {
      const index = all.findIndex((m) => m.id === material.id);
      if (index !== -1) {
        const updated: RawMaterial = {
          ...all[index],
          ...material,
        };
        all[index] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return updated;
      }
    }

    const newMaterial: RawMaterial = {
      id: `mat-${Date.now().toString(36)}`,
      name: material.name,
      quantity: Number(material.quantity) || 1,
      unit: material.unit || 'kg',
      category: material.category || 'Natural Material',
      imageUrl:
        material.imageUrl ||
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      notes: material.notes || '',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newMaterial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newMaterial;
  },

  deleteRawMaterial(id: string): boolean {
    const all = this.getRawMaterials();
    const filtered = all.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  resetRawMaterials(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MATERIALS));
  },
};
