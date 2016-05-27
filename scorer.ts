import { Observable } from "rxjs";

export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.reduce((acc, curr) => acc + curr + (acc + curr === 10 ? 5 : 0));

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
}
