import { Observable } from "rxjs";

export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
          rolls.pins[0] === 10 || rolls.pins[0] + rolls.pins[1] === 10 ?
          rolls.pins.reduce(sumReducer) :
          rolls.pins[0] + (rolls.pins[1] || 0)
      );

  const frameReducer =
    (acc, curr) => {
      if (curr[0] === 10 && acc.isLastInFrame)
        return {
          frame: acc.frame + 1,
          isLastInFrame: true,
          pins: curr
        };
      else
        return {
          frame: acc.isLastInFrame ? acc.frame + 1 : acc.frame,
          isLastInFrame: !acc.isLastInFrame,
          pins: curr
        };
    };

  const sourceToFrame$ = fromSource =>
    Observable.from(fromSource)
      .bufferCount(3, 1)
      .map(trip => trip.concat(NaN, NaN, NaN).slice(0, 3))
      .scan(frameReducer, {isLastInFrame: true, frame: 0});

  return sourceToFrame$(fromSource)
    .groupBy(roll => roll.frame)
    .mergeMap(frameScorer)
    .scan(sumReducer)
    .take(10)
    .filter(roll => !isNaN(roll));
}
