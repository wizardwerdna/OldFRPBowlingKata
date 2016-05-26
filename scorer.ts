import { Observable } from "rxjs";

export function scorer$(fromSource) {
  return Observable.from(fromSource).take(1);
}
