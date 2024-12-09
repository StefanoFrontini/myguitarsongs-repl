import * as Song from "@/lib/songParser/object/song";
import {
  Document,
  DocumentProps,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Chord",
  src: new URL("../fonts/chord_symbols.woff", import.meta.url).toString(),
});

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

// export type PDFProps = {
//   parsedSong: Song.t;
// };
export interface PDFProps extends DocumentProps {
  parsedSong: Song.t;
}
const LyricPDF = ({ value }: { value: string }) => (
  <Text>{[...value].map((el) => (el === " " ? "\u00A0" : el)).join("")}</Text>
);
const ChordPDF = ({ value }: { value: string }) => (
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
);
const EndoflinePDF = () => (
  <Text style={{ flexBasis: "100%", height: 0 }}></Text>
);

const ErrorComponentPDF = () => (
  <Text style={{ color: "red" }}>{` Parsing error: ']' expected `}</Text>
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
      return <ErrorComponentPDF key={index} />;
    default:
      const _exhaustiveCheck: never = tag;
      throw new Error(_exhaustiveCheck);
  }
};

export const PDF = ({ parsedSong }: PDFProps) => {
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
