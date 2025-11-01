"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { formatVND } from "@/lib/currency";

interface Product {
  id: number;
  name: string;
  description: string;
  published: boolean;
  variants?: Variant[];
}

interface Variant {
  id: number;
  sku: string;
  attributes?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  price: number | string;
  stock: number;
}

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isCustomer } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProduct(Number(params.id));
    }
  }, [params.id]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/catalog/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        
        // Auto-select first variant if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } else {
        setMessage({ type: 'error', text: 'Product not found' });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage({ type: 'error', text: 'Failed to load product' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!selectedVariant) {
      setMessage({ type: 'error', text: 'Please select a variant' });
      return;
    }

    if (selectedVariant.stock < quantity) {
      setMessage({ type: 'error', text: 'Not enough stock available' });
      return;
    }

    try {
      setAddingToCart(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch("http://localhost:3000/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variant_id: selectedVariant.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Added to cart successfully!' });
        setQuantity(1);
        
        // Redirect to cart after 1.5 seconds
        setTimeout(() => {
          router.push('/cart');
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to add to cart' });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage({ type: 'error', text: 'Failed to add to cart' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleEdit = () => {
    router.push(`/products/${product?.id}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadCrumb pageTitle={product.name} />

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-stroke dark:border-gray-800 p-8">
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={`/images/products/product-${product.id}.jpg`}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Fallback to placeholder if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <span class="text-gray-400 text-lg">No Image Available</span>
                `;
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-stroke dark:border-gray-800 p-8 flex flex-col justify-between min-h-[700px]">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.published
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {product.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Variant
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {variant.attributes?.size && `Size: ${variant.attributes.size}`}
                      {variant.attributes?.color && ` • ${variant.attributes.color}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {variant.sku}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatVND(variant.price)}
                      </span>
                      <span className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variant.stock > 0 ? `Stock: ${variant.stock}` : 'Out of stock'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

            {/* Selected Variant Info */}
            {selectedVariant && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatVND(selectedVariant.price)}
                  </span>
                  <span className={`font-medium ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Message Alert */}
            {message && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Customer: Quantity Controls */}
            {isCustomer && selectedVariant && (
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={selectedVariant.stock === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedVariant.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant.stock, Number(e.target.value))))}
                    className="w-20 text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                    disabled={selectedVariant.stock === 0}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={selectedVariant.stock === 0}
                  >
                    +
                  </button>
                </div>
                {selectedVariant.stock === 0 && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Out of stock
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons at Bottom */}
          <div className="mt-auto space-y-3">
            {/* Admin: Edit Button */}
            {isAdmin && (
              <button
                onClick={handleEdit}
                className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Edit Product
              </button>
            )}

            {/* Customer: Add to Cart Button */}
            {isCustomer && (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            )}

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back to {isAdmin ? 'Products' : 'Shop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
