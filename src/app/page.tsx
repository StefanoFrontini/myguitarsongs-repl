"use client";
import { Textarea } from "@/components/ui/textarea";
import { parseSong } from "@/lib/songParser/main";
import * as Song from "@/lib/songParser/object/song";
import {
  Document,
  Font,
  Page,
  pdf,
  // pdf,
  // PDFDownloadLink,
  // PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
// import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Document as DocumentViewer,
  Page as PageViewer,
  pdfjs,
} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

Font.register({
  family: "Chord",
  src: "fonts/chord_symbols.woff",
});

// Create styles
const styles = StyleSheet.create({
  // page: {
  //   flexDirection: "row",
  //   backgroundColor: "#E4E4E4",
  // },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  chordSymbol: {
    fontFamily: "Chord",
    fontSize: 14,
    textAlign: "center",
  },
});

const LyricPDF = ({ value }: { value: string }) => (
  <Text>{[...value].map((el) => (el === " " ? "\u00A0" : el)).join("")}</Text>
);
const ChordPDF = ({ value }: { value: string }) => (
  // <Text style={{ marginTop: 5 }}>
  <Text
    style={{
      marginTop: -20,
      color: "orange",
      fontFamily: "Chord",
      fontWeight: "bold",
      flexBasis: 0,
    }}
  >
    {value}
  </Text>
  // </Text>
);
const EndoflinePDF = () => (
  <Text style={{ flexBasis: "100%", height: 0 }}></Text>
);

const ErrorComponentPDF = ({ value }: { value: string }) => (
  <Text
    style={{ color: "red" }}
  >{` Unable to parse chord: [${value} - missing closing bracket ']' ? `}</Text>
);

const renderSongPDF = (
  { tag, value }: Song.Lyric | Song.Chord | Song.Endofline | Song.ErrorObj,
  index: number
) => {
  switch (tag) {
    case "lyric":
      return <LyricPDF value={value} key={index} />;
    case "chord":
      return <ChordPDF value={value} key={index} />;
    case "endofline":
      return <EndoflinePDF key={index} />;
    case "error":
      return <ErrorComponentPDF value={value} key={index} />;
    default:
      const _exhaustiveCheck: never = tag;
      throw new Error(_exhaustiveCheck);
  }
};
const SongBookDocument = ({ parsedSong }: { parsedSong: Song.t }) => {
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            lineHeight: 2.5,
          }}
        >
          {parsedSong && parsedSong.map(renderSongPDF)}
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
// console.log(
//   "ReactPDF.render",
//   ReactPDF.render(<SongBookDocument />, "songbook.pdf")
// );

// const DownloadButton = () => {
//   const [isClient, setIsClient] = useState(false);
//   useEffect(() => {
//     setIsClient(true);
//   }, []);
//   return (
//     isClient && (
//       <PDFDownloadLink fileName="songbook.pdf" document={<SongBookDocument />}>
//         Download
//       </PDFDownloadLink>
//     )
//   );
// };

// const SongbookViewer = () => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);
//   return isClient ? (
//     <PDFViewer>
//       <SongBookDocument />
//     </PDFViewer>
//   ) : (
//     <Loader2 className="animate-spin" />
//   );
// };

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

const ErrorComponent = ({ value }: { value: string }) => (
  <span className="text-red-500">{` Unable to parse chord: [${value} - missing closing bracket ']' ? `}</span>
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
      return <ErrorComponent value={value} key={index} />;
    default:
      const _exhaustiveCheck: never = tag;
      throw new Error(_exhaustiveCheck);
  }
};
export default function Home() {
  const [song, setSong] = useState(`  Oh when the winds they b[AM]low
          You're g[E]onna n[G]eed somebody to kn[F]ow you`);
  const [file, setFile] = useState<Blob | null>(null);
  // const song = `[F]Oh when the winds they b[AM]low
  // You're gonna n[G]eed somebody to kn[F]ow you`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSong(value);
  };
  const parsedSong: Song.t | null = useMemo(() => parseSong(song), [song]);

  useEffect(() => {
    if (!parsedSong) return;
    const getBlob = async () => {
      try {
        const blob = await pdf(
          <SongBookDocument parsedSong={parsedSong} />
        ).toBlob();
        setFile(blob);
      } catch (error) {
        console.error(error);
      }
      // console.log("blob", blob);
      // const url = URL.createObjectURL(blob);
      // console.log("url", url);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "songbook.pdf";
      // a.click();
    };
    getBlob();
  }, [parsedSong]);

  // const blob = await pdf(value).toBlob();
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
        {/* <pre>{JSON.stringify(parsedSong, null, 2)}</pre> */}
        {parsedSong && parsedSong.map(renderSongElement)}
      </div>
      <div className="">
        {file && (
          <DocumentViewer file={file}>
            <PageViewer pageNumber={1} width={1000} height={1000}></PageViewer>
          </DocumentViewer>
        )}
      </div>
      {/* <SongbookViewer /> */}
      {/* <DownloadButton /> */}
    </div>
  );
}
