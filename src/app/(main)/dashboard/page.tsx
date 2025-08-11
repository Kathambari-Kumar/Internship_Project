
import  React from "react";
import { auth, AuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; 
import AgendaPanel from "@/components/admin-ui/agendaPanel";

export default async function DashboardPage()  {
     const session: AuthSession = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        return redirect("/");
      } 
      const user = session?.user;
      //const user = await ensureAdminAccess();

    return (
            <>
            <div className="flex h-14 items-center border-b px-4 
                lg:h-[60px] lg:p-6">
                <ul>
                <li><strong>Användernamn </strong>: {user.name}</li>
                <li><strong>E-postadres :</strong> {user.email}</li>
              </ul>
            </div>
            <AgendaPanel></AgendaPanel>
            </>
        );
                  
}

