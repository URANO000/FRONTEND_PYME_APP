import { useState, useEffect } from 'react';

const EditOrderModal = ({ isOpen, order, onClose, onSave, api }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    clientId: '',
    state: true,
    orderDetails: []
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when order changes
  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        orderId: order.orderId,
        clientId: order.client?.clientId || '',
        state: order.state,
        orderDetails: order.orderDetails || []
      });
      fetchClients();
      fetchProducts();
      fetchOrderDetails(order.orderId);
    }
  }, [order, isOpen]);

  const fetchClients = async () => {
    try {
      const response = await api.get('Client/GetAllClients');
      const clientData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.items || []);
      setClients(clientData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError('No se pudieron cargar los clientes');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('Product/GetAllProducts');
      const productData = Array.isArray(response.data)
        ? response.data
        : (response.data.items || []);
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError('No se pudieron cargar los productos');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`Orders/GetOrderById/${orderId}`);
      const details = Array.isArray(response.data)
        ? response.data
        : (response.data.items || []);
      
      // Map to the format we need
      const mappedDetails = details.map(detail => ({
        orderDetailId: detail.orderDetailId,
        productId: detail.product?.productId || detail.productId,
        quantity: detail.quantity
      }));
      
      setFormData(prev => ({ ...prev, orderDetails: mappedDetails }));
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError('No se pudieron cargar los detalles de la orden');
    }
  };

  const addOrderDetail = () => {
    setFormData({
      ...formData,
      orderDetails: [
        ...formData.orderDetails,
        { productId: '', quantity: 1 }
      ]
    });
  };

  const removeOrderDetail = (index) => {
    const newDetails = formData.orderDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, orderDetails: newDetails });
  };

  const updateOrderDetail = (index, field, value) => {
    const newDetails = [...formData.orderDetails];
    newDetails[index][field] = field === 'quantity' ? parseInt(value) || 0 : parseInt(value);
    setFormData({ ...formData, orderDetails: newDetails });
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.clientId) {
      setError('Debe seleccionar un cliente');
      return;
    }

    if (formData.orderDetails.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    // Check if all products are selected and quantities are valid
    for (let detail of formData.orderDetails) {
      if (!detail.productId) {
        setError('Todos los productos deben estar seleccionados');
        return;
      }
      if (detail.quantity < 1) {
        setError('Las cantidades deben ser mayores a 0');
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        orderId: formData.orderId,
        clientId: formData.clientId,
        state: formData.state,
        orderDetails: formData.orderDetails.map(detail => ({
          orderDetailId: detail.orderDetailId || 0, // 0 for new details
          productId: detail.productId,
          quantity: detail.quantity
        }))
      };

      await onSave(updateData);
      onClose();
    } catch (error) {
      setError('Error al actualizar la orden');
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Editar Orden #{order.orderId}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            {/* Order Info */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Fecha:</span> {new Date(order.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Subtotal:</span> ₡{order.subtotal?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Impuestos:</span> ₡{order.tax?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Total:</span> ₡{order.total?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Client Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cliente *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.clientId} value={client.clientId}>
                    {client.firstName} {client.lastName} - {client.cedula}
                  </option>
                ))}
              </select>
            </div>

            {/* State Toggle */}
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado activo
                </span>
              </label>
            </div>

            {/* Order Details */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Productos *
                </label>
                <button
                  type="button"
                  onClick={addOrderDetail}
                  className="px-4 py-2 bg-[#51b1ff] hover:bg-[#385eb1] text-white rounded-xl"
                >
                  Agregar Producto
                </button>
              </div>

              {formData.orderDetails.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.orderDetails.map((detail, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex-1">
                        <select
                          value={detail.productId}
                          onChange={(e) => updateOrderDetail(index, 'productId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        >
                          <option value="">Seleccione un producto</option>
                          {products.map((product) => (
                            <option key={product.productId} value={product.productId}>
                              {product.name} - ₡{product.price.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={detail.quantity}
                          onChange={(e) => updateOrderDetail(index, 'quantity', e.target.value)}
                          placeholder="Cant."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderDetail(index)}
                        className="px-3 py-2 bg-pink-700 hover:bg-pink-950 text-white rounded-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;