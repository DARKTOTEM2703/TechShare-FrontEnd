"use client";
import React from 'react';
import { useState } from 'react';
import TextField from '@/components/Inputs/TextField';
import PasswordField from '@/components/Inputs/PasswordField';
import '@/styles/form.css';
import '@/styles/buttons.css';
import { useForm } from '@/hooks/useForm';
import { setToken } from '@/services/storageService';
import { loginUser } from '@/services/Auth/AuthService';

const Page = () => {
    const [formData, handleChange] = useForm({
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = await loginUser(formData.email, formData.password);
            if (token) {
                setToken(token);
                console.log('Login successful, token set:', token);
            } else {
                console.warn('Login failed, no token received.');
            }
        } catch (error) {
            console.error('Error during login:', error);
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
                <p className='mt-[20px]'>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
            </div>
        </div>
    );
};

export default Page;
