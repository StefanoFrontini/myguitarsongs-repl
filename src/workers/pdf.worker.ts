import { expose } from "comlink";
import type { PDFProps } from "../app/pdf/PDF";
let log = console.info;

const renderPDFInWorker = async (props: PDFProps) => {
  try {
    const { renderPDF } = await import("../app/pdf/renderPDF");
    const blob = renderPDF(props);
    return blob;
  } catch (error) {
    log(error);
    throw error;
  }
};

const onProgress = (cb: typeof console.info) => (log = cb);

expose({ renderPDFInWorker, onProgress });

export type WorkerType = {
  renderPDFInWorker: typeof renderPDFInWorker;
  onProgress: typeof onProgress;
};
