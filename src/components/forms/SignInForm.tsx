"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { errorToast, successToast } from "@/lib/utils";
import { signIn } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(6, { message: "Password must be 6 character" }),
});

export function SignInForm() {
  const dispatch = useAppDispatch();
  const { isLoading, user, errorMessage } = useAppSelector(
    (action) => action.auth
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await dispatch(signIn(data));

    // Displying the toast
    if (!!result.payload.user) {
      successToast("Sign in successful");

      const isVerified = result.payload.user.emailVerified;
      if (isVerified) {
        router.push("/dashboard");
      } else {
        router.push(`/verify-account?sendCode=false`);
      }
    } else {
      errorToast(result.payload);
    }
  };

  return (
    <div className="border border-primary rounded-md p-3 md:p-5 bg-white/80 shadow-lg shadow-slate-300">
      <h3 className="text-2xl font-semibold text-center text-primary mb-1 md:mb-3">
        Wellcome back to CareCube
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="example@gmail.com"
                    type="email"
                    {...field}
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <AiOutlineLoading3Quarters
                size={24}
                className="animate-spin mx-auto my-0.5"
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <p className="text-sm text-center mt-2">
        Don&apos;t have an account? Please{" "}
        <Link href={"/sign-up"} className="text-primary underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
