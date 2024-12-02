export type Chord = {
  tag: "chord";
  value: string;
};

export type Lyric = {
  tag: "lyric";
  value: string;
};

export type Endofline = {
  tag: "endofline";
  value: string;
};

export type ErrorObj = {
  tag: "error";
  value: string;
};

export type t = Array<Chord | Lyric | Endofline | ErrorObj>;

// export type ObjectType = "LYRIC" | "CHORD" | "ENDOFLINE" | "ERROR_OBJ";

// export const LYRIC_OBJ = "LYRIC",
//   CHORD_OBJ = "CHORD",
//   ENDOFLINE_OBJ = "ENDOFLINE",
//   ERROR_OBJ = "ERROR_OBJ";
