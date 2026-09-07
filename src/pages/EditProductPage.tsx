import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductForm } from '../components/ProductForm';
import { useProductCreation } from '../context/ProductCreationContext';
import { fetchProductById, updateProduct } from '../api/productApi';
import { Product } from '../types';

export const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();

  const isCreationFlow = location.pathname.includes('/add-product/');
  const { draftProduct, updateDraftProduct } = useProductCreation();

  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!isCreationFlow);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isCreationFlow && id) {
      loadExisting(id);
    }
  }, [id, isCreationFlow]);

  const loadExisting = async (productId: string) => {
    setIsLoading(true);
    try {
      const prod = await fetchProductById(productId);
      setExistingProduct(prod);
    } catch (e) {
      console.error('Error loading product for edit:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (values: Partial<Product>) => {
    setIsSaving(true);
    try {
      if (isCreationFlow) {
        // Save back into draft context and go back to generated listing
        updateDraftProduct(values);
        navigate('/add-product/generated');
      } else if (id) {
        // Update stored product
        await updateProduct(id, values);
        navigate(`/products/${id}`);
      }
    } catch (err) {
      console.error('Error saving edits:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const activeValues = isCreationFlow ? draftProduct : existingProduct || {};

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title={isCreationFlow ? 'Edit Draft Listing' : 'Edit Product'}
        showBack
        onBack={() => {
          if (isCreationFlow) {
            navigate('/add-product/generated');
          } else if (id) {
            navigate(`/products/${id}`);
          } else {
            navigate(-1);
          }
        }}
      />

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Artisan Customization
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
            Modify Product Details
          </h2>
          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
            Ensure your traditional materials and craft methods are accurately represented.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-stone-500 text-sm">
            Loading details...
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs">
            <ProductForm
              initialValues={activeValues}
              onSubmit={handleFormSubmit}
              submitLabel={isCreationFlow ? 'Update & Return' : 'Save Changes'}
              isSaving={isSaving}
            />
          </div>
        )}
      </main>
    </div>
  );
};
