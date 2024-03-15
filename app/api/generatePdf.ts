// pages/api/generatePdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb } from 'pdf-lib';

async function generatePdf(data: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  page.drawText(JSON.stringify(data), {
    x: 50,
    y: 700,
    size: 20,
    color: rgb(0, 0, 0),
  });

  return pdfDoc;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body.data; // Assuming data is sent in the request body
  const pdfDoc = await generatePdf(data);

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
  res.send(pdfBytes);
};
