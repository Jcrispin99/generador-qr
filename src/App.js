import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState(""); // Estado para almacenar el texto del input
  const [qrSize, setQrSize] = useState(300); // Estado para el tamaño del QR
  const [format, setFormat] = useState("png"); // Estado para el formato de descarga
  const canvasRef = useRef(null); // Referencia al canvas

  // Generar el código QR cada vez que el input o el tamaño cambian
  useEffect(() => {
    if (inputValue) {
      QRCode.toCanvas(
        canvasRef.current,
        inputValue,
        { width: qrSize }, // Ajusta el tamaño del QR aquí
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [inputValue, qrSize]);

  // Función para manejar el cambio en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Función para manejar el cambio en el tamaño del QR
  const handleSizeChange = (e) => {
    setQrSize(Number(e.target.value));
  };

  // Función para manejar el cambio en el formato de descarga
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  // Función para descargar el QR en el formato seleccionado
  const downloadQRCode = () => {
    const canvas = canvasRef.current;

    if (format === "pdf") {
      // Descargar en formato PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 100, 100); // Ajusta la posición y tamaño en el PDF
      pdf.save("qr-code.pdf");
    } else {
      // Descargar en formato PNG o JPG
      const url = canvas.toDataURL(`image/${format}`);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code.${format}`;
      link.click();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Generador de Código QR</h1>
      <input
        type="text"
        placeholder="Escribe algo..."
        value={inputValue}
        onChange={handleInputChange}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <div style={{ margin: "20px auto" }}>
        {/* Canvas para el código QR */}
        <canvas ref={canvasRef} />
      </div>
      <div style={{ margin: "20px auto" }}>
        <label style={{ marginRight: "10px" }}>Tamaño:</label>
        <select value={qrSize} onChange={handleSizeChange} style={{ padding: "5px", fontSize: "16px" }}>
          <option value="200">200x200</option>
          <option value="300">300x300</option>
          <option value="400">400x400</option>
        </select>
      </div>
      <div style={{ margin: "20px auto" }}>
        <label style={{ marginRight: "10px" }}>Formato:</label>
        <select value={format} onChange={handleFormatChange} style={{ padding: "5px", fontSize: "16px" }}>
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <button
        onClick={downloadQRCode}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Descargar QR
      </button>
    </div>
  );
}

export default App;
