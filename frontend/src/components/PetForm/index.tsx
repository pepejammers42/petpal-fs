import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const PetForm = () => {
  const schema = z.object({
    name: z.string().min(1).max(20),
    description: z.string(),
    status: z.string().min(1).max(10), // Add validation as needed
    breed: z.string().min(1).max(20),
    age: z.number().int().positive(),
    size: z.string().min(1).max(10), // Add validation as needed
    color: z.string().min(1).max(10),
    gender: z.string().min(1).max(10), // Add validation as needed
    avatar: z.custom((value) => {
      if (!(value instanceof File) || !value.name) {
        return false;
      }
      return true;
    })
  });
  type ValidationSchemaType = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ValidationSchemaType>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-2">
      <label htmlFor="name" className="">Name:</label>
      <input {...register("name")} id="name" placeholder="Name" className="w-full" />
      {errors.name && <p className="text-red-500 col-span-full">{errors.name.message}</p>}

      <label htmlFor="description" className="">Description:</label>
      <textarea {...register("description")} id="description" placeholder="Description" className="w-full" />
      {errors.description && <p className="text-red-500 col-span-full">{errors.description.message}</p>}

      <label htmlFor="status" className="">Status:</label>
      <select {...register("status")} id="status" className="w-full">
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="adopted">Adopted</option>
        <option value="withdrawn">Withdrawn</option>
      </select>
      {errors.status && <p className="text-red-500 col-span-full">{errors.status.message}</p>}

      <label htmlFor="breed" className="">Breed:</label>
      <input {...register("breed")} id="breed" placeholder="Breed" className="w-full" />
      {errors.breed && <p className="text-red-500 col-span-full">{errors.breed.message}</p>}

      <label htmlFor="age" className="">Age:</label>
      <input {...register("age", { setValueAs: (value: number) => Number(value) })} id="age" type="number" placeholder="Age" className="w-full" />
      {errors.age && <p className="text-red-500 col-span-full">{errors.age.message}</p>}

      <label htmlFor="size" className="">Size:</label>
      <select {...register("size")} id="size" className="w-full">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      {errors.size && <p className="text-red-500 col-span-full">{errors.size.message}</p>}

      <label htmlFor="color" className="">Color:</label>
      <input {...register("color")} id="color" placeholder="Color" className="w-full" />
      {errors.color && <p className="text-red-500 col-span-full">{errors.color.message}</p>}

      <label htmlFor="gender" className="">Gender:</label>
      <select {...register("gender")} id="gender" className="w-full">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {errors.gender && <p className="text-red-500 col-span-full">{errors.gender.message}</p>}

      <label htmlFor="avatar" className="">Avatar:</label>
      <input
        {...register("avatar")}
        id="avatar"
        type="file"
        onChange={(e) => {
          register("avatar").onChange(e);
        }}
        className="w-full"
      />
      {errors.avatar && <p className="text-red-500 col-span-full">{errors.avatar.message?.toString()}</p>}

      <button type="submit" disabled={isSubmitting} className="bg-blue-500 disabled:bg-gray-500 py-2 rounded w-full col-span-full">
        Create Pet Listing!
      </button>
    </form>
  );
};

export default PetForm;