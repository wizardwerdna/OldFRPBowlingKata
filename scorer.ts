import { Observable } from "rxjs";

export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frame =>
      frame
        .reduce((acc: any, curr) => acc + curr)
    );
}
