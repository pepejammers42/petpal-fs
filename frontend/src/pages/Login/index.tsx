import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const Login = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(""); // Add a state for login error
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const errorResponse = await login({
      email: data.email,
      password: data.password,
    });
    if (errorResponse) {
      setLoginError(errorResponse.message);
    } else {
      setLoginError("");
    }
    reset();
  };

  return (
    <div className="w-1/5 mx-auto pt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="border-black border rounded"
        />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="border-black border rounded"
        />
        {loginError && (
          <div className="text-red-500 text-sm">{loginError}</div> // Display error message
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-white disabled:bg-gray-500 py-2 rounded border-black border-2 w-2/5 mx-auto"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
