'use client';

import React, { useEffect} from 'react';
import { shopContactSchema } from '@/lib/validators';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ToastOptions, toast } from "react-toastify";
import { UpdateShopContactDetails } from '@/app/(main)/actions/handleShopContactUpdate';

const ShopSettings = () => {
  
  const {register, reset, handleSubmit, formState: {errors},
      } = useForm<z.infer<typeof shopContactSchema>>({
      resolver : zodResolver(shopContactSchema),
      mode : "onChange",
      defaultValues : {
        address : "",
        city: "",
        postalCode : "",
        phone1 : "",
        phone2 : "",
        email : "",
      }
    });

  useEffect(() => {

    const fetchShopContactDetails = async () => {
    try {
      const response = await fetch("/api/getShopContactDetails");
      const result = await response.json();
      reset(result);
    } catch(error) {
      console.log("Failed to fetch events", error);
    }
  };
    fetchShopContactDetails();
  },[reset]);

  

  const toastOptions: ToastOptions = {
    autoClose: 2000,
    onClose: () => {
      window.location.href = "/dashboard";
    }
  };

  const onSubmit = async(data:z.infer<typeof shopContactSchema>) => {
    console.log(data);
      try {
        await UpdateShopContactDetails(data);
        toast.success("Butiksuppgifter uppdaterades framgångsrikt!", toastOptions);
      } 
      catch(error) {
        console.log(error);
        toast.error("Misslyckades med att uppdatera", toastOptions);
      } 
    };

return(
  <>
  <div className='w-full'>
    <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-lg">
            <CardHeader className="bg-gray-200 py-4 items-center">
              <CardTitle className="text-2xl text-center">Updatera Köp Detailer</CardTitle>
            </CardHeader>
            <hr/>
            <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
                <label
                  htmlFor="address"
                  className="block text-1xl font-medium text-black"
                >
                Addres
                </label>
                <Input id="address" {...register("address")}
                className="mt-2" />
                {errors.address && <p>{errors.address.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-1xl font-medium text-black"
                >
                Stad
                </label>
                <Input id="city" {...register("city")}
                className="mt-2" />
                {errors.city && <p>{errors.city.message}</p>}
              </div>
              
              <div>
                  <label htmlFor="postalCode"  
                  className="block text-1xl font-medium text-black">Postal Code</label>
                  <Input id="postalCode" {...register("postalCode")}/>
                  {errors.postalCode && <p>{errors.postalCode.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone1"  className="block text-1xl font-medium text-black">Telefon 1</label>
                  <Input id="phone1" {...register("phone1")}/>
                  {errors.phone1 && <p>{errors.phone1.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone2" 
                  className="block text-1xl font-medium text-black">Telefon 2 (Optional)</label>
                  <Input id="phone2"
                  {...register("phone2")}
                  />
                  {errors.phone2 && <p>{errors.phone2.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" 
                  className="block text-1xl font-medium text-black">Epost Adress</label>
                  <Input id="email" type="email" {...register("email")}/>
                  {errors.email && <p>{errors.email.message}</p>}
                </div>
              <Button type="submit" className='w-full'>Uppdatera</Button>
            </form>
        </CardContent>
        </Card>
    </div>
  </div>
  </>
)};

export default ShopSettings;
