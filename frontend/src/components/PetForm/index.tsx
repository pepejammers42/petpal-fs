import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const PetForm = () => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    status: z.string().min(1), // Add validation as needed
    breed: z.string(),
    age: z.number().nullable(),
    size: z.string().min(1), // Add validation as needed
    color: z.string(),
    gender: z.string().min(1), // Add validation as needed
    avatar: z.any().nullable(), // Allow any file type
  });
  type ValidationSchemaType = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ValidationSchemaType>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <input {...register("name")} placeholder="Name" />
      <textarea {...register("description")} placeholder="Description" />
      <select {...register("status")}>
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="adopted">Adopted</option>
        <option value="withdrawn">Withdrawn</option>
      </select>
      <input {...register("breed")} placeholder="Breed" />
      <input {...register("age", {setValueAs: (value: number) => Number(value)})} type="number" placeholder="Age" />
      <select {...register("size")}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      <input {...register("color")} placeholder="Color" />
      <select {...register("gender")}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        {...register("avatar")}
        type="file"
        accept="image/*"
        onChange={(e) => {
          register("avatar").onChange(e); // Use react-hook-form's onChange directly
        }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Create Pet Listing!
      </button>
    </form>
  );
};

export default PetForm;