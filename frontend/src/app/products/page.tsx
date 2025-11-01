'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productsAPI, Product } from '@/lib/api';
import { formatVND } from '@/lib/currency';
import { guestCart } from '@/lib/guestCart';

export default function ProductsPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // No auth redirect - allow guests to browse products

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (product: Product) => {
    const newName = prompt('Enter new product name:', product.name);
    if (!newName || newName === product.name) return;

    try {
      await productsAPI.update(product.id, { name: newName });
      await loadProducts(); // Reload list
    } catch (err: any) {
      alert(`Error updating product: ${err.message}`);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete product "${product.name}"? This cannot be undone.`)) return;

    try {
      await productsAPI.delete(product.id);
      await loadProducts(); // Reload list
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  const handleQuickAddToCart = async (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      // Nếu không có variant, chuyển đến trang chi tiết
      router.push(`/products/${product.id}`);
      return;
    }

    // Tự động chọn variant đầu tiên
    const firstVariant = product.variants[0];
    
    if (firstVariant.stock === 0) {
      alert('This variant is out of stock. Please view details to select another variant.');
      return;
    }

    try {
      setAddingToCart(product.id);
      
      if (isAuthenticated) {
        // Authenticated user - add to backend cart
        const token = localStorage.getItem('access_token');
        
        const response = await fetch('http://localhost:3000/cart/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            variant_id: firstVariant.id,
            quantity: 1,
            price: firstVariant.price,
          }),
        });

        if (response.ok) {
          alert(`Added "${product.name}" to cart!`);
          setTimeout(() => {
            router.push('/cart');
          }, 500);
        } else {
          const errorData = await response.json();
          alert(`Failed to add to cart: ${errorData.message || 'Unknown error'}`);
        }
      } else {
        // Guest user - add to localStorage cart
        guestCart.addItem({
          variant_id: firstVariant.id,
          product_name: product.name,
          variant_name: firstVariant.size || firstVariant.sku,
          quantity: 1,
          price: Number(firstVariant.price),
          sku: firstVariant.sku,
        });
        
        alert(`Added "${product.name}" to cart!`);
        setTimeout(() => {
          router.push('/cart');
        }, 500);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAdmin ? 'Products Management' : 'Shop Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isAdmin ? 'Manage your product catalog' : 'Browse our products'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
              No products found
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`/images/products/product-${product.id}.png`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      `;
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    {product.published && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ml-2 flex-shrink-0">
                        Published
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>
                  
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatVND(product.variants[0].price)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {/* Quick Add to Cart Button - Thêm variant đầu tiên vào cart */}
                      <button
                        onClick={() => handleQuickAddToCart(product)}
                        className="flex-1 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add to Cart"
                      >
                        {addingToCart === product.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                      </button>
                      {/* View Details Button */}
                      <button
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
