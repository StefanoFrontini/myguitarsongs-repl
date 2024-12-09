"use client";

// import { PDFViewer as PDFViewerRenderer } from '@react-pdf/renderer';
// import { ComponentProps, FC, useDeferredValue } from 'react';
import * as Song from "@/lib/songParser/object/song";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useRenderPDF } from "./useRenderPDF";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const RenderedPDFViewer = ({ parsedSong }: { parsedSong: Song.t }) => {
  const { blob, loading, error } = useRenderPDF({ parsedSong });

  //   const src = url ? `${url}#toolbar=${showToolbar ? 1 : 0}` : null;
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="">
      {blob && (
        <Document file={blob}>
          <Page pageNumber={1} width={1000} height={1000}></Page>
        </Document>
      )}
    </div>
  );
};
