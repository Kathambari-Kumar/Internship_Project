
import { Lora } from "next/font/google";
import ContactForm from "@/components/customer-ui/contact-form";
import { ToastContainer } from "react-toastify";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default function ContactFormPage() {
    return ( 
        <div>
            <hr className="my-4 ,t-3 border-t border-teal-700" />
        <h1 className={`${lora.className} mt-2 text-3xl font-bold text-center text-primary`}>
            Kontaktformulär</h1>
        <hr className="my-4 mt-3 border-t border-teal-700" />  
            <ContactForm></ContactForm>
            <ToastContainer></ToastContainer>
        </div>
    ); 
}