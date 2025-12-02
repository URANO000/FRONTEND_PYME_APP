import React from "react";
import { useState, useEffect } from "react";
import SuccessDialog from "../components/SucessDialog";

const CreateClientModal = ({ isOpen, onClose, onSave, api }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        cedula: "",
        email: "",
        phone: "",
        address: ""

    });

    //this stuff is for validations mostly, itis evry important because of the requirements
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);



    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.cedula.trim()) {
            newErrors.cedula = "La cédula es requerida";
        } else if (!/^\d{9}$/.test(formData.cedula)) {
            newErrors.cedula = "La cédula debe tener 9 dígitos";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "El teléfono es requerido";
        } else if (!/^\d{4}-?\d{4}$/.test(formData.phone)) {
            newErrors.phone = "Formato inválido (####-#### o ########)";
        }

        if (!formData.address.trim()) {
            newErrors.address = "La dirección es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare DTO for API
            const createClientDTO = {
                firstName: formData.firstName || null,
                lastName: formData.lastName || null,
                cedula: formData.cedula,
                email: formData.email,
                phone: formData.phone.replace("-", ""),
                address: formData.address
            };

            //Calling my endpoint with the axios I use
            const response = await api.post('Client/CreateClient', createClientDTO);

            //Calling on save!
            if (onSave) {
                onSave(response.data);
            }


            //Reset once submitted
            handleReset();
            onClose();
        } catch (error) {
            console.error('Error creando cliente:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al crear el cliente';
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };


    //Reset form, empty it out for the next time in use
    const handleReset = () => {
        setFormData({
            firstName: "",
            lastName: "",
            cedula: "",
            email: "",
            phone: "",
            address: ""
        });
        setErrors({});
    };

    //Handle cancel
    const handleCancel = () => {
        handleReset();
        onClose();
    };

    //If it isn't open, do not show

    if (!isOpen) return null;


    return (
        <>
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                <div className="max-h-[90vh] w-105 max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                                Crear Nuevo Cliente
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {errors.submit && (
                            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex justify-evenly gap-3">
                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Primer Nombre
                                </label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                    type="text"
                                    placeholder="Primer nombre"
                                />
                            </div>
                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Apellido
                                </label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                                    type="text"
                                    placeholder="Apellido"
                                />
                            </div>
                        </div>

                        <div className="flex justify-evenly gap-3">
                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Cédula *
                                </label>
                                <input
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none dark:bg-gray-600 dark:text-white ${errors.cedula
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-500'
                                        }`}
                                    type="text"
                                    placeholder="#########"
                                    maxLength={9}
                                />
                                {errors.cedula && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cedula}</p>
                                )}
                            </div>
                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email *
                                </label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none dark:bg-gray-600 dark:text-white ${errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-500'
                                        }`}
                                    type="email"
                                    placeholder="Example@gmail.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-evenly gap-3">
                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Teléfono *
                                </label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none dark:bg-gray-600 dark:text-white ${errors.phone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-500'
                                        }`}
                                    type="text"
                                    placeholder="####-####"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                )}
                            </div>

                            <div className="mb-6 flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Dirección *
                                </label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none dark:bg-gray-600 dark:text-white ${errors.address
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-500'
                                        }`}
                                    type="text"
                                    placeholder="Dirección"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


};

export default CreateClientModal;