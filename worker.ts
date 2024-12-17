import * as Song from "@/lib/songParser/object/song";
import { pdf } from "@react-pdf/renderer";

import { createElement } from "react";
import { PDF } from "./src/app/pdf/PDF";

self.addEventListener("message", async (event: MessageEvent<Song.Song>) => {
  console.log("event from worker", event.data);
  //   postMessage(event.data);
  //   let sum = 0;
  //   for (let i = 0; i < 1000000000; i++) {
  //     sum += i;
  //   }
  //   console.log("sum: ", sum);

  const blob = await pdf(
    createElement(PDF, { parsedSong: event.data })
  ).toBlob();

  const url = URL.createObjectURL(blob);

  postMessage(url);
});
