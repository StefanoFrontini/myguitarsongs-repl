"use client";
import { Textarea } from "@/components/ui/textarea";
import { parseSong } from "@/lib/songParser/main";
import * as Song from "@/lib/songParser/object/song";
import { useState } from "react";

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
  //   const song = `[F]Oh when the winds they b[AM]low
  // You're gonna n[G]eed somebody to kn[F]ow you`;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSong(value);
  };

  const parsedSong = parseSong(song);
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
    </div>
  );
}
