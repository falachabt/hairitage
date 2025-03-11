
import { Order } from '@/types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Ajout de la définition manquante pour jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateOrderPDF = (order: Order, orderItems: any[]) => {
  try {
    const doc = new jsPDF();
    
    // Logo et en-tête
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("FACTURE", 105, 20, { align: 'center' });
    
    // Informations de la facture
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Date et numéro de facture
    doc.text(`Facture #: ${order.id.substring(0, 8)}`, 20, 40);
    doc.text(`Date: ${format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr })}`, 20, 45);
    doc.text(`Statut: ${order.status === 'completed' ? 'Livré' : order.status === 'processing' ? 'En cours' : 'En attente'}`, 20, 50);
    
    // Informations du client
    doc.text("Adresse de livraison:", 140, 40);
    doc.text(`${order.shipping_address || 'Non spécifiée'}`, 140, 45);
    doc.text(`${order.shipping_city || ''} ${order.shipping_postal_code || ''}`, 140, 50);
    doc.text(`${order.shipping_country || ''}`, 140, 55);
    
    // Informations de l'entreprise
    doc.text("Belle Et Jolie", 20, 70);
    doc.text("123 Avenue de la Beauté", 20, 75);
    doc.text("75000 Paris, France", 20, 80);
    doc.text("Email: contact@belleetjolie.fr", 20, 85);
    doc.text("Téléphone: +33 1 23 45 67 89", 20, 90);
    
    // Tableau des articles
    const tableColumn = ["Article", "Prix unitaire", "Quantité", "Total"];
    const tableRows: any[][] = [];
    
    if (orderItems && orderItems.length > 0) {
      orderItems.forEach(item => {
        const productData = [
          item.products?.name || 'Produit',
          `${Number(item.unit_price).toFixed(2)} €`,
          item.quantity,
          `${Number(item.total_price).toFixed(2)} €`
        ];
        tableRows.push(productData);
      });
    } else {
      tableRows.push(['Aucun article trouvé', '0.00 €', '0', '0.00 €']);
    }
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      theme: 'grid',
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
      styles: { font: 'helvetica', fontSize: 10 },
      didDrawPage: (data) => {
        doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Total: ${Number(order.total_amount).toFixed(2)} €`, 150, finalY);
    
    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("Merci pour votre achat chez Belle Et Jolie!", 105, pageHeight - 20, { align: 'center' });
    doc.text("Nous espérons vous revoir bientôt.", 105, pageHeight - 15, { align: 'center' });
    
    // Téléchargement du PDF
    doc.save(`Facture-${order.id.substring(0, 8)}.pdf`);
    
    console.log("PDF successfully generated");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
