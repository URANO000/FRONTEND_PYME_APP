import React, { useEffect, useState } from "react";
import api from '../services/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import ConfirmDialog from "../components/ConfirmDialog";
import EditModal from '../components/EditModal';
import SuccessDialog from '../components/SucessDialog';


const Client = () => {
    //These are the params that I ask for on my endpoint
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    //This is to simulate a bit of what AJAX does
    const [loading, setLoading] = useState(false);

    //This is mostly for my confirm dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);

    //Just for the rest
    const [error, setError] = useState('');

    //This is strictly for 
    const [editingClient, setEditingClient] = useState(null);


    //fetch clients with filters! Using AXIOS does about the same thing AJAX would
    const fetchClients = async () => {
        setLoading(true);
        try {

            //My simple api call with the params
            const response = await api.get('Client/GetAllClients', {
                params: {
                    search,
                    email,
                    lastName,
                    pageNumber,
                    pageSize
                }
            });

            //my backend returns PagedResult<ClientDTO>
            setClients(response.data.items || []);
            setTotalCount(response.data.totalCount || 0);
        } catch (error) {
            console.error('Error getting clients, check what it was: ', error);
        } finally {
            setLoading(false);
        }
    }

    //Now I have defined my method to retrieve data from my api
    //I will now do the initial load
    useEffect(() => {
        fetchClients(); //I call my function
    }, [pageNumber, pageSize]);

    //live search
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchClients();
        }, 500); //wait 0.5s after writing stops

        return () => clearTimeout(delay);
    }, [search, email, lastName]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDeleteClick = (id) => {
        setSelectedClientId(id);
        setShowConfirm(true);
    }

    //Call my API on delete
    const confirmDelete = async () => {
        setError('');
        try {

            await api.delete(`Client/DeleteClient/${selectedProductId}`);
            setShowConfirm(true);
            fetchClients();

        } catch (error) {
            console.log("Error eliminando el cliente", error);
            setError('No se pudo eliminar el cliente!')
        } finally {
            setShowConfirm(false);
            setSelectedProductId(null);
        }
    };

    //Nice edit logic, finally, maybe it'll work with ONE
    const handleEditClick = (id) => {
        const client = clients.find((c) => c.clientId === id);
        setEditingClient(client);
    };

    const handleSaveEdit = async (updatedClient) => {
        try {
            await api.put(`Client/UpdateClient/${updatedClient.clientId}`, updatedClient);
            setShowSuccess(true);
            fetchClients();

        } catch (error) {
            console.log('Error editando cliente :(((');
        } finally {
            setEditingClient(null); //clean it
        }

    };

    //Defining items for table
    const headers = ['ID', 'Cédula', 'Primer Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección'];

    const data = clients.map(c => [
        c.clientId || 'N/A',
        c.cedula || 'N/A',
        c.firstName || 'N/A',
        c.lastName || 'N/A',
        c.email || 'N/A',
        c.phone || 'N/A',
        c.address || 'N/A'
    ]);

    //Now finally the html!!!
    //I realized I cannot comment inside a return xd

    return (
        <div className="m-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 dark:text-gray-50">Clientes</h2>

            {/*Simple create button*/}
            <button className="mb-5 py-2 px-4 dark:bg-indigo-500 hover:bg-indigo-600 rounded-xl text-l">
                Crear nuevo
            </button>

            {/* Filters and inputs */}
            <div>
                <input
                    className=""
                    id="small-input"
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNumber(1);
                    }}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setPageNumber(1);
                    }}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                        setPageNumber(1);
                    }}
                />
            </div>

            {/* This is the table itself */}
            {
                loading ? (
                    <p>Loading...</p>
                ) : (

                    <Table
                        headers={headers}
                        data={data}
                        emptyMessage="No se encontraron clientes"
                        onDelete={handleDeleteClick}
                        onEdit={handleEditClick}
                    />
                )}

            {/* Pagination goes here*/}

            <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={(newPage) => setPageNumber(newPage)}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPageNumber(1);
                }}
                pageSizeOptions={[5, 10, 25, 50]}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                message="¿Seguro que deseas eliminar este cliente?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
            <EditModal
                isOpen={!!editingClient}
                entity={editingClient}
                exclude={["clientId"]}
                onClose={() => setEditingClient(null)}
                onSave={handleSaveEdit}
            />

            <SuccessDialog
                isOpen={showSuccess}
                onClose={() => {
                    console.log('Success dialog closing'); // Debug
                    setShowSuccess(false);
                    fetchClients(); // Refresh the list
                }}
            />

        </div>

    );



};



export default Client;
