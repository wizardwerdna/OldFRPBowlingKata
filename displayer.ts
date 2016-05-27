import { Observable } from "rxjs";
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .map(roll => {
    if ( roll === 0 )
      return "-";
    else
      return " X";
  });
}
