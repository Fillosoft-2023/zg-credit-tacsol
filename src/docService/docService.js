import { savePDF } from '@progress/kendo-react-pdf';

class DocService {
  createPdf = (html) => {
    savePDF(html, { 
      paperSize: 'Legal',
      fileName: 'sheet.pdf',
      margin: 0,
      landscape: true,
      scale : 0.8
    })
  }
}

const Doc = new DocService();
export default Doc;