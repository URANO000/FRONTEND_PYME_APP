import React from "react";
import { useState, useEffect } from "react";

//Defining my function

const CreateProductModal = ({ isOpen, onClose, api, onSave, categories = [] }) => {
    //My params, this is a little harder cause of the image file saving and stuff
    const [formData, setFormData] = useState({
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

    //Handle change for my inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        console.log(formData);
    };

    const handleStateChange = (e) => {
        setFormData(prev => ({
            ...prev,
            state: e.target.value === 'true'
        }));
    };

    //Why is adding images the hardest part of all

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
                e.target.value = null;
                return;
            }

            //Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                e.target.value = null;
                return;
            }

            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));


            //Preview of my img
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            //Clear any previous errors
            setError('');
        }
    };



    const handleSubmit = async () => {
        setError('');

        //Validation
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

        if (!formData.imageFile) {
            setError('Debe de seleccionar una imagen');
            return;
        }

        setLoading(true);
        try {
            //Create FormData for multipart/form-data
            const submitData = new FormData();
            submitData.append('Name', formData.name);
            submitData.append('Price', formData.price);
            submitData.append('TaxPercentage', formData.taxPercentage);
            submitData.append('Stock', formData.stock);
            submitData.append('State', formData.state.toString());
            submitData.append('CategoryId', formData.categoryId);

            if (formData.imageFile) {
                console.log(formData.imageFile);
                submitData.append('ImageFile', formData.imageFile);
            }

            await onSave(submitData);
            handleClose();
        } catch (error) {
            setError('Error al crear el producto');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    //Handle closing
    const handleClose = () => {
        setFormData({
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

    //If is open is false, hide this
    if (!isOpen) {
        return null;
    }

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Crear Nuevo Producto</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-evenly gap-3">
                        <div className="mb-6 flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre *
                            </label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                name="name"
                                placeholder="Ej: Laptop Dell"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-6 flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Precio (₡) *
                            </label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                name="price"
                                placeholder="₡0"
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-evenly gap-3">
                        <div className="mb-6 flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                % Impuesto *
                            </label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                name="taxPercentage"
                                placeholder="%0"
                                type="number"
                                min="0"
                                value={formData.taxPercentage}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-6 flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Stock *
                            </label>
                            <input
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                name="stock"
                                placeholder="1"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-evenly gap-3">
                        <div className="mb-6 flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estado *
                            </label>
                            <select
                                value={formData.state.toString()}
                                onChange={handleStateChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                        <div className="mb-6 flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoría *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
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
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Imagen del Producto *
                        </label>
                        <div className="space-y-3">
                            {imagePreview && (
                                <div className="flex justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-40 w-40 rounded-lg border-2 border-gray-300 object-cover dark:border-gray-600"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:file:bg-indigo-900 dark:file:text-indigo-200"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                            </p>
                        </div>
                    </div>

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
                            {loading ? 'Guardando...' : 'Crear Producto'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProductModal;