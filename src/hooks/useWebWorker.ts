import { useEffect, useState } from "react";

import * as Song from "@/lib/songParser/object/song";

const useWebWorker = (workerFunction: () => void, inputData: Song.t | null) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // const memoizedWorkerFunction = useCallback(workerFunction, []);

  useEffect(() => {
    if (!inputData) return;
    setLoading(true);
    setError(null);
    try {
      const code = workerFunction.toString();
      const blob = new Blob([`(${code})()`], {
        type: "application/javascript",
      });
      const workerScriptUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerScriptUrl);

      worker.postMessage(inputData);

      worker.onmessage = (e) => {
        setResult(e.data);
        setLoading(false);
      };

      worker.onerror = (e) => {
        setError(e.message);
        setLoading(false);
      };
      return () => {
        worker.terminate();
        URL.revokeObjectURL(workerScriptUrl);
      };
    } catch (error) {
      console.error(error);
    }
  }, [workerFunction, inputData]);

  return { result, error, loading };
};

export default useWebWorker;
