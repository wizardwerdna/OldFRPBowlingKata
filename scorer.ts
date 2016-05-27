import { Observable } from "rxjs";

export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
        rolls[0] + rolls[1] === 10 ?
          rolls.reduce(sumReducer) :
          rolls[0] + (rolls[1] || 0)
      );

  return Observable.from(fromSource)
    .bufferCount(3, 1)    // change rolls into triplets
    .windowCount(2)       // break frames into two-roll sets
    .mergeMap(frameScorer)// score each frame separately
    .scan(sumReducer);    // add the frames
}
