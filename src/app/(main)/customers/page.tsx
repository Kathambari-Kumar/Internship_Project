import CustomersList from "@/components/admin-ui/customer/customers-list";
import { GetAllCustomers } from "@/app/(main)/actions/customers";
import React from "react";

import { ensureAdminAccess } from "@/lib/session";
import { ToastContainer } from "react-toastify";

export default async function CustomersPage() {
  await ensureAdminAccess();
  const customers = await GetAllCustomers(); // Fetch the list of customers from your API or database
  return (
    <div className="flex flex-col gap-10 p-4">
      {/*<div>
         <CustomerCreateModal></CustomerCreateModal> 
        <SearchCustomer></SearchCustomer>
      </div>*/}
      <div>
        <CustomersList customers={customers}></CustomersList>
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
}
