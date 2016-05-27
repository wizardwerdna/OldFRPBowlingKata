import { Observable } from "rxjs";
export function displayer$(fromSource) {
  return Observable.from(fromSource)
    .map(roll => "-");
}
