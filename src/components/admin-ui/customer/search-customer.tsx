"use client";

import { SearchCustomersByNameOrPNOrEmailOrPhone } from "@/app/(main)/actions/customers";
import { useState, useTransition } from "react";
import { CustomerFormData } from "@/lib/customer-schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomerEditModal from "./customer-edit-modal";

export default function SearchCustomer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerFormData[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async () => {
    if (!query.trim()) return;

    startTransition(() => {
      SearchCustomersByNameOrPNOrEmailOrPhone(query).then(
        (searchedCustomers) => {
          setResults(searchedCustomers ?? []);
        }
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search customer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <Button
          onClick={handleSearch}
          disabled={isPending}
          variant="default"
          className="px-4 py-1"
        >
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>

      {results && results.length > 0 && (
        <ul className="space-y-2">
          {results.map((customer) => (
            <li key={customer.id} className="py-3 px-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100"></div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {customer.firstname} {customer.lastname}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  🆔 {customer.personalnumber} 📧{customer.email} 📞
                  {customer.phone}
                </p>
              </div>
              <div className="flex gap-2">
              <CustomerEditModal defaultCustomer={customer}></CustomerEditModal>
              <Link href={`/customers/${customer.id}`}>
                <Button variant={"outline"}>Detail</Button>
              </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {results && results.length === 0 && (
        <p className="text-red-500">No customer found.</p>
      )}
    </div>
  );
}
