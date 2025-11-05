"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  customer_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  order_number: string;
  customer?: {
    name: string;
    email: string;
  };
}

const OrdersPage = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:3000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // API returns { statusCode, message, data }
        let ordersData = result.data || result;
        ordersData = Array.isArray(ordersData) ? ordersData : [];
        
        // Filter orders by user role
        if (!isAdmin && user) {
          // Customer: show only their orders
          ordersData = ordersData.filter((order: Order) => order.customer_id === user.userId);
        }
        // Admin: show all orders (no filtering)
        
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh orders list
        fetchOrders();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to update status'}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "processing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "refunded":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      <PageBreadCrumb pageTitle={isAdmin ? "Orders Management" : "My Orders"} />

      <div className="mt-5 w-full max-w-full rounded-xl border border-stroke bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-stroke px-7 py-5 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isAdmin ? "All Orders" : "My Orders"}
          </h3>
        </div>

        <div className="p-7">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-left dark:bg-gray-800">
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Order ID
                    </th>
                    {isAdmin && (
                      <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        Customer
                      </th>
                    )}
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-stroke dark:border-gray-800"
                    >
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          #{order.id}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.customer?.name || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {order.customer?.email || ""}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₫{parseFloat(order.total_amount).toLocaleString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                          MoMo
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {isAdmin ? (
                          <div className="flex flex-wrap gap-2">
                            {/* Pending → Processing or Cancel */}
                            {order.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing')}
                                  className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                                  title="Confirm and start processing"
                                >
                                  ✓ Confirm
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Canceled')}
                                  className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                                  title="Cancel this order"
                                >
                                  ✕ Cancel
                                </button>
                              </>
                            )}
                            {/* Processing → Shipped or Cancel */}
                            {order.status === 'Processing' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Shipped')}
                                  className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                                  title="Ship the order"
                                >
                                  📦 Ship
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Canceled')}
                                  className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                                  title="Cancel this order"
                                >
                                  ✕ Cancel
                                </button>
                              </>
                            )}
                            {/* Shipped → Completed or Refunded */}
                            {order.status === 'Shipped' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Completed')}
                                  className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                                  title="Mark as delivered"
                                >
                                  ✓ Delivered
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Refunded')}
                                  className="rounded bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition-colors"
                                  title="Process refund request"
                                >
                                  ↩ Refund
                                </button>
                              </>
                            )}
                            {/* Completed → Refunded */}
                            {order.status === 'Completed' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Refunded')}
                                className="rounded bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition-colors"
                                title="Process refund request"
                              >
                                ↩ Refund
                              </button>
                            )}
                            {/* Final states - no actions */}
                            {(order.status === 'Canceled' || order.status === 'Refunded') && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                No actions
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            View only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
