import jsPDF from 'jspdf';
import { Hero } from '../data/heroes';

export const generateDiplomaPDF = async (hero: Hero, score: number, totalEggs: number, playerName?: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 1. Fondo de Diploma (Crema Elegante)
  doc.setFillColor(254, 252, 232);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Bordes Dorados y Verdes Esmeralda Dobles
  doc.setDrawColor(217, 119, 6); // Oro
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  doc.setDrawColor(22, 101, 52); // Verde Esmeralda
  doc.setLineWidth(1.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'S');

  // 3. Encabezado Triunfal
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('DINO MATH • VALLE JURASICO', pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(20);
  doc.text('CERTIFICADO DE REY JURASICO', pageWidth / 2, 42, { align: 'center' });

  // Línea divisoria decorativa
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 60, 46, pageWidth / 2 + 60, 46);

  // 4. Nombre y Apellido del Niño
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Otorgado con orgullo al Campeon Matematico:', pageWidth / 2, 58, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text((playerName || 'Campeon Jurasico').toUpperCase(), pageWidth / 2, 72, { align: 'center' });

  // Título de Logro
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAESTRO DEL VALLE JURASICO', pageWidth / 2, 85, { align: 'center' });

  // Subtexto
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Acompanado por su fiel amigo ${hero.name}, demostrando sabiduria y valentia en las matematicas.`, pageWidth / 2, 96, { align: 'center' });

  // Estadísticas del Campeón
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(pageWidth / 2 - 85, 105, 170, 24, 4, 4, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth / 2 - 85, 105, 170, 24, 4, 4, 'S');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Huevos Recolectados: ${totalEggs}  |  Puntos Jurasicos: ${score}`, pageWidth / 2, 120, { align: 'center' });

  // 5. Firma y Sello Jurásico en Canvas
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Dibujar Sello Dorado de Cera del T-Rex
      ctx.beginPath();
      ctx.arc(150, 150, 130, 0, 2 * Math.PI);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(150, 150, 110, 0, 2 * Math.PI);
      ctx.fillStyle = '#b45309';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Helvetica';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CAMPEÓN', 150, 120);
      ctx.font = 'bold 50px Helvetica';
      ctx.fillText('🏆', 150, 175);

      const sealData = canvas.toDataURL('image/png');
      doc.addImage(sealData, 'PNG', 22, 140, 45, 45);
    }
  } catch (_e) { /* ignore */ }

  // Firma del Dinosaurio Líder
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 40, 165, pageWidth / 2 + 40, 165);
  doc.line(pageWidth - 75, 165, pageWidth - 25, 165);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Firma de ${hero.name}`, pageWidth / 2, 172, { align: 'center' });
  doc.text('Consejo del Valle Jurásico', pageWidth - 50, 172, { align: 'center' });

  // 6. Pie de Página
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Dino Math • Juego Oficial de Matemáticas para Niños', pageWidth / 2, 192, { align: 'center' });

  // Descargar PDF
  doc.save(`Diploma_Jurasico_${hero.name.replace(/\s+/g, '_')}.pdf`);
};
