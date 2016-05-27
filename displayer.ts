import { Observable } from "rxjs";
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .scan((acc: any, curr) => {
    if ( curr === 0 )
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: "-"
      };
    else if ( curr === 10 && isNaN(acc.carry))
      return {
        carry: NaN,
        pins: " X"
      };
    else if ( curr + acc.carry === 10 )
      return {
       carry: NaN,
       pins: "/" };
    else
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: curr.toString()
      };
  }, {carry: NaN})
  .do(x => console.log(x))
  .map(roll => roll.pins);
}
