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
import { signUp } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string(),
    password: z.string().min(6, { message: "Password must be 6 character" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be 6 character" }),
    photo: z.instanceof(File, {
      message: "Please select a photo",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password doesn't metch",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isLoading, user, errorMessage } = useAppSelector(
    (action) => action.auth
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, email, password, photo } = data;

    // converted the file into formData to send to the server
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photo", photo);

    const result = await dispatch(signUp(formData));

    // Displying the toast
    if (!!result.payload.user) {
      successToast("Registration successful");

      const isVerified = result.payload.user.emailVerified;
      if (isVerified) {
        router.push("/dashboard");
      } else {
        router.push(`/verify-account?sendCode=true`);
      }
    } else {
      errorToast(result.payload);
    }
  };

  return (
    <div className="border border-primary rounded-md p-3 md:p-5 bg-white/80 shadow-lg shadow-slate-300">
      <h3 className="text-2xl font-semibold text-center text-primary mb-1 md:mb-3">
        Wellcome to CareCube
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Jhon Doe"
                    type="text"
                    {...field}
                  />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="photo">Photo</FormLabel>
                <FormControl>
                  <Input
                    id="photo"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(e.target.files[0]); // Safe to access files[0]
                      }
                    }}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    name={field.name}
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
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
      <p className="text-sm text-center mt-2">
        Already have an account? Please{" "}
        <Link href={"/sign-in"} className="text-primary underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
