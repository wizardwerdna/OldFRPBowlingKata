import { Observable } from "rxjs";

export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame => frame.reduce(sumReducer);

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
}
