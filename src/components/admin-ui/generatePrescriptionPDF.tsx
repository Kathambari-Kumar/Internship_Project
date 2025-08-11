import jsPDF from 'jspdf';
import { prescriptionSchema } from '@/lib/validators';
import { z } from 'zod';
import { String } from 'aws-sdk/clients/apigateway';

type prescriptionData = z.infer<typeof prescriptionSchema>;

const exportAndSendPDF = async (data : prescriptionData, 
    fName : string, lName : string, email:string, phone:String) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    // Set text color to amber-200
    pdf.setTextColor(245, 158, 11);
    pdf.setFontSize(18);
    pdf.text("Oves Optik", 105, 15, { align: "center" });

    pdf.setFontSize(16);
    // Set text color to teal-700
    pdf.setTextColor(15, 118, 110);
    pdf.text("Östermalmsvägen 6", 105, 22, { align: "center" });
    pdf.text("Fispång, 61240.", 105, 28, { align: "center" });
    pdf.text("Telefon: 0761968807", 105, 34, { align: "center" });
    pdf.line(10, 37, pageWidth - 10, 37); // horizontal line

    pdf.setTextColor(0,0,0);
    pdf.setFontSize(14);
    pdf.text("Ögonrecept (Eye Prescription)", 10, 44);
    pdf.setFontSize(12)
    pdf.text(`Namn : ${fName} ${lName}`, 10, 51);
    pdf.text(`E-post : ${email}`, 10, 58);
    pdf.text("Date : " + new Date().toLocaleDateString(), 10, 65);
    pdf.line(10, 68, pageWidth - 10, 68); // horizontal line
    pdf.text("Receptvärden", 10, 75);
    pdf.setFontSize(12);
    let y = 85;

    pdf.text("Symptom : " + `${data.currentSymptoms}`, 10, y);
    y += 10; // Add space after the symptom text
    const rows = [
        [`Tid Glas Vänster: ${data.prevGlassLeft}`, `Tid Glas Höger: ${data.prevGlassRight}`],
        [`P.D Vänster: ${data.leftPD}`, `P.D Höger: ${data.rightPD}`],        
        [`Visus (fri) Vänster: ${data.uncorrectedVisualLeft}`, `Visus (fri) Höger: ${data.uncorrectedVisualRight}`],
        [`Visus (korr) Vänster: ${data.correctedVisualLeft}`, `Visus (korr) Höger: ${data.correctedVisualRight}`],
        [`Styrka Vänster: ${data.lensPowerLeft}`, `Styrka Höger: ${data.lensPowerRight}`],
        [`Cylinder Vänster: ${data.cylinderLeft}`, `Cylinder Höger: ${data.cylinderRight}`],
        [`Axel Vänster: ${data.axisLeft}`, `Axel Höger: ${data.axisRight}`],
        [`Add Vänster: ${data.additionLeft}`, `Add Höger: ${data.additionRight}`],
        [`Nöshöjd Vänster: ${data.noseHeightLeft}`, `Nöshöjd Höger: ${data.noseHeightRight}`],
        [`Glastyp Vänster: ${data.glassTypeLeft}`, `Glastyp Höger: ${data.glassTypeRight}`],
        [`Bågeavstånd: ${data.frameDistance}`, `Näravstånd: ${data.nearFrameDistance}`],
    ];
    rows.forEach(([left, right]) => {
        pdf.text(left, 10, y);
        pdf.text(right, 110, y);
        y += 10;
      });
    pdf.setTextColor(15, 118, 110);
    pdf.line(10, y+10, pageWidth - 10, y+10); // horizontal line
    
    const date = new Date().toISOString().split("T")[0]; // "2025-06-16"
    const safeName = `${fName}_${lName}`.replace(/\s+/g, "_"); // Remove spaces
    const fileName = `prescription_${safeName}_${date}.pdf`;
    pdf.save(fileName);
    /* Generate the PDF as a Blob object (binary large object), 
    so it can be sent or uploaded */
    const pdfBlob = pdf.output("blob");
    console.log("pdfBlob : ", pdfBlob);
    
    if(email) {
      // Prepare data to send
        const formData = new FormData();      
        formData.append("pdf", pdfBlob, fileName);
        formData.append("email", email);

      // Send to backend
        const res = await fetch("/api/sendPrescriptionPDF", {
            method: "POST",
            body: formData,
          });

        if (!res.ok) {
            throw new Error("Failed to send email");
        }
    }

    // Send SMS
    const checkDate = new Date("2025-07-23");
    const currentDate = new Date(date);
    if (currentDate < checkDate) {
      const base64 = pdf.output("datauristring").split(",")[1]; // Get base64
      const smsRes = await fetch("/api/sendReceiptLinkToMobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64PDF: base64,
          fileName: fileName.replace(".pdf", ""), // remove extension
          toNumber : phone
        }),
      });

      if (!smsRes.ok) {
        throw new Error("Failed to send SMS");
      } 
    }
    else {
      console.log("Skipping SMS send on or after 24-07-2025(Running on Twilio Trial Account)");
    }
};

export default exportAndSendPDF;


/* html2canvas is a JavaScript library that takes a 
    snapshot of any DOM element and renders it into a canvas image 
    const canvas = await html2canvas(element);
  
    // now an image of the component
    const imgData = canvas.toDataURL("image/png"); 
    
    const imgWidth = 190; // A4 width in jsPDF (approx)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "png", 10, 10, imgWidth, imgHeight); */