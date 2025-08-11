// may use this [id] page later
import { ensureAdminAccess } from "@/lib/session";
import { GetCustomerById } from "../../actions/customers";

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureAdminAccess();
  const { id } = await params;
  const customer = await GetCustomerById(id);
  if (!customer) {
    return <div>Inga kunder registrerade</div>;
  }
  return (
    <div>
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
    </div>
  );
}
