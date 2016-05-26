import { Observable } from "rxjs";

export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .reduce((acc: any, curr) => acc + curr);
}
