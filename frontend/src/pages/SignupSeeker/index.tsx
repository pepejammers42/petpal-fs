import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().optional(),
    preference: z.string().optional(),
    location: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignupSeeker() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const avatar = watch("avatar");
  let navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    console.log("Form Data:", data.avatar);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("confirm_password", data.confirmPassword);

    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.preference) formData.append("preference", data.preference);
    if (data.location) formData.append("location", data.location);

    formData.append("password", data.password);

    if (data.avatar) formData.append("avatar", data.avatar);

    try {
      const response = await axios.post("/accounts/seeker/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", response.data);
      navigate("/login");
    } catch (error) {
      console.log("smth went wrong");
    }
    reset();
  };

  // Custom handler for file input
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Files:", files);
    if (files) {
      setValue("avatar", files[0]);
    }
  };

  return (
    <div className="w-1/5 mx-auto gap-2 min-w-fit">
      <h2 className="font-noto text-4xl font-medium pt-10">Pet Seeker</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <label className="flex flex-col">
          Email
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="border-black border"
          />
        </label>
        {errors.email && (
          <p className="text-red-500">{`${errors.email.message}`}</p>
        )}

        <label className="flex flex-col">
          First Name
          <input
            {...register("firstName")}
            placeholder="First Name"
            className="border-black border"
          />
        </label>
        {errors.firstName && (
          <p className="text-red-500">{`${errors.firstName.message}`}</p>
        )}

        <label className="flex flex-col">
          Last Name
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className="border-black border"
          />
        </label>
        {errors.lastName && (
          <p className="text-red-500">{`${errors.lastName.message}`}</p>
        )}

        <label className="flex flex-col">
          Password
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border-black border"
          />
        </label>
        {errors.password && (
          <p className="text-red-500">{`${errors.password.message}`}</p>
        )}

        <label className="flex flex-col">
          Confirm Password
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className="border-black border"
          />
        </label>
        {errors.confirmPassword && (
          <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
        )}

        <label className="flex flex-col">
          Phone Number
          <input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            className="border-black border"
          />
        </label>
        {errors.phoneNumber && (
          <p className="text-red-500">{`${errors.phoneNumber.message}`}</p>
        )}

        <label className="flex flex-col">
          Preference
          <input
            {...register("preference")}
            placeholder="Preference"
            className="border-black border"
          />
        </label>
        {errors.preference && (
          <p className="text-red-500">{`${errors.preference.message}`}</p>
        )}

        <label className="flex flex-col">
          Location
          <input
            {...register("location")}
            placeholder="Location"
            className="border-black border"
          />
        </label>
        {errors.location && (
          <p className="text-red-500">{`${errors.location.message}`}</p>
        )}

        <label className="flex flex-col">
          Avatar
          <input type="file" onChange={onFileChange} />
        </label>
        {avatar && <p>File: {avatar.name}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-white disabled:bg-gray-500 py-2 rounded border-black border-2 w-2/5 mx-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupSeeker;
