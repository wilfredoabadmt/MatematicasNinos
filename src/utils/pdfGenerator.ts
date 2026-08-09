import jsPDF from 'jspdf';
import { Hero } from '../data/heroes';

export const generateColoringPDF = async (hero: Hero, score: number, earnedStars: number, playerName?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;

  // 1. Encabezado de victoria
  doc.setFillColor(34, 197, 94); // Verde Esmeralda
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('DINO MATH - LAMINA PARA COLOREAR POR NUMEROS', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(10);
  const nameText = playerName ? `¡Felicidades ${playerName}! ` : '¡Felicidades Campeon Jurasico! ';
  doc.text(`${nameText}Ganaste ${earnedStars} Huevos y ${score} Puntos`, pageWidth / 2, 18, { align: 'center' });

  // 2. Título del Dinosaurio
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Pinta a tu Amiguito ${hero.name}`, pageWidth / 2, 33, { align: 'center' });

  // 3. Leyenda de Círculos de Colores Numerados
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Leyenda de Colores Numerada:', 15, 42);

  const colors = [
    { num: '1', name: 'Verde Selva', r: 46, g: 125, b: 50 },
    { num: '2', name: 'Amarillo Sol', r: 251, g: 192, b: 45 },
    { num: '3', name: 'Naranja Volcan', r: 245, g: 124, b: 0 },
    { num: '4', name: 'Azul Rio', r: 2, g: 136, b: 209 },
    { num: '5', name: 'Purpura Magico', r: 123, g: 31, b: 162 },
    { num: '6', name: 'Marron Tierra', r: 93, g: 64, b: 55 },
  ];

  let startX = 15;
  const startY = 46;
  const itemWidth = 30;

  colors.forEach((c) => {
    doc.setFillColor(c.r, c.g, c.b);
    doc.circle(startX + 4, startY + 4, 3.5, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.4);
    doc.circle(startX + 4, startY + 4, 3.5, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(c.num, startX + 4, startY + 5.2, { align: 'center' });

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(c.name, startX + 9, startY + 4.5);

    startX += itemWidth;
  });

  // 4. Área Principal de Colorear (Lámina Disney / Pixar Line-Art Limpia)
  const imgY = 60;
  const imgWidth = 145;
  const imgHeight = 145;
  const imgX = (pageWidth - imgWidth) / 2;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.roundedRect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 4, 4, 'S');

  try {
    const imgUrl = `/images/coloring-${hero.id}.png`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;

    await new Promise((res) => {
      img.onload = res;
      img.onerror = res;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 700, 700);
      ctx.drawImage(img, 0, 0, 700, 700);
      const canvasData = canvas.toDataURL('image/png');
      doc.addImage(canvasData, 'PNG', imgX, imgY, imgWidth, imgHeight);
    }
  } catch (_e) { /* ignore */ }

  // 5. Pie de página motivacional
  const footerY = 218;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, footerY, pageWidth - 30, 18, 3, 3, 'F');

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Usa tus lapices de colores para pintar a ${hero.name} segun los numeros`, pageWidth / 2, footerY + 7, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Dino Math • Juego de Matematicas para Ninos', pageWidth / 2, footerY + 13, { align: 'center' });

  // Guardar archivo PDF
  doc.save(`Lamina_Colorear_${hero.name.replace(/\s+/g, '_')}.pdf`);
};
