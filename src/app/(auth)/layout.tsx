import React from "react";

export default function authenticationLayout({
    children,
}: Readonly<{
    children : React.ReactNode;
}>) {
    return (     
        <main>
            <div className="h-screen ms-auto justify-center items-center">
            {children}
            </div>
        </main>
        
    );
}