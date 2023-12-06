import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";

// TODO: Forget password maybe as a feature.

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});
const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    // TODO: send to server
    try {
      await login({ email: data.email, password: data.password });
    } catch (error) {
      // Handle login errors, e.g., showing an error message
    }
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <input {...register("email")} type="email" placeholder="Email" />
      <input {...register("password")} placeholder="Password" type="password" />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default Login;
