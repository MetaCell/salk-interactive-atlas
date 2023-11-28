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

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

interface PdfToPageProps {
  filepath: string;
  setNumPages: (numPages: number) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const classes = {
  document: 'pdf-document',
  page: 'pdf-page',
};

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
  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  useEffect(() => {
    if (!filepath) return
    const trimmedFileAddress = BACKEND_PATH_FOR_POPULATION_FILES + `${filepath.split('/populations/')[1]}`
    fetch(trimmedFileAddress).then(res => res.blob()).then(blob => {
      const tempfile = new File([blob], filepath, { type: 'application/pdf' });
      setFile(tempfile)
    });
  }, [filepath]);

  return (
    <div className="dark-mode" ref={setContainerRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}
        className={classes.document}
      >
        <Page
          className={classes.page}
          key={`page_${currentPage}`}
          pageNumber={currentPage}
          renderTextLayer={false}
        />
      </Document>
    </div>
  )
}

export default PdfToPage