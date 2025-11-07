"use client"
import Link from 'next/link';
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import TextField from "@/components/Inputs/TextField";
import PasswordField from "@/components/Inputs/PasswordField";
import '@/styles/containers.css'
import '@/styles/form.css'
import '@/styles/buttons.css'
import { useForm } from "@/hooks/useForm";
import endpoints from '../infraestructure/config/configAPI';
import { useToast } from '@/components/Ui/ToastContext';
import { useState } from 'react';
import { generateUsername, isValidUsername } from '@/utils/usernameGenerator';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants/validation';
import { extractErrorMessage } from '@/types/api';

export default function Register() {

    const router = useRouter();
    const toast = useToast();

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
    
    // Estado de loading para prevenir múltiples envíos
    const [isLoading, setIsLoading] = useState(false);

    // NOTA: /register es público, no redirigir usuarios autenticados
    // Permitir que los usuarios autenticados puedan registrar nuevas cuentas si es necesario

    // Manejo del registro
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evitar que el formulario se envíe por defecto
        
        // Prevenir múltiples envíos si ya está procesando
        if (isLoading) {
            return;
        }
        
        // Validación de contraseñas
        if (formData.password !== formData.confirmPassword) {
            toast.addToast('error', VALIDATION_MESSAGES.passwordMismatch);
            return;
        }

        // Validaciones básicas del lado del cliente
        if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
            toast.addToast('error', VALIDATION_MESSAGES.required);
            return;
        }

        // Validación de email usando constante centralizada
        if (!VALIDATION_PATTERNS.email.test(formData.email)) {
            toast.addToast('error', VALIDATION_MESSAGES.email);
            return;
        }

        // Validación de nombre usando constante centralizada
        if (!VALIDATION_PATTERNS.name.test(formData.first_name)) {
            toast.addToast('error', VALIDATION_MESSAGES.name);
            return;
        }

        if (!VALIDATION_PATTERNS.name.test(formData.last_name)) {
            toast.addToast('error', VALIDATION_MESSAGES.name);
            return;
        }

        // Validación de password usando constante centralizada
        if (!VALIDATION_PATTERNS.password.test(formData.password)) {
            toast.addToast('error', VALIDATION_MESSAGES.password);
            return;
        }

        // Construir fecha de nacimiento si se proporcionó
        let birthDate = null;
        if (birthDay && birthMonth && birthYear) {
            birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
        }

        // Activar estado de loading
        setIsLoading(true);

        try {
            // Generar username robusto
            const generatedUsername = generateUsername(formData.email);
            if (!isValidUsername(generatedUsername)) {
                throw new Error('No se pudo generar un nombre de usuario válido');
            }

            const requestBody: Record<string, unknown> = {
                user_name: generatedUsername,
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

            // 🔑 CONSUMIR ENDPOINT DEL BACKEND
            const response = await fetch(endpoints.auth.signUp, {
                method: 'POST',
                body: JSON.stringify(requestBody), // ← ENVÍA EL OBJETO DIRECTAMENTE
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al registrar usuario' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            toast.addToast('success', 'Registro exitoso. Por favor verifica tu email.');
            
            // Redirigir al home
            // El usuario recibirá un email con un link que contiene el token de verificación
            // Cuando haga clic en ese link, irá a /verify?token=xxx
            router.push('/');
            
            // Limpiar formulario
            formData.first_name = '';
            formData.last_name = '';
            formData.email = '';
            formData.password = '';
            formData.confirmPassword = '';
            setBirthDay('');
            setBirthMonth('');
            setBirthYear('');
            setGender('');
            
        } catch (error) {
            const message = extractErrorMessage(error);
            toast.addToast('error', message || 'Error desconocido');
        } finally {
            // Desactivar estado de loading siempre (éxito o error)
            setIsLoading(false);
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
                        className={`primary-button font-bold w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando...
                            </span>
                        ) : (
                            'REGÍSTRARSE'
                        )}
                    </button>
                </form>
                <p>¿Ya tienes una cuenta? <Link href="/login">Iniciar sesión</Link></p>
            </div>
        </div>
    )
}
