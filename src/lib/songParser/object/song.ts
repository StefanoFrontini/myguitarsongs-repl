export type Chord = {
  tag: "chord";
  value: string;
};

export type Lyric = {
  tag: "lyric";
  value: string;
};

type Word = {
  tag: "word";
  value: [Chord, Lyric];
};

export type Line = {
  tag: "line";
  value: Array<Word>;
};

export type Song = Array<Line>;
