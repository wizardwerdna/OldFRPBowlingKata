import { Observable } from "rxjs";

export function scorer$(fromSource) {
  return Observable.from(fromSource).takeLast(1);
}
