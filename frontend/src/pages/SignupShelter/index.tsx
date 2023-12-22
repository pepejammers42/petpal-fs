import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import axios from "../../api/axios";

const schema = z
  .object({
    email: z.string().email(),
    shelterName: z.string().min(1, "Shelter name is required"),
    phoneNumber: z.string().optional(),
    description: z.string().optional(),
    address: z.string().min(1, "Address is required"),
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

function SignupShelter() {
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

  const onSubmit = async (data: FieldValues) => {
    console.log("Form Data:", data.avatar);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("shelter_name", data.shelterName);
    formData.append("confirm_password", data.confirmPassword);

    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);

    formData.append("password", data.password);

    if (data.avatar) formData.append("avatar", data.avatar);

    try {
      const response = await axios.post("/accounts/shelter/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", response.data);
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
    <div className="w-1/5 mx-auto gap-2">
      <h2 className="font-noto text-4xl font-medium pt-10">Pet Shelter</h2>
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
          Shelter Name
          <input
            {...register("shelterName")}
            placeholder="Shelter Name"
            className="border-black border"
          />
        </label>
        {errors.shelterName && (
          <p className="text-red-500">{`${errors.shelterName.message}`}</p>
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
          Description
          <input
            {...register("description")}
            placeholder="Description"
            className="border-black border"
          />
        </label>
        {errors.description && (
          <p className="text-red-500">{`${errors.description.message}`}</p>
        )}

        <label className="flex flex-col">
          Address
          <input
            {...register("address")}
            placeholder="Address"
            className="border-black border"
          />
        </label>
        {errors.address && (
          <p className="text-red-500">{`${errors.address.message}`}</p>
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupShelter;
