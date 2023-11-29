import React, { useState, useCallback, useEffect } from 'react'
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import '../../../css/pdf-rendering.css';

// @ts-ignore
const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  // @ts-ignore
  import.meta.url,
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type PDFFile = string | File | null;

interface PdfToPageProps {
  filepath: string;
  setNumPages: (numPages: number) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const BACKEND_PATH_FOR_POPULATION_FILES = '/backend/media/populations/'

const PdfToPage = ({
  filepath,
  setNumPages,
  currentPage,
  setCurrentPage,
}: PdfToPageProps) => {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [file, setFile] = useState<PDFFile>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setCurrentPage(1);
  }
  useResizeObserver(containerRef, {}, onResize);

  useEffect(() => {
    if (!filepath) return
    const trimmedFileAddress = BACKEND_PATH_FOR_POPULATION_FILES + `${filepath.split('/populations/')[1]}`
    fetch(trimmedFileAddress).then(res => res.blob()).then(blob => {
      const tempfile = new File([blob], filepath, { type: 'application/pdf' });
      setFile(tempfile)
    });
  }, [filepath]);

  // Inverse of #27292B (background color)
  const inverseColor = '#D8D6D4';

  return (
    <div className="invert-colors" ref={setContainerRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          canvasBackground={inverseColor}
          key={`page_${currentPage}`}
          pageNumber={currentPage}
        />
      </Document>
    </div>
  )
}

export default PdfToPage