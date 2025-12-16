'use client';

import { useState, useCallback } from 'react';
import fetchData from '@/services/fetchData';
import { BackendErrorResponse, extractErrorMessages } from '@/types/api';

/**
 * Hook para manejar fetches de datos en modales con manejo de errores.
 * Lanza excepciones en lugar de silenciarlas.
 * 
 * @template T - Tipo de datos que se espera
 */
export function useModalFetch<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BackendErrorResponse | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const fetch = useCallback(async (url: string, token?: string) => {
    setLoading(true);
    setError(null);
    setErrorMessages([]);
    
    try {
      const result = await fetchData(url, token) as T;
      setData(result);
      return result;
    } catch (err) {
      // Intentar parsear como JSON error del backend
      let backendError: BackendErrorResponse = {
        message: 'Error desconocido'
      };
      
      try {
        if (err instanceof Error && err.message.startsWith('{')) {
          backendError = JSON.parse(err.message);
        } else if (err instanceof Error) {
          backendError = {
            message: err.message,
            error: 'fetch_error'
          };
        }
      } catch {
        backendError = {
          message: String(err),
          error: 'parse_error'
        };
      }
      
      setError(backendError);
      const messages = extractErrorMessages(backendError);
      setErrorMessages(messages);
      throw backendError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorMessages([]);
  }, []);

  return {
    data,
    loading,
    error,
    errorMessages,
    fetch,
    clearError,
    setData // Permitir actualización manual si es necesario
  };
}
