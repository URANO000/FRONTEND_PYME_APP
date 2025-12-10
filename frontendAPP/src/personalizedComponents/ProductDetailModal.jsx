import { useState, useEffect } from "react";

const ProductDetailModal = ({ product, isOpen, onClose, api }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            fetchProductDetails(product.productId);
        }
    }, [isOpen, product]);

    const fetchProductDetails = async (productId) => {
        setLoading(true);
        try {
            const response = await api.get(`Product/GetProductById/${productId}`);
            setProductDetails(response.data);
        } catch (error) {
            console.error("Error fetching product details: ", error);
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/*My header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="">
                                <span className='text-2xl font-bold text-indigo-900 dark:text-indigo-400'>
                                    Detalles de Producto #{product.productId}
                                </span>
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : productDetails ? (
                        <div className="space-y-6">
                            {/*Product information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Info */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">
                                        Información del Producto
                                    </h2>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Nombre</p>
                                        <p className="text-lg">{productDetails.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Precio</p>
                                        <p className="text-lg">₡ {productDetails.price}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">% Impuesto</p>
                                        <p className="text-lg">{productDetails.taxPercentage}%</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Stock</p>
                                        <p className="text-lg">{productDetails.stock}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Estado</p>
                                        <span className="text-lg font-semibold">
                                            {productDetails.state}
                                        </span>
                                    </div>
                                </div>

                                {/* Category + Image */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">
                                        Categoría
                                    </h2>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Nombre</p>
                                        <p className="text-lg">{productDetails.category?.name}</p>
                                    </div>

                                    {/* Product Image */}
                                    {productDetails.image ? (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                                Imagen
                                            </p>
                                            <img
                                                src={`http://localhost:5254${productDetails.image}`}
                                                alt={productDetails.name}
                                                className="rounded-lg max-h-64 object-cover shadow-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="italic text-gray-500 dark:text-gray-400 mt-4">
                                            No hay imagen disponible
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>



                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No se pudieron cargar los detalles del producto
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
};

export default ProductDetailModal;