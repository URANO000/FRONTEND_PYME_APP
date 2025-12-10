import { useState, useEffect } from "react";

const ClientDetailModal = ({ client, isOpen, onClose, api }) => {
    const [clientDetails, setClientDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && client) {
            fetchClientDetails(client.clientId);
        }
    }, [isOpen, client]);

    //Api call 
    const fetchClientDetails = async (clientId) => {
        setLoading(true);
        try {
            const response = await api.get(`Client/GetByClientId/${clientId}`);
            setClientDetails(response.data);
        } catch (error) {
            console.log("Error fetching client details: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/*Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1>
                                <span className='text-2xl font-bold text-indigo-900 dark:text-indigo-400'>
                                    Detalles del Cliente #{client.clientId}
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

                    ) : clientDetails ? (
                        <div className="space-y-6">
                            {/*Client information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/*Client information */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">
                                        Información del Cliente
                                    </h2>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cédula</p>
                                        <p className="text-lg">{clientDetails.cedula}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Primer Nombre</p>
                                        <p className="text-lg">{clientDetails.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Apellido</p>
                                        <p className="text-lg">{clientDetails.lastName}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Correo Electrónico</p>
                                        <p className="text-lg">{clientDetails.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Número de Teléfono</p>
                                        <p className="text-lg">{clientDetails.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Dirección</p>
                                        <p className="text-lg">{clientDetails.address}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p>No se encontraron detalles del cliente.</p>
                    )}
                </div>
            </div>
        </div>
    )

};

export default ClientDetailModal;