"use client"
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import TextField from "@/components/Inputs/TextField";
import PasswordField from "@/components/Inputs/PasswordField";
import '@/styles/containers.css'
import '@/styles/form.css'
import '@/styles/buttons.css'
import { useForm } from "@/hooks/useForm";

export default function Register() {

    const [formData, handleChange] = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Manejo del registro
    const handleRegister = (e: any) => {
        e.preventDefault(); // Evitar que el formulario se envíe por defecto
        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: formData.email.split('@')[0], // Puedes generar el username basado en el email
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                roles: [1, 2] // Aquí puedes ajustar según sea necesario
            })
        };

        fetch('http://localhost:8080/register', requestOptions)
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="form-container">
            <h1 className="text-primary font-bold">
                CREA UNA CUENTA
            </h1>
            <form onSubmit={handleRegister}>
                <TextField
                    placeholder="Nombre"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                />
                <TextField
                    placeholder="Apellido"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                />
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
                <PasswordField
                    placeholder="Confirmar contraseña"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    handleChange={handleChange}
                />
                <button
                    className="primary-button font-bold"
                    type="submit">
                    REGÍSTRATE
                </button>
            </form>
            <p>¿Ya tienes una cuenta? <a href="#">Iniciar sesión</a></p>
        </div>
    )
}
