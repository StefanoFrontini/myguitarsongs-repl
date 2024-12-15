type Chord = {
  tag: "chord";
  value: string;
};

type Lyric = {
  tag: "lyric";
  value: string;
};
type Word = {
  tag: "word";
  value: [Chord, Lyric];
};

type Line = {
  tag: "line";
  value: Array<Word>;
};

export type Song = Array<Line>;

// export type Song = Array<Word>;
