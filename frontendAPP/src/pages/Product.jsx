import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import { getUserRole } from '../utils/auth';
import SucessDialog from '../components/SucessDialog';
import EditProductModal from '../personalizedComponents/EditProductModal';
import CreateProductModal from '../personalizedComponents/CreateProduct';
import ExportExcel from '../utils/ExportExcel';


//First thing I need to do is start my function
const Product = () => {
    //I define my necessary params here
    const [products, setProducts] = useState([]); //because it's a list of products
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [state, setState] = useState(true);
    const [pageNumber, setPageNumber] = useState(1); //my default
    const [pageSize, setPageSize] = useState(10); //use default
    const [totalCount, setTotalCount] = useState(0);

    //For AJAX sort of action, the loading after user types
    const [loading, setLoading] = useState(false);
    //sort of reminds me of encapsulation

    //This for my dropdown stuff
    const [categories, setCategories] = useState([]);

    //Get user role to make sure who can edit, delete and create
    const userRole = getUserRole();

    //Permissions for who can see and do certain thigns, this was on my project paper
    const canCreate = userRole === "ADMINISTRADOR";
    const canEdit = userRole === "ADMINISTRADOR" || userRole === "VENTAS" || "OPERACIONES";   //But operaciones can only change stock
    const canDelete = userRole == "ADMINISTRADOR";

    //This is mostly for my confirm dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    //Just for the rest
    const [error, setError] = useState('');

    //For my edit button, I need this
    const [editingProduct, setEditingProduct] = useState(null);

    //set create modal
    const [showCreateModal, setShowCreateModal] = useState(false);




    //Now I call my API using axios
    const fetchProducts = async () => {
        setLoading(true);
        try {
            console.log('Fetching products with token:', localStorage.getItem('token')); // Debug

            const response = await api.get('Product/GetAllProducts', {
                params: {
                    search,
                    categoryId,
                    minPrice,
                    maxPrice,
                    state,
                    pageNumber,
                    pageSize
                }
            });

            console.log('Response received:', response); // Debug
            console.log('Response data:', response.data); // Debug

            //Ok, now that I have my response supposedly filled up with the JSON response
            //I will set my products array as the data inside my response

            const items = response.data.items || [];

            setProducts(items);
            setTotalCount(response.data.totalCount || 0);

            //My categories for my dropdown
            const categoryMap = new Map();
            items.forEach(product => {
                if (product.category) {
                    categoryMap.set(product.category.categoryId, product.category);
                }
            });
            setCategories(Array.from(categoryMap.values()));



        } catch (error) {
            console.error('Error getting products, please check the error: ', error);
            //I formerly had an alert, but, quite honestly, I hate it
        } finally {
            setLoading(false);  //If it didn't work, then it isn't loading!
            console.log(":D hello!");
        }
    }

    //Ok, enough playing around. Now, the initial load of data
    //This calls my functions every single time page number and page size changes!
    useEffect(() => {
        fetchProducts();
    }, [pageNumber, pageSize]);

    //And this calls my function every time search, categoryId or min/max price changae
    //All with a 500ms delay in between to give some time for my user to finish typing
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts();
        }, 500)

        return () => clearTimeout(delay);
    }, [search, categoryId, minPrice, maxPrice]);

    //total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    //Handle click on delete
    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setShowConfirm(true);
    }

    //Call my API on delete
    const confirmDelete = async () => {
        setError('');
        try {
            await api.delete(`Product/DeleteProduct/${selectedProductId}`);
            //if succesful, show success message
            setShowSuccess(true);

        } catch (error) {
            console.log("Error eliminando producto", error);
            setError('No se pudo eliminar el producto!')
        } finally {
            setShowConfirm(false);
            setSelectedProductId(null);
        }
    };

    //EDIT LOGIC GOES HEREB
    const handleEditClick = (id) => {
        const product = products.find((p) => p.productId === id);  //If my given id, from the product I choose exists
        setEditingProduct(product);
    }

    const handleSaveEdit = async (productId, formData) => {
        console.log('handleSaveEdit called with productId:', productId); // Debug
        console.log('formData:', formData); // Debug

        try {
            await api.put(`Product/UpdateProduct/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Product updated successfully'); // Debug
            setShowSuccess(true);

        } catch (error) {
            console.log('Error editando el producto', error);
            setError('No se pudo editar el producto...');

        } finally {
            setEditingProduct(null);
        }
    };

    //Handle create -- I am getting all the errors in the world trying to add an img
    const handleCreateProduct = async (productData) => {
        try {
            console.log('Sending product data...');
            //Now it's just regular JSON - no FormData!
            const response = await api.post('Product/CreateProduct', productData);
            console.log('Response:', response);
            setShowSuccess(true);
            fetchProducts();
        } catch (error) {
            console.error("Error creando producto: ", error);
            throw error;
        }
    };


    //Defining items for table

    const headers = ['ID', 'Nombre', 'Categoría', 'Precio', 'IVA', 'Stock', 'Imágen', 'Estado'];

    const data = products.map(p => [
        p.productId,
        p.name,
        p.category.name,
        `₡${p.price.toFixed(2)}`,
        `${p.taxPercentage}%`,
        p.stock,
        p.image ? `http://localhost:5254${p.image}` : null,
        p.state ? 'Activo' : 'Inactivo'
    ]);

    //Okay, make the filters work..

    return (
        <div className="m-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 dark:text-gray-50">Productos</h2>
            {
                canCreate && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="mb-5 py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl text-l">
                        Crear nuevo producto
                    </button>
                )
            }
            {/*For extra points */}
            <ExportExcel
                data={data}
                headers={headers}
                workbookName="Productos"
                fileName="ProductosExport.xlsx"

            />


            {/* Filters */}

            <div className='flex justify-between mb-5'>
                <input
                    className="bg-white text-indigo-900 placeholder:text-gray-900 p-2 rounded-xl w-150 mr-5 dark:bg-gray-800 dark:placeholder:text-indigo-200 dark:text-indigo-200"
                    type="text"
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNumber(1);
                    }}
                />

                <select className="block py-2.5 px-2 w-100 rounded-xl text-sm bg-white text-indigo-900 border-0 border-b-2 border-gray-200 appearance-none dark:text-indigo-200 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 dark:bg-gray-800 peer"
                    value={categoryId}
                    onChange={(e) => {
                        setCategoryId(e.target.value);
                        setPageNumber(1);
                    }}
                >
                    <option value="">Todas las Categorías</option>
                    {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    className="bg-white text-indigo-900 placeholder:text-gray-900 p-2 rounded-xl w-80 mr-5 ml-5 dark:bg-gray-800 dark:placeholder:text-indigo-200 dark:text-indigo-200"
                    type="number"
                    placeholder='Precio min'
                    value={minPrice}
                    onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPageNumber(1);
                    }}

                />
                <input
                    className="bg-white text-indigo-900 placeholder:text-gray-900 p-2 rounded-xl w-80 mr-5 ml-5 dark:bg-gray-800 dark:placeholder:text-indigo-200 dark:text-indigo-200"
                    type="number"
                    placeholder='Precio max'
                    value={maxPrice}
                    onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPageNumber(1);
                    }}

                />
            </div>
            {/* Table goes here, reuse my table component - If loading is null, then display message */}
            {
                loading ? (
                    <p>Loading...</p>
                ) : (

                    <Table
                        headers={headers}
                        data={data}
                        imageColumns={[6]}
                        emptyMessage="No se encontraron productos"
                        onDelete={canDelete ? handleDeleteClick : undefined}
                        onEdit={canEdit ? handleEditClick : undefined}
                    />
                )}


            {/*Pagination goes heeeerrr */}
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
                message="¿Seguro que deseas eliminar este producto?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />

            <SucessDialog
                isOpen={showSuccess}
                onClose={() => {
                    console.log('Success dialog closing'); // Debug
                    setShowSuccess(false);
                    fetchProducts(); // Refresh the list
                }}
            />

            <EditProductModal
                isOpen={!!editingProduct}
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={handleSaveEdit}
                categories={categories}
            />

            <CreateProductModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateProduct}
                categories={categories}


            />
        </div>
    );
};


export default Product;