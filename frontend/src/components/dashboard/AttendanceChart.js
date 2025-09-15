import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Wajib mendaftarkan plugin chart.js sekali saja
Chart.register(...registerables);

// Menerima 'data' sebagai props dari komponen induk
export default function AttendanceChart({ data }) {
  // Jika data tidak ada atau kosong, tampilkan pesan
  if (!data || data.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted">
        Tidak ada data kehadiran yang tersedia.
      </div>
    );
  }

  // Siapkan data untuk Chart.js
  const chartData = {
    labels: data.map(item => item.day), // ✅ Gunakan labels dari data dinamis
    datasets: [
      {
        label: "Check-ins",
        data: data.map(item => item.count), // ✅ Gunakan data dari data dinamis
        fill: false,
        borderColor: "#0d6efd",
        backgroundColor: "#0d6efd",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#333" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#333" },
        grid: { color: "#e5e5e5" },
      },
      y: {
        ticks: { color: "#333" },
        grid: { color: "#e5e5e5" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}