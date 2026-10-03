// Reads a resume in the browser. Nothing is uploaded to a server.
// PDF needs one package:  npm i pdfjs-dist
export async function readResume(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    let out = '';
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      out += (await page.getTextContent()).items.map(i => i.str).join(' ') + '\n';
    }
    return out;
  }
  if (/\.(txt|md|csv|rtf)$/.test(name) || file.type.startsWith('text/')) return file.text();
  throw new Error('Upload a PDF or .txt file, or paste your resume text below.');
}
