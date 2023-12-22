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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <input {...register("email")} type="email" placeholder="Email" />
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input {...register("shelterName")} placeholder="Shelter Name" />
      {errors.shelterName && (
        <p className="text-red-500">{`${errors.shelterName.message}`}</p>
      )}

      <input {...register("password")} placeholder="Password" type="password" />
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register("confirmPassword")}
        placeholder="Confirm Password"
        type="password"
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <input {...register("phoneNumber")} placeholder="Phone Number" />
      {errors.phoneNumber && (
        <p className="text-red-500">{`${errors.phoneNumber.message}`}</p>
      )}

      <input {...register("description")} placeholder="Description" />
      {errors.description && (
        <p className="text-red-500">{`${errors.description.message}`}</p>
      )}

      <input {...register("address")} placeholder="Address" />
      {errors.address && (
        <p className="text-red-500">{`${errors.address.message}`}</p>
      )}
      <input type="file" onChange={onFileChange} />
      {avatar && <p>File: {avatar.name}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default SignupShelter;
