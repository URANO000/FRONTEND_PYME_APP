import api from "../services/axios";
import Table from "../components/Table";
import React, { useEffect, useState } from 'react';
import ConfirmDialog from "../components/ConfirmDialog";
import EditOrderModal from "../personalizedComponents/EditOrderModal";
import { getUserRole } from "../utils/auth";
import CreateOrderModal from "../personalizedComponents/CreateOrder";

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

    //For my edit modal
    const [editingOrder, setEditingOrder] = useState(null);

    //Get user role
    const userRole = getUserRole();

    //Using it for create too
    const canEdit = userRole === "ADMINISTRADOR" || userRole === "VENTAS";
    const canDelete = userRole === "ADMINISTRADOR";

    //for create modal
    const [showCreateModal, setShowCreateModal] = useState(false);


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

    //Call my API on edit
    const handleEditClick = (id) => {
        const order = orders.find((o) => o.orderId === id);
        setEditingOrder(order);
    };

    const handleSaveEdit = async (updatedOrder) => {
        try {
            await api.put(`Orders/UpdateOrder/${updatedOrder.orderId}`, updatedOrder);
            fetchOrders();
        } catch (error) {
            console.error("Error actualizando:", error);
            alert("Error al actualizar la orden");
        } finally {
            setEditingOrder(null);
        }
    };

    //Handle create
    const handleCreateOrder = async (orderData) => {
        try {
            await api.post('Orders/CreateOrder', orderData);
            fetchOrders();
        } catch (error) {
            console.error("Error creando orden:", error);
            throw error; //throw modal again
        }
    };



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
        o.state,
        o.client?.clientId || 'N/A',
        o.client?.cedula || 'N/A',
        `${o.client.firstName} ${o.client.lastName}`,
        o.user?.username || 'N/A',
        o.user?.role?.roleName || 'N/A'
    ]);

    console.log(data);
    //Table moment...my life is so much better ..yay..god looked at me in the eyes and smiled
    return (


        <div className="m-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 dark:text-gray-50">Órdenes</h2>
            {
                canEdit && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="mb-5 py-2 px-4 dark:bg-indigo-500 hover:bg-indigo-600 rounded-xl text-l">
                        Crear nueva órden
                    </button>
                )
            }

            {loading ? (
                <p>Loading...</p>
            ) : (

                <Table
                    headers={headers}
                    data={data}
                    emptyMessage="No se encontraron órdenes"
                    onDelete={canDelete ? handleDeleteClick : undefined}
                    onEdit={canEdit ? handleEditClick : undefined}
                />
            )}


            <ConfirmDialog
                isOpen={showConfirm}
                message="¿Seguro que deseas eliminar esta orden?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />

            <EditOrderModal
                isOpen={!!editingOrder}
                order={editingOrder}
                onClose={() => setEditingOrder(null)}
                onSave={handleSaveEdit}
                api={api}
            />

            <CreateOrderModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateOrder}
                api={api} //HereI am passing thr instance I already have of api
            />
        </div>

    );

};


export default Order;