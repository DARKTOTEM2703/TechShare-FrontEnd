"use client";

import React, { useState, useEffect } from "react";
import endpoints from "@/app/infraestructure/config/configAPI";
import { getToken } from "@/services/storageService";
import "@/styles/form.css";
import "@/styles/buttons.css";
import "@/styles/modal.css";
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly';
import { AnimatedSection } from '@/components/Ui/AnimatedComponents';

interface SolicitudDetail {
  id: number;
  material_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Solicitud {
  id: number;
  usuario_name: string;
  date: string;
  status: "PENDING" | "BORROWED" | "RETURNED" | "OVERDUE" | "CANCELLED";
  details: SolicitudDetail[];
  amount: number;
}

const SolicitudesComponent = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError("No autorizado. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await fetch(endpoints.solicitudes.getAll, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: Solicitud[] = await response.json();
      setSolicitudes(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar solicitudes";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    const s = solicitudes.find((x) => x.id === id) || null;
    setSelectedSolicitud(s);
    setShowModal(!!s);
  };

  const handleDeleteSolicitud = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) return;
    try {
      const token = getToken();
      const response = await fetch(`${endpoints.solicitudes.getAll}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al cancelar la solicitud");
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al cancelar la solicitud");
    }
  };

  const handleApproveSolicitud = async (id: number) => {
    try {
      const token = getToken();
      const response = await fetch(`${endpoints.solicitudes.getAll}/${id}?status=APPROVED`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al aprobar la solicitud");
      fetchSolicitudes();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al aprobar la solicitud");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "BORROWED":
        return "#4CAF50";
      case "RETURNED":
        return "#2196F3";
      case "OVERDUE":
        return "#F44336";
      case "CANCELLED":
        return "#9E9E9E";
      default:
        return "#666";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "BORROWED":
        return "Prestado";
      case "RETURNED":
        return "Devuelto";
      case "OVERDUE":
        return "Vencido";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Transform data for CrudBody
  const rows = solicitudes.map((s) => ({
    id: s.id,
    usuario: s.usuario_name || "No especificado",
    items: `${s.details?.length || 0} Items`,
    fecha: new Date(s.date).toLocaleDateString("es-ES"),
    estado: getStatusLabel(s.status),
  }));

  const headerLabels = {
    usuario: 'Usuario solicitante',
    items: 'Items en el carrito',
    fecha: 'Fecha',
    estado: 'Estado',
  };

  return (
    <div className="container-responsive spacing-y-responsive">
      <AnimatedSection animation="fade-in">
        <CrudHeader
          title="Solicitudes"
          dropdownOptions={[]}
          buttonLabel=""
          buttonFunction={() => {}}
          onSearchChange={(v) => setSearchTerm(v)}
          buttonDisabled={true}
        />
      </AnimatedSection>

      {error && (
        <div style={{ padding: 15, marginBottom: 20, backgroundColor: '#ffebee', borderLeft: '4px solid #f44336', color: '#c62828', borderRadius: 4 }}>
          {error}
        </div>
      )}

      <CrudBody
        data={rows}
        headerLabels={headerLabels}
        headers={['id','usuario','items','fecha','estado']}
        searchTerm={searchTerm}
        onSelected={(id: number) => handleViewDetails(id)}
        onMoreInfo={(id: number) => handleViewDetails(id)}
        isLoading={loading}
      />

      {/* Actions modal kept from previous implementation */}
      {showModal && selectedSolicitud && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: '#1e2a5e' }}>Detalles de Solicitud #{selectedSolicitud.id}</h3>
            <div style={{ marginBottom: 15 }}><strong>Usuario:</strong> {selectedSolicitud.usuario_name}</div>
            <div style={{ marginBottom: 15 }}><strong>Fecha:</strong> {new Date(selectedSolicitud.date).toLocaleDateString('es-ES')}</div>
            <div style={{ marginBottom: 15 }}>
              <strong>Estado:</strong>{' '}
              <span style={{ padding: '4px 8px', backgroundColor: getStatusBadgeColor(selectedSolicitud.status), color: '#fff', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                {getStatusLabel(selectedSolicitud.status)}
              </span>
            </div>
            <div style={{ marginBottom: 15 }}><strong>Monto Total:</strong> ${selectedSolicitud.amount?.toFixed(2) || '0.00'}</div>

            <div style={{ marginBottom: 20 }}>
              <strong>Items:</strong>
              <table style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: 8, fontSize: 12 }}>Cantidad</th>
                    <th style={{ textAlign: 'left', padding: 8, fontSize: 12 }}>Precio Unitario</th>
                    <th style={{ textAlign: 'left', padding: 8, fontSize: 12 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSolicitud.details?.map((detail) => (
                    <tr key={detail.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8, fontSize: 12 }}>{detail.quantity}</td>
                      <td style={{ padding: 8, fontSize: 12 }}>${detail.unit_price?.toFixed(2) || '0.00'}</td>
                      <td style={{ padding: 8, fontSize: 12 }}>${detail.total_price?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => { setShowModal(false); setSelectedSolicitud(null); }} style={{ backgroundColor: '#1e2a5e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', width: '100%' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesComponent;
