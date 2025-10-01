"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import TextField from '@/components/Inputs/TextField';
import PasswordField from '@/components/Inputs/PasswordField';
import '@/styles/form.css';
import '@/styles/buttons.css';
import { useForm } from '@/hooks/useForm';
import { loginUser } from '@/services/Auth/AuthService';

const Page = () => {
    const [formData, handleChange] = useForm({
        email: '',
        password: '',
    });

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = await loginUser(formData.email, formData.password);
            if (token) {
                alert('Inicio de sesión exitoso');
                router.push('/admin/');
            } else {
                alert('Error: No se recibió el token de autenticación');
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error durante el inicio de sesión');
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className="form-container w-[50vh]">
                <h1 className="text-primary font-bold">INICIO DE SESIÓN</h1>
                <form onSubmit={handleLogin}>
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
                    <button className="primary-button font-bold" type="submit">
                        INICIAR SESIÓN
                    </button>
                </form>
                <p className='mt-[20px]'>¿No tienes una cuenta? <Link href="/register">Regístrate</Link></p>
            </div>
        </div>
    );
};

export default Page;
