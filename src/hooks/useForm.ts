import { useState } from "react";

export const useForm = (initialValues:any) => {
  const [formData, setFormData] = useState(initialValues);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return [formData, handleChange, setFormData];
};