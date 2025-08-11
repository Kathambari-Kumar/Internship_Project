"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
//   email: z.string().min(2).max(50),
//   password: z.string().min(2).max(50),
// });
// instead of this use the formSchema from auth-schema.ts

import { formSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignUp() {
  // 1. Define the authentication form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    alert("submit clicked");
    const { username, email, password } = values;
    const { error } = await authClient.signUp.email(
      {
        email,
        password,
        name: username,
        callbackURL: "/sign-in",
      },
      {
        onRequest: () => {
          toast("Vänligen vänta...");
        },
        onSuccess: () => {
          form.reset();
        },
        onError: (ctx) => {
          toast(ctx.error.message);
          form.setError("email", {
            type: "manual",
            message: ctx.error.message,
          });
        },
      }
    );
    if (error) {
      console.error('Error Updating profile:', error.message);
    }
    console.log("Values" , values);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      
    <Card className="w-full max-w-lg">
    <div className="bg-gray-500 mt-0 h-10">
      <p className="text-center mt-2 text-amber-200 font-bold">REGISTRERA</p></div>
      <CardHeader>
        <CardDescription className="text-teal-700 text-md">Välkommen! Vänligen registrera dig för att fortsätta!!</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Använder Namn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ditt namn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epost-Adress</FormLabel>
                  <FormControl>
                    <Input placeholder="xyz@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lösenord</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="ange ditt lösenord"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full text-1xl" type="submit">
              SKAPA
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-md  text-teal-700">
          Har redan ett konto?{" "}
          <Link
            href="/sign-in"
            className="text-blue-700 hover:underline font-bold"
          >
            Logga in
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
  );
}
