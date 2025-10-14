"use client"
import Link from 'next/link';
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import TextField from "@/components/Inputs/TextField";
import PasswordField from "@/components/Inputs/PasswordField";
import '@/styles/containers.css'
import '@/styles/form.css'
import '@/styles/buttons.css'
import { useForm } from "@/hooks/useForm";
import endpoints from '../infraestructure/config/configAPI';
import { useToast } from '@/components/Ui/ToastContext';
import { useState } from 'react';

export default function Register() {

    const [formData, handleChange] = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Estados para fecha de nacimiento y género
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [gender, setGender] = useState('');

    const toast = useToast();

    // Manejo del registro
    const handleRegister = async (e: any) => {
        e.preventDefault(); // Evitar que el formulario se envíe por defecto
        
        // Validación de contraseñas
        if (formData.password !== formData.confirmPassword) {
            toast.addToast('error', "Las contraseñas no coinciden");
            return;
        }

        // Validaciones básicas del lado del cliente
        if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
            toast.addToast('error', "Todos los campos son obligatorios");
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.addToast('error', "Email inválido");
            return;
        }

        // Validación de password (mínimo 8 caracteres, al menos una mayúscula, minúscula, número y carácter especial)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#.,:;])[A-Za-z\d@$!%*?&_\-#.,:;]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.addToast('error', "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales");
            return;
        }

        // Construir fecha de nacimiento si se proporcionó
        let birthDate = null;
        if (birthDay && birthMonth && birthYear) {
            birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
        }

        try {
            const requestBody: any = {
                user_name: formData.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, ''),
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };

            // Agregar campos opcionales solo si tienen valor
            if (birthDate) {
                requestBody.birthDate = birthDate;
            }
            if (gender) {
                requestBody.gender = gender;
            }

            const response = await fetch(endpoints.signUp, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al registrar usuario' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            const data = await response.json();
            toast.addToast('success', 'Registro exitoso. Por favor verifica tu email.');
            
            // Limpiar formulario
            formData.first_name = '';
            formData.last_name = '';
            formData.email = '';
            formData.password = '';
            formData.confirmPassword = '';
            
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.addToast('error', message || 'Error desconocido');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="form-container w-[50vh]">
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
                    
                    {/* Fecha de nacimiento */}
                    <div className="mb-4">
                        <label className="block text-primary font-semibold mb-2">
                            Fecha de nacimiento
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <select
                                value={birthDay}
                                onChange={(e) => setBirthDay(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Día</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <select
                                value={birthMonth}
                                onChange={(e) => setBirthMonth(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Mes</option>
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                            <select
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Año</option>
                                {Array.from({ length: 100 }, (_, i) => 2024 - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Género */}
                    <div className="mb-4">
                        <label className="block text-primary font-semibold mb-2">
                            Género
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Mujer"
                                    checked={gender === 'Mujer'}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <span>Mujer</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Hombre"
                                    checked={gender === 'Hombre'}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <span>Hombre</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Otro"
                                    checked={gender === 'Otro'}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <span>Otro</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className="primary-button font-bold w-full"
                        type="submit">
                        REGÍSTRARSE
                    </button>
                </form>
                <p>¿Ya tienes una cuenta? <Link href="/login">Iniciar sesión</Link></p>
            </div>
        </div>
    )
}
