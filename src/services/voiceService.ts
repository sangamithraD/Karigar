import { VoiceCommandResult, VoiceIntentType } from '../types';

export const QUICK_VOICE_COMMANDS = [
  'Add a product',
  'What can I make?',
  'Show my materials',
  'Add bamboo as raw material',
  'Find a tutorial',
  'Show my products',
  'Create a listing',
  'Show my published products',
];

export const voiceService = {
  detectIntent(transcript: string): VoiceCommandResult {
    const text = transcript.toLowerCase().trim();

    // 1. ADD_RAW_MATERIAL
    // e.g. "Add bamboo as a raw material", "Add clay raw material", "Add raw material"
    if (
      text.includes('raw material') &&
      (text.includes('add') || text.includes('record') || text.includes('save') || text.includes('new'))
    ) {
      let materialName = 'Natural Material';
      const match = text.match(/add\s+([a-zA-Z\s]+?)\s+(as|to|into|raw)/i);
      if (match && match[1]) {
        materialName = match[1].trim();
      } else if (text.includes('bamboo')) {
        materialName = 'Bamboo';
      } else if (text.includes('clay')) {
        materialName = 'Terracotta Clay';
      } else if (text.includes('cotton')) {
        materialName = 'Cotton Yarn';
      } else if (text.includes('palm')) {
        materialName = 'Palm Leaves';
      }

      return {
        intent: 'ADD_RAW_MATERIAL',
        parameters: { materialName },
        transcript,
        feedbackMessage: `Adding ${materialName} to your raw materials inventory.`,
        actionExecuted: true,
      };
    }

    // 2. GENERATE_PRODUCT_IDEAS / "WHAT CAN I MAKE"
    // e.g. "What can I make with bamboo?", "Give me ideas using the materials I have", "What can I make"
    if (
      text.includes('what can i make') ||
      text.includes('give me ideas') ||
      text.includes('product ideas') ||
      text.includes('make with')
    ) {
      let materialHint = '';
      if (text.includes('bamboo')) materialHint = 'Bamboo Poles';
      else if (text.includes('clay')) materialHint = 'River Terracotta Clay';
      else if (text.includes('cotton')) materialHint = 'Organic Cotton Yarn';
      else if (text.includes('palm')) materialHint = 'Sun-Dried Palm Fronds';

      return {
        intent: 'GENERATE_PRODUCT_IDEAS',
        parameters: { material: materialHint },
        transcript,
        feedbackMessage: materialHint
          ? `Finding craft product ideas for ${materialHint}.`
          : `Exploring product ideas from your stored raw materials.`,
        actionExecuted: true,
      };
    }

    // 3. FIND_TUTORIAL
    // e.g. "Show me a tutorial for making a bamboo basket", "Find a tutorial", "Learn how to make"
    if (
      text.includes('tutorial') ||
      text.includes('learn how') ||
      text.includes('video') ||
      text.includes('how to make')
    ) {
      let query = '';
      if (text.includes('bamboo')) query = 'bamboo';
      else if (text.includes('basket')) query = 'basket';
      else if (text.includes('pottery') || text.includes('clay') || text.includes('pitcher')) query = 'pottery';
      else if (text.includes('diya')) query = 'diya';
      else if (text.includes('cotton') || text.includes('loom') || text.includes('tote')) query = 'handloom';
      else if (text.includes('palm')) query = 'palm';

      return {
        intent: 'FIND_TUTORIAL',
        parameters: { query },
        transcript,
        feedbackMessage: query
          ? `Opening craft learning tutorials for ${query}.`
          : `Opening Craft Learning Hub tutorials.`,
        actionExecuted: true,
      };
    }

    // 4. UPDATE_PRICE
    // e.g. "Change the price of this product to 500 rupees", "Set price 650"
    if (
      (text.includes('price') || text.includes('rupees') || text.includes('cost')) &&
      (text.includes('change') || text.includes('update') || text.includes('set') || text.includes('make'))
    ) {
      const matchNumber = text.match(/(\d+)/);
      const newPrice = matchNumber ? parseInt(matchNumber[1], 10) : 500;

      return {
        intent: 'UPDATE_PRICE',
        parameters: { price: newPrice },
        transcript,
        feedbackMessage: `Updating product price to ₹${newPrice}.`,
        actionExecuted: true,
        requiresConfirmation: false,
      };
    }

    // 5. CREATE_LISTING
    // e.g. "Create a listing for this product", "Create listing", "Prepare listing"
    if (text.includes('create a listing') || text.includes('create listing') || text.includes('prepare listing')) {
      return {
        intent: 'CREATE_LISTING',
        parameters: {},
        transcript,
        feedbackMessage: 'Opening marketplace listing generator.',
        actionExecuted: true,
      };
    }

    // 6. PUBLISH_PRODUCT
    // e.g. "Publish this product", "Publish to marketplace", "Publish"
    if (text.includes('publish') && !text.includes('show published')) {
      return {
        intent: 'PUBLISH_PRODUCT',
        parameters: {},
        transcript,
        feedbackMessage: 'Opening marketplace channels to publish listing.',
        actionExecuted: true,
      };
    }

    // 7. VIEW_PUBLISHED_PRODUCTS
    // e.g. "Show my published products", "Show published", "View marketplace listings"
    if (text.includes('published products') || text.includes('show published') || text.includes('my marketplace')) {
      return {
        intent: 'VIEW_PUBLISHED_PRODUCTS',
        parameters: {},
        transcript,
        feedbackMessage: 'Navigating to your published marketplace listings.',
        actionExecuted: true,
      };
    }

    // 8. ADD_PRODUCT
    // e.g. "Add this product to my catalog", "Add a product", "New product"
    if (
      (text.includes('product') || text.includes('item')) &&
      (text.includes('add') || text.includes('new') || text.includes('create') || text.includes('upload'))
    ) {
      return {
        intent: 'ADD_PRODUCT',
        parameters: {},
        transcript,
        feedbackMessage: 'Starting new product photo and voice capture flow.',
        actionExecuted: true,
      };
    }

    // 9. VIEW_PRODUCTS / CATALOG
    // e.g. "Show my products", "View catalog", "Open products"
    if (
      text.includes('show my products') ||
      text.includes('show products') ||
      text.includes('view catalog') ||
      text.includes('my catalog') ||
      text.includes('open products')
    ) {
      return {
        intent: 'VIEW_PRODUCTS',
        parameters: {},
        transcript,
        feedbackMessage: 'Opening your handcrafted product catalog.',
        actionExecuted: true,
      };
    }

    // 10. VIEW_RAW_MATERIALS
    // e.g. "Show my raw materials", "Show materials", "View raw materials", "My materials"
    if (
      text.includes('raw material') ||
      text.includes('show materials') ||
      text.includes('my materials') ||
      text.includes('stored materials')
    ) {
      return {
        intent: 'VIEW_RAW_MATERIALS',
        parameters: {},
        transcript,
        feedbackMessage: 'Opening your stored raw materials hub.',
        actionExecuted: true,
      };
    }

    // 11. SHOW_DASHBOARD
    if (text.includes('dashboard') || text.includes('home') || text.includes('main screen')) {
      return {
        intent: 'SHOW_DASHBOARD',
        parameters: {},
        transcript,
        feedbackMessage: 'Navigating to artisan studio home.',
        actionExecuted: true,
      };
    }

    // Unknown Fallback
    return {
      intent: 'UNKNOWN',
      parameters: { rawText: transcript },
      transcript,
      feedbackMessage: `Understood: "${transcript}". Try saying "Show my materials" or "What can I make?".`,
      actionExecuted: false,
    };
  },
};
