"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useFetchData } from '@/services/useFetchData'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import { useEffect } from 'react';

export default function movements() {

  type Movement = {
    movementsId: number,
    moveType: string,
    quantity: number,
    date: string,
    comment: string,
    usuarioId: number,
    usuarioName: string,
    materialsId: number,
    materialsName: string
  }

  const [data, setData] = useState<Movement[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useAuth()
  const token = getToken()

  const fetchMovements = (token: string) => {
    //e.preventDefault();
    console.log("Fetching movements");
    fetch("http://localhost:8080/admin/movement/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))

  }

  // Función que actualiza el término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token) {
        fetchMovements(token);
      }
    }, 5000); // Intervalo de 5 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, [token]);

  return (
    <div>
      <CrudHeader
        title='Movimientos'
        buttonLabel=''
        buttonFunction={() => alert('')}
        onSearchChange={handleSearchChange} // Asegúrate de pasar esta función
      />
      <CrudBody data={data} searchTerm={searchTerm} /> {/* Pasar el término de búsqueda */}
    </div>
  )
}
