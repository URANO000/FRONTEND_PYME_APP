import { useState, useEffect, useRef } from 'react';

const CreateOrderModal = ({ isOpen, onClose, onSave, api }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    orderDetails: []
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //Totals state
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0
  });
  const [calculatingTotals, setCalculatingTotals] = useState(false);

  // Autosuggest states
  const [searchTerms, setSearchTerms] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});

  //The same but for client
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientSuggest, setShowClientSuggest] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchProducts();
    }
  }, [isOpen]);

  //Calculate totals whenever orderDetails change
  useEffect(() => {
    if (formData.orderDetails.length > 0) {
      calculateTotals();
    } else {
      setTotals({ subtotal: 0, tax: 0, total: 0 });
    }
  }, [formData.orderDetails]);

  const fetchClients = async () => {
    try {
      const response = await api.get('Client/GetAllNonPaged');
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
      const response = await api.get('Product/GetAllNonPaged');
      const productData = Array.isArray(response.data)
        ? response.data
        : (response.data.items || []);
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError('No se pudieron cargar los productos');
    }
  };

  const calculateTotals = async () => {
    //Only calculate if all details have valid products and quantities
    const validDetails = formData.orderDetails.filter(
      detail => detail.productId && detail.quantity > 0
    );

    if (validDetails.length === 0) {
      setTotals({ subtotal: 0, tax: 0, total: 0 });
      return;
    }

    setCalculatingTotals(true);
    try {
      const response = await api.post('Orders/CalculateTotal', validDetails);
      const data = response.data;

      setTotals({
        subtotal: data.subtotal || 0,
        tax: data.impuesto || data.tax || 0,
        total: data.total || 0
      });
    } catch (error) {
      console.error("Error calculating totals:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      //Don't show error to user...., just keep previous totals
    } finally {
      setCalculatingTotals(false);
    }
  };


  const addOrderDetail = () => {
    const newIndex = formData.orderDetails.length;
    setFormData({
      ...formData,
      orderDetails: [
        ...formData.orderDetails,
        {
          productId: '',
          quantity: 1,
          discount: 0,
          isPercentage: true
        }
      ]
    });
    setSearchTerms({ ...searchTerms, [newIndex]: '' });
  };


  const removeOrderDetail = (index) => {
    const newDetails = formData.orderDetails.filter((_, i) => i !== index);
    const newSearchTerms = { ...searchTerms };
    delete newSearchTerms[index];

    setFormData({ ...formData, orderDetails: newDetails });
    setSearchTerms(newSearchTerms);
  };

  const updateOrderDetail = (index, field, value) => {
    const newDetails = [...formData.orderDetails];

    if (field === 'quantity') {
      newDetails[index][field] = parseInt(value) || 0;
    } else if (field === 'discount') {
      newDetails[index][field] = parseFloat(value) || 0;
    } else if (field === 'isPercentage') {
      newDetails[index][field] = value;
    } else if (field === 'productId') {
      newDetails[index][field] = parseInt(value);
    }

    setFormData({ ...formData, orderDetails: newDetails });
  };

  const handleProductSearch = (index, value) => {
    setSearchTerms({ ...searchTerms, [index]: value });

    if (value.trim().length < 1) {
      setShowSuggestions({ ...showSuggestions, [index]: false });
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      (product.code && product.code.toLowerCase().includes(searchLower)) ||
      product.productId.toString().includes(searchLower)
    );

    setFilteredProducts({ ...filteredProducts, [index]: filtered });
    setShowSuggestions({ ...showSuggestions, [index]: true });
  };

  const selectProduct = (index, product) => {
    updateOrderDetail(index, 'productId', product.productId);
    setSearchTerms({
      ...searchTerms,
      [index]: `${product.name} ${product.code ? `(${product.code})` : ''}`
    });
    setShowSuggestions({ ...showSuggestions, [index]: false });
  };

  const getSelectedProduct = (productId) => {
    return products.find(p => p.productId === productId);
  };

  //This is for my client, to handle client search and autosuggest...cause...my teacher said I needed to put that here
  const handleClientSearch = (value) => {
    setClientSearchTerm(value);

    //No showinng any suggestions if my search is empty
    if (value.trim().length < 1) {
      setShowClientSuggest(false);
      return;
    }

    //Filters shopuld be by name, last name or ID (cedula)
    const searchLower = value.toLowerCase(); //to make everythign case insensitive
    const filtered = clients.filter(client =>
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      (client.cedula && client.cedula.toLowerCase().includes(searchLower))
    );

    setFilteredClients(filtered);
    setShowClientSuggest(true); //only if the value is not empty


  };

  const selectClient = (client) => {
    setFormData({ ...formData, clientId: client.clientId });
    setClientSearchTerm(`${client.firstName} ${client.lastName} - ${client.cedula}`);
    setShowClientSuggest(false);
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.clientId) {
      setError('Debe seleccionar un cliente');
      return;
    }

    if (formData.orderDetails.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

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
      await onSave(formData);
      setFormData({ clientId: '', orderDetails: [] });
      setSearchTerms({});
      setClientSearchTerm('');
      setTotals({ subtotal: 0, tax: 0, total: 0 });
      onClose();
    } catch (error) {
      setError('Error al crear la orden');
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ clientId: '', orderDetails: [] });
    setSearchTerms({});
    setClientSearchTerm('');
    setTotals({ subtotal: 0, tax: 0, total: 0 });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Crear Nueva Orden
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
            {/* Client Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cliente *
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={clientSearchTerm}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  onFocus={() => {
                    if (clientSearchTerm.length > 0) {
                      setShowClientSuggest(true);
                    }
                  }}
                  placeholder="Buscar cliente por nombre, apellido o cédula..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                {/* Suggestions Dropdown */}
                {showClientSuggest && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.clientId}
                        onClick={() => selectClient(client)}
                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cédula: {client.cedula}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {showClientSuggest && clientSearchTerm.length > 0 && filteredClients.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      No se encontraron clientes
                    </div>
                  </div>
                )}
              </div>
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
                  + Agregar Producto
                </button>
              </div>

              {formData.orderDetails.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.orderDetails.map((detail, index) => {
                    const selectedProduct = getSelectedProduct(detail.productId);

                    return (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        {/* Product Search */}
                        <div className="relative mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Buscar Producto (nombre/código) *
                          </label>
                          <input
                            type="text"
                            value={searchTerms[index] || ''}
                            onChange={(e) => handleProductSearch(index, e.target.value)}
                            onFocus={() => {
                              if (searchTerms[index]?.length > 0) {
                                setShowSuggestions({ ...showSuggestions, [index]: true });
                              }
                            }}
                            placeholder="Escribe para buscar..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />

                          {/* Suggestions Dropdown */}
                          {showSuggestions[index] && filteredProducts[index]?.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {filteredProducts[index].map((product) => (
                                <div
                                  key={product.productId}
                                  onClick={() => selectProduct(index, product)}
                                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {product.name} {product.code && `(${product.code})`}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Precio: ₡{product.price.toFixed(2)} | Stock: {product.stock}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Product Details Row */}
                        <div className="grid grid-cols-12 gap-3 items-end">
                          {/* Quantity */}
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Cantidad *
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={detail.quantity}
                              onChange={(e) => updateOrderDetail(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </div>

                          {/* Unit Price (Display only) */}
                          <div className="col-span-3">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Precio Unitario
                            </label>
                            <input
                              type="text"
                              value={selectedProduct ? `₡${selectedProduct.price.toFixed(2)}` : 'N/A'}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </div>

                          {/* Discount */}
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Descuento
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={detail.discount}
                              onChange={(e) => updateOrderDetail(index, 'discount', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </div>

                          {/* Discount Type */}
                          <div className="col-span-3">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Tipo
                            </label>
                            <select
                              value={detail.isPercentage ? 'percentage' : 'fixed'}
                              onChange={(e) => updateOrderDetail(index, 'isPercentage', e.target.value === 'percentage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            >
                              <option value="percentage">Porcentaje (%)</option>
                              <option value="fixed">Monto Fijo (₡)</option>
                            </select>
                          </div>

                          {/* Delete Button */}
                          <div className="col-span-2">
                            <button
                              type="button"
                              onClick={() => removeOrderDetail(index)}
                              className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center"
                              title="Eliminar producto"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {selectedProduct && selectedProduct.stock < detail.quantity && (
                          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                            ⚠️ Stock insuficiente (disponible: {selectedProduct.stock})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Totals Summary */}
            {formData.orderDetails.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Resumen del Pedido {calculatingTotals && <span className="text-sm text-gray-500">(Calculando...)</span>}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span className="font-medium">₡{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Impuestos (IVA):</span>
                    <span className="font-medium">₡{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 pt-2 border-t border-blue-300 dark:border-gray-600">
                    <span>Total:</span>
                    <span>₡{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

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
                disabled={loading || calculatingTotals}
              >
                {loading ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;