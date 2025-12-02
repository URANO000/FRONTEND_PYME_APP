import { useState, useEffect } from 'react';
import { getUserRole } from '../utils/auth';


const EditProductModal = ({ isOpen, product, onClose, onSave, categories = [] }) => {

    //This is needed so operaciones cannot edit ANYTHING but stock
    const userRole = getUserRole();
    const canEdit = userRole === "ADMINISTRADOR" || userRole === "VENTAS";
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        price: '',
        taxPercentage: '',
        stock: '',
        state: true,
        categoryId: '',
        imageFile: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product && isOpen) {

            //Make sure the state is properly parsed! I was getting issues with this, especially...
            let parsedState = true; // default
            if (typeof product.state === 'boolean') {
                parsedState = product.state;
            } else if (typeof product.state === 'string') {
                parsedState = product.state.toLowerCase() === 'true';
            }

            setFormData({
                productId: product.productId,
                name: product.name || '',
                price: product.price || '',
                taxPercentage: product.taxPercentage || '',
                stock: product.stock || '',
                state: parsedState,
                categoryId: product.category?.categoryId || '',
                imageFile: null
            });
            setImagePreview(product.image || null);
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleStateChange = (e) => {
        setFormData({
            ...formData,
            state: e.target.value === 'true'
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //Validation of img type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
                return;
            }

            //Validatino of size for the img
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }

            setFormData({
                ...formData,
                imageFile: file
            });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleSubmit = async () => {
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!formData.price || formData.price <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }

        if (!formData.taxPercentage || formData.taxPercentage < 0) {
            setError('El porcentaje de impuesto debe ser 0 o mayor');
            return;
        }

        if (!formData.stock || formData.stock < 0) {
            setError('El stock debe ser 0 o mayor');
            return;
        }

        if (!formData.categoryId) {
            setError('Debe seleccionar una categoría');
            return;
        }

        setLoading(true);
        try {
            // Create FormData for multipart/form-data
            const submitData = new FormData();
            submitData.append('Name', formData.name);
            submitData.append('Price', formData.price);
            submitData.append('TaxPercentage', formData.taxPercentage);
            submitData.append('Stock', formData.stock);
            submitData.append('State', formData.state.toString());
            submitData.append('CategoryId', formData.categoryId);

            if (formData.imageFile) {
                submitData.append('ImageFile', formData.imageFile);
            }

            await onSave(formData.productId, submitData);
            handleClose();
        } catch (error) {
            setError('Error al actualizar el producto');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            productId: '',
            name: '',
            price: '',
            taxPercentage: '',
            stock: '',
            state: true,
            categoryId: '',
            imageFile: null
        });
        setImagePreview(null);
        setError('');
        onClose();
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                            Editar Producto
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

                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre del Producto *
                            </label>
                            <input
                                type="text"
                                disabled={!canEdit}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Ej: Laptop Dell"
                            />
                        </div>

                        {/* Price and Tax Percentage */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Precio (₡) *
                                </label>
                                <input
                                    type="number"
                                    disabled={!canEdit}
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    % Impuesto *
                                </label>
                                <input
                                    type="number"
                                    disabled={!canEdit}
                                    name="taxPercentage"
                                    value={formData.taxPercentage}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="13.00"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Stock *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoría *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estado *
                            </label>
                            <select
                                disabled={!canEdit}
                                value={formData.state.toString()}
                                onChange={handleStateChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Imagen del Producto
                            </label>
                            <div className="space-y-3">
                                {imagePreview && (
                                    <div className="flex justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-40 w-40 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                                        />
                                    </div>
                                )}
                                <input
                                    disabled={!canEdit}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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

export default EditProductModal;