import { TutorialVideo } from '../types';

const CURATED_TUTORIALS: TutorialVideo[] = [
  {
    id: 'tut-bamboo-basket-01',
    title: 'How to Weave a Traditional Bamboo Basket from Scratch',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=traditional+bamboo+basket+weaving+tutorial',
    language: 'English / Visual Guide',
    difficulty: 'Beginner',
    duration: '18 mins',
    materialCategory: 'Natural Fiber & Wood',
    craftType: 'Basketry',
    productIdeaName: 'Woven Bamboo Fruit & Bread Basket',
  },
  {
    id: 'tut-bamboo-splints-02',
    title: 'Splitting and Seasoning Green Bamboo for Craft Making',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+split+bamboo+strips+for+crafts',
    language: 'English / Demonstrative',
    difficulty: 'Beginner',
    duration: '12 mins',
    materialCategory: 'Natural Fiber & Wood',
    craftType: 'Bamboo Craft',
    productIdeaName: 'Eco Cylindrical Bamboo Desk Planter',
  },
  {
    id: 'tut-clay-pottery-01',
    title: 'Centering and Shaping Clay on the Traditional Potter Wheel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=traditional+pottery+wheel+throwing+technique',
    language: 'English',
    difficulty: 'Intermediate',
    duration: '24 mins',
    materialCategory: 'Pottery & Clay',
    craftType: 'Pottery',
    productIdeaName: 'Terracotta Natural Cooling Water Pitcher',
  },
  {
    id: 'tut-clay-diya-02',
    title: 'Making Traditional Decorative Terracotta Diyas by Hand',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=handmade+terracotta+diya+making+step+by+step',
    language: 'English / Visual',
    difficulty: 'Beginner',
    duration: '14 mins',
    materialCategory: 'Pottery & Clay',
    craftType: 'Hand Pottery',
    productIdeaName: 'Decorative Handcrafted Clay Diya Set (Pack of 6)',
  },
  {
    id: 'tut-cotton-loom-01',
    title: 'Handloom Cotton Weaving: Warp, Weft and Edge Finishing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=traditional+handloom+cotton+tote+weaving',
    language: 'English',
    difficulty: 'Intermediate',
    duration: '22 mins',
    materialCategory: 'Textiles & Loom',
    craftType: 'Handloom',
    productIdeaName: 'Handwoven Cotton Tote Market Bag',
  },
  {
    id: 'tut-palm-placemats-01',
    title: 'Braiding Wild Palm Leaves into Sturdy Dining Placemats',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=palm+leaf+weaving+placemat+tutorial',
    language: 'English / Visual',
    difficulty: 'Beginner',
    duration: '15 mins',
    materialCategory: 'Natural Fiber & Wood',
    craftType: 'Palm Leaf Craft',
    productIdeaName: 'Sun-Dried Palm Leaf Placemats (Set of 4)',
  },
];

export const tutorialService = {
  getTutorials(filter?: {
    materialCategory?: string;
    productIdea?: string;
    difficulty?: string;
    searchQuery?: string;
  }): TutorialVideo[] {
    let list = CURATED_TUTORIALS;

    if (!filter) return list;

    if (filter.materialCategory && filter.materialCategory !== 'All') {
      list = list.filter((t) =>
        t.materialCategory.toLowerCase().includes(filter.materialCategory!.toLowerCase())
      );
    }

    if (filter.difficulty && filter.difficulty !== 'All') {
      list = list.filter((t) => t.difficulty === filter.difficulty);
    }

    if (filter.productIdea) {
      const q = filter.productIdea.toLowerCase();
      const matched = list.filter(
        (t) =>
          t.productIdeaName?.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q)
      );
      if (matched.length > 0) return matched;
    }

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.craftType?.toLowerCase().includes(q) ||
          t.materialCategory.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getTutorialById(id: string): TutorialVideo | undefined {
    return CURATED_TUTORIALS.find((t) => t.id === id);
  },
};
