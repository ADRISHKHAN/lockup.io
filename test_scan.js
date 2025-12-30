import { writeFileSync } from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { loadPDF, scanPage } from './src/lib/scanner.js';
import path from 'path';

(async () => {
    // Create a simple PDF with some text containing email and phone number
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    page.drawText('Contact: john.doe@example.com Phone: +1-555-123-4567', {
        x: 50,
        y: height - 100,
        size: 12,
        color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(process.cwd(), 'test.pdf');
    writeFileSync(pdfPath, pdfBytes);
    // Mock a File-like object for loadPDF
    const file = {
        arrayBuffer: async () => pdfBytes,
    };
    const pdf = await loadPDF(file);
    const result = await scanPage(pdf, 1, console.log);
    console.log('Risks detected:', result.risks);
})();
