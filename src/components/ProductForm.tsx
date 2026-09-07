import React, { useState } from 'react';
import { Tag, Plus, X, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { InputField, TextareaField } from './InputField';
import { Button } from './Button';

interface ProductFormProps {
  initialValues: Partial<Product>;
  onSubmit: (values: Partial<Product>) => void;
  submitLabel?: string;
  isSaving?: boolean;
}

const COMMON_CATEGORIES = [
  'Bamboo & Natural Fiber',
  'Handloom Textiles',
  'Pottery & Clay',
  'Woodcraft & Lacquerware',
  'Jewelry & Ornaments',
  'Metalwork & Brass',
  'Leather & Traditional Footwear',
  'Folk Paintings & Wall Art',
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel = 'Save Product',
  isSaving = false,
}) => {
  const [productName, setProductName] = useState(initialValues.productName || '');
  const [category, setCategory] = useState(initialValues.category || COMMON_CATEGORIES[0]);
  const [material, setMaterial] = useState(initialValues.material || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [keywords, setKeywords] = useState<string[]>(initialValues.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddKeyword = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = newKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setFormError('Please enter a product name.');
      return;
    }
    setFormError(null);
    onSubmit({
      ...initialValues,
      productName: productName.trim(),
      category,
      material: material.trim(),
      description: description.trim(),
      keywords,
    });
  };

  return (
    <form id="artisan-product-form" onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Product Name */}
      <InputField
        label="Product Name"
        value={productName}
        onChange={(e) => {
          setProductName(e.target.value);
          if (formError) setFormError(null);
        }}
        placeholder="e.g. Handcrafted Palm Leaf Basket"
        hint="Clear, authentic name for marketplace buyers"
        error={formError || undefined}
        required
      />

      {/* Category Selection */}
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-base font-semibold text-stone-800 tracking-tight">
          Category
        </label>
        {/* Quick select pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {COMMON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full min-h-[50px] rounded-xl border-2 border-stone-300 bg-white text-stone-900 text-base font-medium px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
        >
          {COMMON_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Material */}
      <InputField
        label="Raw Material & Technique"
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
        placeholder="e.g. 100% Organic Handspun Cotton, River Clay"
        hint="Helps buyers appreciate your natural handcrafted ingredients"
      />

      {/* Description */}
      <TextareaField
        label="Artisan Story & Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe how it was crafted, benefits, durability, and care instructions..."
        hint="AI generated based on your voice description; edit freely"
      />

      {/* Keywords / Tags */}
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-base font-semibold text-stone-800 tracking-tight flex items-center justify-between">
          <span>Search Tags & Highlights</span>
          <span className="text-xs font-normal text-stone-500">Helps buyers find you</span>
        </label>

        {/* Existing tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-medium"
            >
              <Tag className="w-3 h-3 text-amber-700" />
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="hover:text-red-700 p-0.5"
                title="Remove tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add new keyword input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            placeholder="Add tag (e.g. Eco-friendly, Gift)"
            className="flex-1 min-h-[44px] rounded-xl border border-stone-300 bg-white text-stone-900 text-sm px-3.5 focus:outline-none focus:border-amber-600"
          />
          <button
            type="button"
            onClick={() => handleAddKeyword()}
            className="min-h-[44px] px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <Button
          type="submit"
          variant="warm"
          size="lg"
          fullWidth
          isLoading={isSaving}
          icon={<Check className="w-5 h-5" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
