"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@/components/Inputs/TextField";
import PasswordField from "@/components/Inputs/PasswordField";
import "@/styles/form.css";
import "@/styles/buttons.css";
import { useForm } from "@/hooks/useForm";
import { loginUser } from "@/services/Auth/AuthService";
import { useToast } from "@/components/Ui/ToastContext";
import { getToken } from "@/services/storageService";
import endpoints from "@/app/infraestructure/config/configAPI";

const Page = () => {
  const [formData, handleChange] = useForm({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Si ya tiene token, redirigir al dashboard
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const token = await loginUser(formData.email, formData.password);
      if (!token) {
        toast.addToast("error", "No se recibió token de autenticación");
        setLoading(false);
        return;
      }

      // ✅ VERIFICAR ROL ANTES DE REDIRIGIR
      // Llamar a /user/me para obtener roles del usuario
      const response = await fetch(endpoints.users.getUserDetails, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.addToast("error", "No se pudo verificar el rol del usuario");
        setLoading(false);
        return;
      }

      const userData = await response.json();
      console.log("👤 Usuario autenticado:", userData);

      // Verificar si tiene rol ADMIN
      const isAdmin = userData.roles?.some((role: string) => 
        role.toUpperCase().includes("ADMIN")
      );

      toast.addToast("success", "Inicio de sesión exitoso");

      // Redirigir según el rol
      if (isAdmin) {
        console.log("✅ Usuario es ADMIN → redirigiendo a /admin");
        router.push("/admin");
      } else {
        console.log("❌ Usuario NO es ADMIN → redirigiendo a /access-denied");
        router.push("/access-denied");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error durante el inicio de sesión";
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
          <button 
            className={`primary-button font-bold w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "INICIAR SESIÓN"
            )}
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
