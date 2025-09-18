import * as pdfjsLib from 'pdfjs-dist'; // npm install pdfjs-dist

// set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();


export async function extractTextFromFile(file: File): Promise<string>{
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if(fileType == 'application/pdf' || fileName.endsWith('.pdf')){
        return await extractTextFromPDF(file);
    } else{
        throw new Error('Unsupported file type. Please upload a PDF file.');
    }
}

async function extractTextFromPDF(file: File): Promise<string>{
    try{
        console.log("Extracting text from PDF...");
        const arrayBuffer = await file.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        console.log(`PDF loaded with ${pdf.numPages} pages.`);

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++){
            console.log(`Extracting text from page ${i}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
        }

        console.log(`Extracted text length: ${fullText.length} characters.`);
        return fullText.trim();
    } catch (error){
        console.error("Error extracting text from PDF:", error);
        throw new Error('Failed to extract text from PDF.');
    }
}
