import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../api/axios";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const PetForm = () => {
  const schema = z.object({
    name: z.string().min(1).max(20),
    description: z.string(),
    status: z.string().min(1).max(10),
    breed: z.string().min(1).max(20),
    age: z.number().int().positive(),
    size: z.string().min(1).max(10),
    color: z.string().min(1).max(10),
    gender: z.string().min(1).max(10),
    medical_history: z.string().nullable(),
    behavior: z.string().nullable(),
    special_needs: z.string().nullable(),
    // This took so long to get working :)))
    avatar: z.any().refine((data: FileList | null) => {
      if (data && data.length > 0) {return true;}
      return false;
    }, 
    {message: "Please upload an avatar image."}),
  });
  type ValidationSchemaType = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ValidationSchemaType>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/pet_listings/', data);
      console.log('Pet listing created successfully:', response.data);

    } catch (error: any) {
      console.error('Error creating pet listing:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-2" encType="multipart/form-data">
      <label htmlFor="name" className="text-green-500">Name:</label>
      <input {...register("name")} id="name" placeholder="Name" className="w-full" />
      {errors.name && <><div></div><p className="text-red-500">{errors.name.message}</p></>}

      <label htmlFor="description" className="text-green-500">Description:</label>
      <textarea {...register("description")} id="description" placeholder="Description" className="w-full" />
      {errors.description && <><div></div><p className="text-red-500">{errors.description.message}</p></>}

      <label htmlFor="status" className="text-green-500">Status:</label>
      <select {...register("status")} id="status" className="w-full">
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="adopted">Adopted</option>
        <option value="withdrawn">Withdrawn</option>
      </select>
      {errors.status && <><div></div><p className="text-red-500">{errors.status.message}</p></>}

      <label htmlFor="breed" className="text-green-500">Breed:</label>
      <input {...register("breed")} id="breed" placeholder="Breed" className="w-full" />
      {errors.breed && <><div></div><p className="text-red-500">{errors.breed.message}</p></>}

      <label htmlFor="age" className="text-green-500">Age:</label>
      <input {...register("age", { setValueAs: (value: number) => Number(value) })} id="age" type="number" placeholder="Age" className="w-full" />
      {errors.age && <><div></div><p className="text-red-500">{errors.age.message}</p></>}

      <label htmlFor="size" className="text-green-500">Size:</label>
      <select {...register("size")} id="size" className="w-full">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      {errors.size && <><div></div><p className="text-red-500">{errors.size.message}</p></>}

      <label htmlFor="color" className="text-green-500">Color:</label>
      <input {...register("color")} id="color" placeholder="Color" className="w-full" />
      {errors.color && <><div></div><p className="text-red-500">{errors.color.message}</p></>}

      <label htmlFor="gender" className="text-green-500">Gender:</label>
      <select {...register("gender")} id="gender" className="w-full">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {errors.gender && <><div></div><p className="text-red-500">{errors.gender.message}</p></>}

      <label htmlFor="avatar" className="text-green-500">Avatar:</label>
      <input {...register("avatar")} id="avatar" accept="image/*" type="file" className="w-full"
        
      />
      {errors.avatar && <><div></div><p className="text-red-500">{errors.avatar.message?.toString()}</p></>}

      <label htmlFor="medical_history" className="text-green-500">Medical History:</label>
      <textarea {...register("medical_history")} id="medical_history" placeholder="Medical History" className="w-full" />
      {errors.medical_history && <><div></div><p className="text-red-500">{errors.medical_history.message}</p></>}

      <label htmlFor="behavior" className="text-green-500">Behavior:</label>
      <textarea {...register("behavior")} id="behavior" placeholder="Behavior" className="w-full" />
      {errors.behavior && <><div></div><p className="text-red-500">{errors.behavior.message}</p></>}

      <label htmlFor="special_needs" className="text-green-500">Special Needs:</label>
      <textarea {...register("special_needs")} id="special_needs" placeholder="Special Needs" className="w-full" />
      {errors.special_needs && <><div></div><p className="text-red-500">{errors.special_needs.message}</p></>}

      <button type="submit" disabled={isSubmitting} className="bg-blue-500 disabled:bg-gray-500 py-2 rounded w-full col-span-full">
        Create Pet Listing!
      </button>
    </form>
  );
};

export default PetForm;