"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseSong } from "@/lib/songParser/main";
import * as Song from "@/lib/songParser/object/song";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Lyric = ({ value }: { value: string }) => (
  <span className="leading-10 whitespace-pre">{value}</span>
);
const Chord = ({ value }: { value: string }) => (
  <span className="relative">
    <span className="block absolute  top-[-1.2rem] left-0  font-[family-name:var(--font-chord-symbols)] text-orange-500 font-bold ">
      {value}
    </span>
  </span>
);
const Endofline = () => (
  <>
    <br />
  </>
);

const ErrorComponent = () => (
  <span className="text-red-500">{` Parsing error: ']' expected `}</span>
);

const renderSongElement = (
  { tag, value }: Song.Lyric | Song.Chord | Song.Endofline | Song.ErrorObj,
  index: number
) => {
  switch (tag) {
    case "lyric":
      return <Lyric value={value} key={index} />;
    case "chord":
      return <Chord value={value} key={index} />;
    case "endofline":
      return <Endofline key={index} />;
    case "error":
      return <ErrorComponent key={index} />;
    default:
      const _exhaustiveCheck: never = tag;
      throw new Error(_exhaustiveCheck);
  }
};
type ErrorState = {
  tag: "error";
  value: string;
};
// type IsLoadingState = {
//   tag: "isLoading";
//   value: boolean;
// };
type PdfState = {
  tag: "pdf";
  value: string;
};

type ShouldShowPreviousDocument = {
  tag: "shouldShowPreviousDocument";
  value: boolean;
};

type NullState = {
  tag: "null";
  value: null;
};

type ShouldShowTextLoaderState = {
  tag: "shouldShowTextLoader";
  value: boolean;
};

type RenderingState =
  | ErrorState
  | PdfState
  | NullState
  | ShouldShowTextLoaderState
  | ShouldShowPreviousDocument;

export default function Home() {
  const workerRef = useRef<Worker>();
  const timerRef = useRef("");
  const [song, setSong] = useState(`  Oh when the winds they b[AM]low
          You're g[E]onna n[G]eed somebody to kn[F]ow you`);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  // const [renderingState, setRenderingState] = useState<RenderingState>({
  //   tag: "null",
  //   value: null,
  // });
  const [parsedSong, setParsedSong] = useState<Song.t>(parseSong(song) ?? []);
  const [numPages, setNumPages] = useState<number>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previousRenderValue, setPreviousRenderValue] = useState<string | null>(
    null
  );
  const isFirstRendering = !previousRenderValue;

  // const isLatestValueRendered = previousRenderValue === pdfUrl;
  const isBusy = isLoading || isFirstRendering;

  const shouldShowTextLoader = isFirstRendering && isBusy;
  const shouldShowPreviousDocument =
    !isFirstRendering && isBusy && previousRenderValue;

  const getPDFComponentState = (
    isError: boolean,
    previousRenderValue: string | null,
    pdfUrl: string,
    shouldShowTextLoader: boolean,
    shouldShowPreviousDocument: string | false
  ): RenderingState => {
    console.log("isFirstRendering", isFirstRendering);
    console.log("previousRenderValue", previousRenderValue);
    console.log("pdfUrl", pdfUrl);
    console.log(previousRenderValue === pdfUrl);
    console.log("isBusy", isBusy);
    console.log("shouldShowTextLoader", shouldShowTextLoader);
    console.log("shouldShowPreviousDocument", shouldShowPreviousDocument);

    if (isError)
      return {
        tag: "error",
        value: "error",
      };
    if (shouldShowPreviousDocument) {
      console.log("SHOWING PREVIOUS DOCUMENT NOW");
      return {
        tag: "shouldShowPreviousDocument",
        value: true,
      };
    }
    if (pdfUrl)
      return {
        tag: "pdf",
        value: pdfUrl,
      };
    if (shouldShowTextLoader)
      return {
        tag: "shouldShowTextLoader",
        value: true,
      };
    return {
      tag: "null",
      value: null,
    };
  };
  const renderingState = getPDFComponentState(
    isError,
    previousRenderValue,
    pdfUrl,
    shouldShowTextLoader,
    shouldShowPreviousDocument
  );

  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onDocumentLoad = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setCurrentPage((prev) => Math.min(prev, numPages));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSong(value);
    if (timerRef.current) {
      clearTimeout(+timerRef.current);
    }
    const timer = setTimeout(() => {
      setParsedSong(parseSong(value) ?? []);
    }, 1000);
    timerRef.current = timer.toString();
  };
  const renderPDFComponent = () => {
    switch (renderingState.tag) {
      case "shouldShowTextLoader":
        return (
          <>
            {/* <div>Rendering PDF...</div> */}
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </>
        );
      case "null":
        return <div>Error Null</div>;
      case "error":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        );
      case "shouldShowPreviousDocument":
        console.log("showing previous document");
        return (
          <>
            <Document
              key={previousRenderValue}
              className={"opacity-50"}
              // className="previous-document"
              file={previousRenderValue}
              loading={null}
            >
              <Page key={currentPage} pageNumber={currentPage} />
            </Document>
          </>
        );
      case "pdf":
        return (
          <>
            <Document
              key={renderingState.value}
              file={renderingState.value}
              // className={
              //   shouldShowPreviousDocument ? "rendering-document" : null
              // }
              loading={null}
              onLoadSuccess={onDocumentLoad}
            >
              <Page
                pageNumber={currentPage}
                key={currentPage}
                loading={null}
                onRenderSuccess={() => {
                  console.log(
                    "renderingState.value in Page: ",
                    renderingState.value
                  );

                  setPreviousRenderValue(renderingState.value);
                }}
              ></Page>
            </Document>
          </>
        );
      default:
        const _exhaustiveCheck: never = renderingState;
        throw new Error(`Unhandled case: ${JSON.stringify(_exhaustiveCheck)}`);
    }
  };
  // console.log("previousRenderValue", previousRenderValue);
  // console.log("renderingState.value", renderingState.value);
  // console.log("should show previous document", shouldShowPreviousDocument);

  useEffect(() => {
    if (!parsedSong) return;
    workerRef.current = new Worker(new URL("../../worker.ts", import.meta.url));
    workerRef.current.onmessage = (e: MessageEvent<string>) => {
      setIsLoading(false);
      setPdfUrl(e.data);
      // setRenderingState({ tag: "pdf", value: e.data });
      console.log("event", e.data);
    };
    workerRef.current.onmessageerror = (e) => {
      setIsError(true);
      // setRenderingState({ tag: "error", value: e.data });
      console.error(e);
    };
    const handleWork = async () => {
      setIsLoading(true);
      console.log("sendingMessageToWorker");
      workerRef.current?.postMessage(parsedSong);
    };

    handleWork();

    return () => {
      workerRef.current?.terminate();
    };
  }, [parsedSong]);

  return (
    <div className="">
      <div className="input">
        <Textarea
          placeholder="Enter your song here"
          id="song"
          defaultValue={song}
          onChange={handleChange}
        />
      </div>
      <div className="output">
        {parsedSong && parsedSong.map(renderSongElement)}
      </div>
      <Button
        onClick={() => {
          if (renderingState?.tag === "pdf") {
            const link = document.createElement("a");
            link.href = renderingState.value;
            link.download = "song.pdf";
            link.click();
          }
        }}
      >
        Download
      </Button>
      {renderPDFComponent()}
      {/* <p>{numPages ? `Page ${currentPage} of ${numPages}` : ""}</p> */}
    </div>
  );
}
