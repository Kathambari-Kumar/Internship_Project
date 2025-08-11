"use client";

import React, { useEffect, useState } from 'react';
import { contactFormSchema, ContactFormData } from '@/lib/customer-schema';
import { toast, ToastOptions } from 'react-toastify';
import Map from '../ui/map';
// React.FC (or React.FunctionComponent) is a TypeScript type 
// used to define a React functional component.
/*   simple example with react functional component
        type GreetingProps = {
        name: string;
        };
        const Greeting: React.FC<GreetingProps> = ({ name }) => {
        return <p>Hello, {name}!</p>;
        };
    GreetingProps defines the expected props
    React.FC<GreetingProps> ensures the component only accepts those props
*/

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

/* 
This produces a union of keys.
    1. keyof ContactFormData : type keyof ContactFormData = 'name' | 'email' | 'message';
    2. Record<keyof ContactFormData, string> : This creates a type-safe object where 
      the keys are: 'name' | 'email' | 'message'. The values are string
    3. Partial<...> This makes all fields optional, 
        because we may only want to show an error for one or two fields at a time:
    4. {} initially it's an empty object
*/
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isValid, setIsValid] = useState(false);
  const [shopContactDetails, setShopContactDetails] = useState({
    address :"",
    city: "",
    postalCode: "",
    phone1: "",
    phone2: "",
    email: "",
  });

  useEffect(() => {
    fetchShopContactDetails();
  }, []);

  const fetchShopContactDetails = async () => {
    try {
      const response = await fetch("/api/getShopContactDetails");
      const result = await response.json();
      setShopContactDetails(result);
    } catch(error) {
      console.log("Failed to fetch events", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // takes the previous state (prev) and returns the new state. 
    // This spreads all properties from the previous state object 
    // into a new object — it's a shallow copy.
    // setFormData(prev => ({ ...prev, [name]: value }));
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    validateForm(updatedFormData); // Real-time validation
  };

  const validateForm = (data: ContactFormData) => {
    const result = contactFormSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsValid(false);
    } else {
      setErrors({});
      setIsValid(true);
    }
  };

  const toastOptions: ToastOptions = {
    autoClose: 2000,
    onClose: () => {
      window.location.href = "/home";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Valid form data submitted:', formData);

    try {
        const response = await fetch('/api/sendMailFromCustomerToShop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Email sent successfully:', data);
          toast.success('Ditt meddelande har skickats!', toastOptions);
          // clear the form:
          setFormData({ name: '', email: '', message: '' });
        } else {
          const error = await response.json();
          console.error('Failed to send message:', error);
          toast.error('Misslyckades med att skicka ditt meddelande.');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        //alert('Something went wrong.');
      }

  };

  return (
    <>
    
    <div style={{ overflow: 'hidden', marginTop: '2rem' }}>
      <div style={{ float: 'left', width: '45%' }}>
        <h1 className='text-1xl mt-11 mb-4 px-4 text-teal-700'><strong>Vår Butik</strong></h1>
        <p className='mb-2 px-4 text-sm'><strong>Adress : </strong> {shopContactDetails.address}  </p>
        <p className='mb-2 px-4 text-sm'><strong>Stad : </strong> {shopContactDetails.city}</p>
        <p className='mb-2 px-4 text-sm'><strong>Postnummer : </strong> {shopContactDetails.postalCode}</p>
        <p className='mb-2 px-4 text-sm'><strong>Telefon 1 : </strong> {shopContactDetails.phone1}</p>
        <p className='mb-2 px-4 text-sm'><strong>Telefon 2 : </strong> {shopContactDetails.phone2}</p>
        <p className='mb-2 px-4 text-sm'><strong>Email : </strong> {shopContactDetails.email}</p>
      </div>
    
    <div className='mt-2 mb-2'
        style={{ float: 'right', width: '50%', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
    <h2 style={styles.h2}>Skriva till oss</h2>
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="name"
        placeholder="För- och efternamn"
        value={formData.name ?? ""}
        onChange={handleChange}
        required
        style={styles.input}
      />
      {errors.name && (
              <p className="text-red-600  text-sm mt-1">
                {errors.name}
              </p>
            )}
      <input
        type="email"
        name="email"
        placeholder="E-postadress"
        value={formData.email}
        onChange={handleChange}
        required
        style={styles.input}
      />
       {errors.email && (
              <p className="text-red-600  text-sm mt-1">
                {errors.email}
              </p>
            )}
      <textarea
        name="message"
        placeholder="Rubrik på ditt ärende"
        value={formData.message}
        onChange={handleChange}
        required
        style={styles.textarea}
      />
       {errors.message && (
              <p className="text-red-600  text-sm mt-1">
                {errors.message}
              </p>
            )}
      <button type="submit" disabled={!isValid} style={{ ...styles.button, opacity: isValid ? 1 : 0.5 }}>Skicka</button>
    </form>
    </div>
   
    </div>
    
    <hr className="my-4 ,t-3 border-t border-teal-700" />
    {/* Displaying the Map */} 
    <div style={styles.map}>
    <Map latitude={58.7098166} longitude={15.7835231} />
    </div>
    
 </>
  );
};

const styles = {
     
    h2 :{
        color : "#0f766e",
        textAlign : "center",
        fontSize : "18px",
        marginBottom : '5px',
    } as React.CSSProperties,

    form: {
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,

    input: {
      marginBottom: '1rem',
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    } as React.CSSProperties,

    textarea: {
      minHeight: '100px',
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginBottom: '1rem',
    } as React.CSSProperties,

    button: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#eab308',
      color: '#000',
      fontWeight :"bold",
      cursor: 'pointer',
    } as React.CSSProperties,

    address: {
        flex: '1 1 40%',
        fontSize: '1rem',
        lineHeight: '1.5',
    }as React.CSSProperties,
    
    map: {
        flex: '1 1 60%',
        height: '400px',
    } as React.CSSProperties,
  };

export default ContactForm;
