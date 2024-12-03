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
} from "@react-pdf/renderer";
// import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
const SongBookDocument = () => {
  return (
    <Document onRender={(output) => console.log(output)}>
      <Page size="A4" style={styles.body}>
        <Text style={styles.chordSymbol}>AM</Text>
        <Text style={styles.text}>
          En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha
          mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga
          antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que
          carnero, salpicón las más noches, duelos y quebrantos los sábados,
          lentejas los viernes, algún palomino de añadidura los domingos,
          consumían las tres partes de su hacienda. El resto della concluían
          sayo de velarte, calzas de velludo para las fiestas con sus pantuflos
          de lo mismo, los días de entre semana se honraba con su vellori de lo
          más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una
          sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que
          así ensillaba el rocín como tomaba la podadera. Frisaba la edad de
          nuestro hidalgo con los cincuenta años, era de complexión recia, seco
          de carnes, enjuto de rostro; gran madrugador y amigo de la caza.
          Quieren decir que tenía el sobrenombre de Quijada o Quesada (que en
          esto hay alguna diferencia en los autores que deste caso escriben),
          aunque por conjeturas verosímiles se deja entender que se llama
          Quijana; pero esto importa poco a nuestro cuento; basta que en la
          narración dél no se salga un punto de la verdad
        </Text>
        <Text style={styles.text}>
          Es, pues, de saber, que este sobredicho hidalgo, los ratos que estaba
          ocioso (que eran los más del año) se daba a leer libros de caballerías
          con tanta afición y gusto, que olvidó casi de todo punto el ejercicio
          de la caza, y aun la administración de su hacienda; y llegó a tanto su
          curiosidad y desatino en esto, que vendió muchas hanegas de tierra de
          sembradura, para comprar libros de caballerías en que leer; y así
          llevó a su casa todos cuantos pudo haber dellos; y de todos ningunos
          le parecían tan bien como los que compuso el famoso Feliciano de
          Silva: porque la claridad de su prosa, y aquellas intrincadas razones
          suyas, le parecían de perlas; y más cuando llegaba a leer aquellos
          requiebros y cartas de desafío, donde en muchas partes hallaba
          escrito: la razón de la sinrazón que a mi razón se hace, de tal manera
          mi razón enflaquece, que con razón me quejo de la vuestra fermosura, y
          también cuando leía: los altos cielos que de vuestra divinidad
          divinamente con las estrellas se fortifican, y os hacen merecedora del
          merecimiento que merece la vuestra grandeza.
        </Text>
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
console.log("SongBookDocument", <SongBookDocument />);
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
  <span className="leading-10">{value}</span>
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
  const [song, setSong] = useState(`[F]Oh when the winds they b[AM]low
  You're gonna n[G]eed somebody to kn[F]ow you`);
  const [file, setFile] = useState<Blob | null>(null);
  //   const song = `[F]Oh when the winds they b[AM]low
  // You're gonna n[G]eed somebody to kn[F]ow you`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSong(value);
  };

  const parsedSong = parseSong(song);
  useEffect(() => {
    const getBlob = async () => {
      const blob = await pdf(<SongBookDocument />).toBlob();
      setFile(blob);
      console.log("blob", blob);
      const url = URL.createObjectURL(blob);
      console.log("url", url);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "songbook.pdf";
      // a.click();
    };
    getBlob();
  }, []);

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
