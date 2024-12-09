// import { useEffect } from "react";
import { useAsync } from "react-use";

import { renderPDFWorker } from "../../workers";
import type { WorkerType } from "../../workers/pdf.worker";

export const useRenderPDF = ({
  parsedSong,
}: Parameters<WorkerType["renderPDFInWorker"]>[0]) => {
  const {
    value: blob,
    loading,
    error,
  } = useAsync(async () => {
    return renderPDFWorker({ parsedSong });
  }, [parsedSong]);
  console.log("blob", blob);

  //   useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return { blob, loading, error };
};
