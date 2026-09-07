import { ProductIdea } from '../types';

const CURATED_IDEAS: ProductIdea[] = [
  {
    id: 'idea-bamboo-basket',
    name: 'Woven Bamboo Fruit & Bread Basket',
    description: 'A breathable, lightweight dining basket created using thin, interlocking bamboo splints and finished with a smooth sanded rim.',
    difficulty: 'Beginner',
    materials: ['Bamboo Poles', 'Natural Fiber'],
    estimatedEffort: '3–4 hours',
    estimatedPrice: 480,
    priceRange: '₹400–₹600',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-bamboo-planter',
    name: 'Eco Cylindrical Bamboo Desk Planter',
    description: 'Modern minimalist plant holder made from wide bamboo nodes with drainage slots and eco beeswax polish for home offices.',
    difficulty: 'Beginner',
    materials: ['Bamboo Poles'],
    estimatedEffort: '1.5–2 hours',
    estimatedPrice: 320,
    priceRange: '₹280–₹380',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-bamboo-lamp',
    name: 'Slatted Bamboo Pendant Lamp Shade',
    description: 'Contemporary hanging ceiling lamp crafted with bent bamboo ribs creating warm ambient shadow patterns.',
    difficulty: 'Intermediate',
    materials: ['Bamboo Poles', 'Natural Fiber'],
    estimatedEffort: '5–6 hours',
    estimatedPrice: 850,
    priceRange: '₹750–₹1,100',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-clay-matka',
    name: 'Terracotta Natural Cooling Water Pitcher',
    description: 'Traditional earthen clay jug with microporous walls providing natural alkaline water cooling, fitted with a terracotta lid.',
    difficulty: 'Intermediate',
    materials: ['River Terracotta Clay'],
    estimatedEffort: '4–5 hours',
    estimatedPrice: 380,
    priceRange: '₹320–₹450',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-clay-diyas',
    name: 'Decorative Handcrafted Clay Diya Set (Pack of 6)',
    description: 'Artisanal festive oil lamps shaped by hand with scalloped petal rims and earthen terracotta wash.',
    difficulty: 'Beginner',
    materials: ['River Terracotta Clay'],
    estimatedEffort: '2–3 hours',
    estimatedPrice: 260,
    priceRange: '₹220–₹320',
    imageUrl: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-cotton-tote',
    name: 'Handwoven Cotton Tote Market Bag',
    description: 'Sturdy reusable grocery and daily tote bag handwoven on a traditional pit-loom with reinforced box handles.',
    difficulty: 'Intermediate',
    materials: ['Organic Cotton Yarn'],
    estimatedEffort: '4–6 hours',
    estimatedPrice: 520,
    priceRange: '₹450–₹650',
    imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5f45833882?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-palm-placemats',
    name: 'Sun-Dried Palm Leaf Placemats (Set of 4)',
    description: 'Heat-resistant, rustic dining table mats hand-braided from sun-cured date palm leaves with natural fringe edges.',
    difficulty: 'Beginner',
    materials: ['Sun-Dried Palm Fronds'],
    estimatedEffort: '3–4 hours',
    estimatedPrice: 420,
    priceRange: '₹350–₹500',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'idea-hybrid-basket',
    name: 'Hybrid Bamboo & Palm Storage Hamper',
    description: 'Rigid bamboo vertical structural frame interlaced with supple braided palm leaf ribbons for lightweight laundry storage.',
    difficulty: 'Advanced',
    materials: ['Bamboo Poles', 'Sun-Dried Palm Fronds'],
    estimatedEffort: '6–8 hours',
    estimatedPrice: 950,
    priceRange: '₹850–₹1,250',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
  },
];

export const ideaService = {
  getAllIdeas(): ProductIdea[] {
    return CURATED_IDEAS;
  },

  async generateProductIdeas(selectedMaterialNames: string[]): Promise<ProductIdea[]> {
    // Artificial small delay to simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!selectedMaterialNames || selectedMaterialNames.length === 0) {
      return CURATED_IDEAS.slice(0, 4);
    }

    const lowerSelected = selectedMaterialNames.map((m) => m.toLowerCase());

    const matched = CURATED_IDEAS.filter((idea) => {
      return idea.materials.some((mat) =>
        lowerSelected.some(
          (sel) => mat.toLowerCase().includes(sel) || sel.includes(mat.toLowerCase())
        )
      );
    });

    if (matched.length > 0) {
      return matched;
    }

    // Dynamic AI synthesis fallback if unusual custom material entered
    const primaryMat = selectedMaterialNames[0];
    return [
      {
        id: `idea-custom-${Date.now()}`,
        name: `Handcrafted ${primaryMat} Utility Vessel`,
        description: `Functional eco-friendly home craft created through traditional artisanal shaping using your stored ${primaryMat}.`,
        difficulty: 'Beginner',
        materials: selectedMaterialNames,
        estimatedEffort: '3–4 hours',
        estimatedPrice: 450,
        priceRange: '₹380–₹550',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
      },
      ...CURATED_IDEAS.slice(0, 3),
    ];
  },

  getIdeaById(id: string): ProductIdea | undefined {
    return CURATED_IDEAS.find((i) => i.id === id);
  },
};
