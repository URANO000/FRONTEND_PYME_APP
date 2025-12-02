import { useState, useEffect } from 'react';

const OrderDetailsModal = ({ isOpen, order, onClose, api }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails(order.orderId);
    }
  }, [isOpen, order]);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await api.get(`Orders/GetOrderById/${orderId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  const getStateColor = (state) => {
    switch (state) {
      case 'CONFIRMADA':
        return 'bg-purple-100 text-blue-800 dark:bg-purple-900 dark:text-blue-200';
      case 'PAGADA':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="">
                <span className='text-2xl font-bold text-indigo-900 dark:text-indigo-400'>
                    Detalles de Orden #{order.orderId}
                </span>
                
              </h1>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStateColor(order.state)}`}>
                {order.state}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Nombre:</span> {orderDetails.client?.firstName} {orderDetails.client?.lastName}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Email:</span> {orderDetails.client?.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Teléfono:</span> {orderDetails.client?.phone || 'N/A'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Dirección:</span> {orderDetails.client?.address || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Información de Orden
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Fecha:</span> {new Date(orderDetails.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Usuario:</span> {orderDetails.user?.username}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Email Usuario:</span> {orderDetails.user?.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Rol:</span> {orderDetails.user?.role?.roleName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Productos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Descuento
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {orderDetails.orderDetails?.map((detail) => {
                        const subtotalItem = (detail.quantity * detail.unitPrice) - detail.discount;
                        return (
                          <tr key={detail.orderDetailId}>
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              {detail.product?.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {detail.product?.category?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-100">
                              {detail.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                              ₡{detail.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                              ₡{detail.discount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                              ₡{subtotalItem.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-200 dark:border-gray-600">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Subtotal:</span>
                    <span>₡{orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Impuestos (IVA):</span>
                    <span>₡{orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 pt-2 border-t-2 border-blue-300 dark:border-gray-600">
                    <span>Total:</span>
                    <span>₡{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No se pudieron cargar los detalles de la orden
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;