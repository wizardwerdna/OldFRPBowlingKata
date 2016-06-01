import { Observable } from "rxjs";

export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .scan((acc: any, curr, index) => {
    if ( curr === 0 )
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: "-",
        chars: acc.chars + 1
      };
    else if ( curr === 10 && isNaN(acc.carry))
      return {
        carry: NaN,
        pins: acc.chars < 18 ? " X" : "X",
        chars: acc.chars + (acc.chars < 18 ? 2 : 1)
      };
    else if ( curr + acc.carry === 10 )
      return {
        carry: NaN,
        pins: "/",
        chars: acc.chars + 1
      };
    else
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: curr.toString(),
        chars: acc.chars + 1
      };
  }, {carry: NaN, chars: 0})
  .map(roll => roll.pins)
  .reduce((acc, curr) => acc + curr, "")
  ;
}
