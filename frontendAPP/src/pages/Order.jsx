import api from "../services/axios";
import Table from "../components/Table";
import React, { useEffect, useState } from 'react';
import ConfirmDialog from "../components/ConfirmDialog";


//Start with the functions
const Order = () => {
    //Params
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    //This is mostly for my confirm dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    //Just for the rest
    const [error, setError] = useState('');

    //This is so much easier without the params...aoougogogugug
    const fetchOrders = async () => {
        setLoading(true);
        try {

            const response = await api.get('Orders/GetAllOrders');
            console.log(response.data);

            const orderData = Array.isArray(response.data)
                ? response.data
                : (response.data.items || []);

            setOrders(orderData);

        } catch (error) {
            console.log("oh :(", error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchOrders();
    }, []);

    //Handle click on delete
    const handleDeleteClick = (id) => {
        setSelectedOrderId(id);
        setShowConfirm(true);
    }

    //Call my API on delete
    const confirmDelete = async () => {
        setError('');
        try {

            await api.delete(`Orders/DeleteOrder/${selectedOrderId}`);
            fetchOrders();

        } catch (error) {
            console.log("Error eliminando orden", error);
            setError('No se pudo eliminar su orden!')
        } finally {
            setShowConfirm(false);
            setSelectedOrderId(null);
        }
    }


    //Set headers and data
    const headers = ['ID', 'Fecha', 'Subtotal', 'Impuestos', 'Total', 'Estado', 'ID Cliente', 'Cédula', 'Nombre Completo', 'Usuario', 'Rol']

    const data = orders.map(o => [
        o.orderId,
        new Date(o.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        `₡${o.subtotal.toFixed(2)}`,
        `₡${o.tax.toFixed(2)}`,
        `₡${o.total.toFixed(2)}`,
        o.state ? 'Activo' : 'Inactivo',
        o.client?.clientId || 'N/A',
        o.client?.cedula || 'N/A',
        `${o.client.firstName} ${o.client.lastName}`,
        o.user?.username || 'N/A',
        o.user?.role?.roleName || 'N/A'
    ]);

    console.log(data);
    //Table moment...my life is so much better ..yay..god looked at me in the eyes and smiled
    return (

        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 dark:text-gray-50">Órdenes</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table
                    headers={headers}
                    data={data}
                    emptyMessage="No se encontraron órdenes"
                    onDelete={handleDeleteClick}
                />
            )}


            <ConfirmDialog
                isOpen={showConfirm}
                message="¿Seguro que deseas eliminar esta orden?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>


    );

};


export default Order;