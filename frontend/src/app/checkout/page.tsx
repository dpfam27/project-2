'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cartAPI, Cart, CartItem } from '@/lib/api';
import { formatVND } from '@/lib/currency';
import { guestCart } from '@/lib/guestCart';
import LoginModal from '@/components/auth/LoginModal';

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Don't redirect - show login modal instead
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        loadCart();
      } else {
        // Guest user - show modal after cart loads
        setLoading(false);
        setShowLoginModal(true);
      }
    }
  }, [authLoading, isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (err: any) {
      if (err.message.includes('404')) {
        setCart({ id: 0, user_id: 0, items: [], created_at: '', updated_at: '' });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await cartAPI.updateItem(itemId, { quantity });
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await cartAPI.removeItem(itemId);
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const checkoutData = {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
        },
        items: cart.items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        shipping_fee: 30000,
        coupon_code: couponCode || undefined,
      };

      const response = await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const result = await response.json();
      
      // Clear cart after successful checkout
      await cartAPI.clear();
      
      // Redirect to orders page
      router.push('/orders?success=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const subtotal = calculateSubtotal();
  const shipping = 30000; // Fixed shipping fee for demo (30,000 VND)
  const total = subtotal + shipping;

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    
    // Sync guest cart with backend after login
    const guestItems = guestCart.get();
    if (guestItems.length > 0) {
      try {
        for (const item of guestItems) {
          await fetch('http://localhost:3000/cart/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              variant_id: item.variant_id,
              quantity: item.quantity,
              price: item.price,
            }),
          });
        }
        guestCart.clear(); // Clear guest cart after sync
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    }
    
    // Load cart from backend
    await loadCart();
  };

  return (
    <div className="p-6">
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => router.push('/products')}
        onSuccess={handleLoginSuccess}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Complete your order</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Cart Items ({cart?.items.length || 0})
            </h2>

            {!cart || cart.items.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.variant?.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.variant?.attributes?.size && `Size: ${item.variant.attributes.size}`}
                        {item.variant?.attributes?.color && ` • ${item.variant.attributes.color}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formatVND(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>

                      <p className="w-24 text-right font-semibold text-gray-900 dark:text-white">
                        {formatVND(Number(item.price) * item.quantity)}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Information Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Customer Information
            </h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coupon Code (optional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{formatVND(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || !cart || cart.items.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
