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
//   email: z.string().min(2).max(50),
//   password: z.string().min(2).max(50),
// });

import { signInFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          toast("Vänligen Vänta...");
        },
        onSuccess: () => {
          form.reset();
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
    console.log(values);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="max-w-lg w-full">
    <div className="bg-gray-500 mt-0 h-10">
      <p className="text-center mt-2 text-amber-200 font-bold">LOGGA IN</p></div>
      <CardHeader>
        <CardDescription className="text-teal-700 text-md">
          Välkommen tillbaka! Vänligen logga in för att fortsätta!!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-postadress</FormLabel>
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
            <Button className="w-full" type="submit">
              Avslut
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-md text-teal-700">
          Har inget konto?{" "}
          <Link
            href="/sign-up"
            className="text-blue-700 hover:underline font-bold"
          >
            Registrera dig!
          </Link>
          </p>
      </CardFooter>
    </Card>
    </div>
  );
}