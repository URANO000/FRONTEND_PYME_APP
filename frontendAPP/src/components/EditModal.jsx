import React, { useEffect, useState } from "react";


//Here I define my params
const EditModal = ({ isOpen, entity, onClose, onSave, exclude = [] }) => {

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (entity) {
            const editableData = Object.keys(entity)
                .filter((key) => !exclude.includes(key))
                .reduce((obj, key) => {
                    obj[key] = entity[key];
                    return obj;
                }, {});
            setFormData(editableData);
        }
    }, [entity, exclude]);

    if (!isOpen || !entity) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...entity, ...formData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-50">
                    Editar {entity?.name || entity?.orderId ? `#${entity.orderId || ""}` : ""}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                                type={
                                    typeof formData[key] === "boolean"
                                        ? "checkbox"
                                        : typeof formData[key] === "number"
                                            ? "number"
                                            : "text"
                                }
                                name={key}
                                value={typeof formData[key] === "boolean" ? undefined : formData[key]}
                                checked={typeof formData[key] === "boolean" ? formData[key] : undefined}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-50"
                            />
                        </div>
                    ))}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

};

export default EditModal;