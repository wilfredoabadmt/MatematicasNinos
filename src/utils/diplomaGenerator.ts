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

  // 1. Fondo de Diploma (Crema Cálido Elegante)
  doc.setFillColor(255, 249, 236); // #FFF9EC
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Bordes Dobles (Morado Profundo y Oro)
  doc.setDrawColor(53, 32, 111); // #35206F Morado Real
  doc.setLineWidth(3.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  doc.setDrawColor(255, 201, 40); // #FFC928 Oro Brillante
  doc.setLineWidth(1.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'S');

  // 3. Encabezado Oficial KidGenius Club
  doc.setTextColor(53, 32, 111);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('KIDGENIUS CLUB', pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(122, 201, 67); // #7AC943 Verde Geni
  doc.setFontSize(16);
  doc.text('CERTIFICADO OFICIAL DE CAMPEÓN MATEMÁTICO', pageWidth / 2, 40, { align: 'center' });

  // Línea divisoria dorada
  doc.setDrawColor(255, 201, 40);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 65, 45, pageWidth / 2 + 65, 45);

  // 4. Nombre y Apellido del Niño
  doc.setTextColor(107, 98, 128); // #6B6280
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Otorgado con orgullo y admiración a:', pageWidth / 2, 58, { align: 'center' });

  doc.setTextColor(36, 26, 61); // #241A3D
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text((playerName || 'Campeón KidGenius').toUpperCase(), pageWidth / 2, 73, { align: 'center' });

  // Título de Logro
  doc.setTextColor(255, 138, 37); // #FF8A25 Naranja
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('MAESTRO DE LAS MATEMÁTICAS', pageWidth / 2, 86, { align: 'center' });

  // Subtexto
  doc.setTextColor(53, 32, 111);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Por completar con dedicación, alegría y perseverancia sus misiones junto a ${hero.name}.`,
    pageWidth / 2,
    97,
    { align: 'center' }
  );

  // Estadísticas del Campeón
  doc.setFillColor(255, 243, 217); // #FFF3D9
  doc.roundedRect(pageWidth / 2 - 85, 107, 170, 22, 4, 4, 'F');
  doc.setDrawColor(255, 201, 40);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth / 2 - 85, 107, 170, 22, 4, 4, 'S');

  doc.setTextColor(53, 32, 111);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Misiones Superadas: ${totalEggs}  |  Puntaje Total: ${score} Puntos`,
    pageWidth / 2,
    121,
    { align: 'center' }
  );

  // 5. Sello Dorado de Cera KidGenius Club
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.beginPath();
      ctx.arc(150, 150, 130, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFC928';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#35206F';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(150, 150, 110, 0, 2 * Math.PI);
      ctx.fillStyle = '#7AC943';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px Helvetica';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GENIUS', 150, 120);
      ctx.font = 'bold 48px Helvetica';
      ctx.fillText('🏆', 150, 175);

      const sealData = canvas.toDataURL('image/png');
      doc.addImage(sealData, 'PNG', 24, 140, 46, 46);
    }
  } catch (_e) {
    /* ignore */
  }

  // Firmas Oficiales
  doc.setDrawColor(53, 32, 111);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 45, 165, pageWidth / 2 + 45, 165);
  doc.line(pageWidth - 80, 165, pageWidth - 20, 165);

  doc.setTextColor(53, 32, 111);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Firma de ${hero.name}`, pageWidth / 2, 172, { align: 'center' });
  doc.text('Comité KidGenius Club', pageWidth - 50, 172, { align: 'center' });

  // 6. Pie de Página
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 98, 128);
  doc.text('KidGenius Club • Convierte la práctica de matemáticas en una aventura', pageWidth / 2, 192, {
    align: 'center',
  });

  // Descargar PDF
  doc.save(`Diploma_KidGenius_${(playerName || 'Campeon').replace(/\s+/g, '_')}.pdf`);
};
