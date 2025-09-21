import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Wajib mendaftarkan plugin chart.js sekali saja
Chart.register(...registerables);

export default function AttendanceChart({ dataHarian, dataMingguan, dataPaket }) {

  const chartOptions = {
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

  // --- GRAFIK HARIAN ---
  const dailyChartData = {
    labels: dataHarian ? dataHarian.map((item) => item.day) : [],
    datasets: [
      {
        label: "Check-in Harian",
        data: dataHarian ? dataHarian.map((item) => item.count) : [],
        fill: false,
        borderColor: "#0d6efd",
        backgroundColor: "#0d6efd",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // --- GRAFIK MINGGUAN ---
  const weeklyChartData = {
    labels: dataMingguan ? dataMingguan.map((item) => item.week) : [],
    datasets: [
      {
        label: "Check-in Mingguan",
        data: dataMingguan ? dataMingguan.map((item) => item.count) : [],
        fill: true,
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // --- GRAFIK BERDASARKAN PAKET ---
  const packageChartData = {
    labels: dataPaket?.labels || [],
    datasets: dataPaket?.datasets || [],
  };
  
  if (!dataHarian && !dataMingguan && !dataPaket) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted">
        Tidak ada data kehadiran yang tersedia.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-5">
      {dataHarian && dataHarian.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>Grafik Kehadiran Harian</h5>
          <div style={{ height: 300 }}>
            <Line data={dailyChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {dataMingguan && dataMingguan.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>Grafik Kehadiran Mingguan</h5>
          <div style={{ height: 300 }}>
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {dataPaket && dataPaket.datasets.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>Perbandingan Kehadiran Berdasarkan Paket</h5>
          <div style={{ height: 300 }}>
            <Line data={packageChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}