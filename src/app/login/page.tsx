"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@/components/Inputs/TextField";
import PasswordField from "@/components/Inputs/PasswordField";
import "@/styles/form.css";
import "@/styles/buttons.css";
import { useForm } from "@/hooks/useForm";
import { loginUser } from "@/services/Auth/AuthService";
import { useToast } from "@/components/Ui/ToastContext";

const Page = () => {
  const [formData, handleChange] = useForm({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const token = await loginUser(formData.email, formData.password);
      if (token) {
        toast.addToast("success", "Inicio de sesión exitoso");
        // guarda token si loginUser no lo hace internamente
        // storageService.setToken(token);
        router.push("/admin");
      } else {
        toast.addToast("error", "No se recibió token de autenticación");
      }
    } catch (err: any) {
      const msg = err?.message || "Error durante el inicio de sesión";
      toast.addToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-auth">
      <div className="form-container w-full max-w-md mx-4 sm:mx-0">
        <h1 className="text-primary font-bold text-center mb-4">INICIO DE SESIÓN</h1>
        <form onSubmit={handleLogin} noValidate>
          <TextField
            placeholder="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <PasswordField
            placeholder="Contraseña"
            name="password"
            value={formData.password}
            handleChange={handleChange}
          />
          <button className="primary-button font-bold w-full" type="submit" disabled={loading}>
            {loading ? "Cargando..." : "INICIAR SESIÓN"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿No tienes una cuenta? <Link href="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
