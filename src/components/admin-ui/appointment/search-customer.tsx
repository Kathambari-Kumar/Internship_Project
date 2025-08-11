"use client";

import { SearchCustomersByNameOrPNOrEmailOrPhone } from "@/app/(main)/actions/customers";
import { useState, useTransition } from "react";
import { CustomerFormData } from "@/lib/customer-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchCustomer({
  onSelectCustomer,
  disabled,
}: {
  onSelectCustomer: (customer: CustomerFormData | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerFormData[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerFormData | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSelectedCustomer(null); // clear current selection
    onSelectCustomer(null); // also clear it in parent
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
        <Input
          type="text"
          placeholder="Sök namn/psn/epost addr/telefon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          disabled={isPending || disabled}
          variant="default"
        >
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>

      {results && results.length > 0 && (
        <ul className="space-y-2 max-h-[9.5rem] overflow-y-auto pr-2">
          {/* Around 2 items high with scroll */}
          {results.map((customer) => (
            <li
              key={customer.id}
              className={`border p-3 rounded transition ${
                selectedCustomer?.id === customer.id
                  ? "bg-green-100 border-green-500"
                  : "bg-gray-50"
              } ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              onClick={() => {
                if (disabled) return;
                setSelectedCustomer(customer);
                onSelectCustomer(customer);
              }}
            >
              <p className="font-semibold uppercase">
                👤 {customer.firstname} {customer.lastname}
              </p>
              <p>📧 {customer.email}</p>
              <p>📞 {customer.phone}</p>
              <p>🆔 {customer.personalnumber}</p>
            </li>
          ))}
        </ul>
      )}

      {results && results.length === 0 && (
        <p className="text-red-500">No customer found.</p>
      )}

      {selectedCustomer && (
        <div className="mt-4 p-3 bg-green-50 border rounded">
          <p className="mb-2 font-medium uppercase">
            ✅ Selected: {selectedCustomer.firstname}{" "}
            {selectedCustomer.lastname}
          </p>
        </div>
      )}
    </div>
  );
}
