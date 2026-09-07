import { CraftStory } from '../types';

export const craftStoryService = {
  generateStoryFromInput(rawArtisanSpeechOrText: string, productName?: string, material?: string): CraftStory {
    const clean = (rawArtisanSpeechOrText || '').trim();
    const item = productName || 'artisan handicraft';
    const mat = material || 'natural sustainable materials';

    if (!clean) {
      return {
        shortStory: `Every piece of this ${item} is individually handcrafted using ${mat} gathered from regional sustainable sources.`,
        craftHeritage: 'Shaped following time-honored artisanal craft traditions passed down through generations of rural craftspeople.',
        handmadeDetails: '100% handmade without industrial machinery, ensuring unique texture and organic durability in every single fold.',
        artisanNote: 'Created with care to support rural artisan livelihoods and eco-conscious living.',
      };
    }

    return {
      shortStory: `"${clean}" — This authentic ${item} carries the personal imprint of its artisan maker, turning raw ${mat} into enduring utilitarian art.`,
      craftHeritage: `Rooted in deep rural handcraft techniques, celebrating indigenous knowledge of sustainable harvesting and artisanal shaping.`,
      handmadeDetails: `Painstakingly formed by hand over several hours of skilled effort. Each piece exhibits natural tactile qualities unique to slow craft.`,
      artisanNote: clean,
    };
  },
};
