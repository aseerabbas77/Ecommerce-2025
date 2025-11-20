// Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './SideBar';
import AddProduct from './AddProduct'; 
import AllProductsDashboard from './AllProductsDashboard'; // Your new component
import OrderList from '../components/OrderFullFill';
import MyOrders from '../components/MyOrders';
import Orders from './AdminOrderDashboard';
import AdminOrdersDashboard from './AdminOrderDashboard';

const DashBoard = () => {
  return (     
    // This is the main container for the dashboard layout
    <div className='flex h-screen bg-gray-50'> {/* Changed to h-screen and removed min-h-screen */}
      
      {/* Sidebar - It's a direct child of the flex container */}
      <SideBar />
      
      {/* Main Content Area - This takes up the remaining space and handles its own scrolling */}
      <div className="flex-1 flex flex-col overflow-y-auto"> {/* Removed p-6 and bg-gray-50 from here */}
        <Routes>
          <Route index element={<AllProductsDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="all-products" element={<AllProductsDashboard />} />
          <Route path="orders" element={<AdminOrdersDashboard/>} />
          {/* Add more dashboard routes here, like for editing products */}
          {/* <Route path="edit-product/:id" element={<EditProduct />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default DashBoard;