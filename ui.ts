import { test, testSuite, assertEqual } from "./testsuite";
import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { scorer$ } from "./scorer";

export const DOM = {
  reset: document.querySelector("button#reset"),
  buttonsDiv: document.querySelectorAll("#buttons button"),
  buttons: Array.from(document.querySelectorAll("#buttons button")),
  rollDisplay: Array.from(document.querySelectorAll(".rollDisplay")),
  frameScoreDisplay: Array.from(document.querySelectorAll(".frameScoreDisplay"))
};

const documentLoaded$ = Observable.fromEvent(document, "DOMContentLoaded");
const reset$ = Observable.fromEvent(DOM.reset, "click");
const button$ = Observable.fromEvent(DOM.buttonsDiv, "click");

const roll$ = button$
  .takeUntil(reset$)
  .map((evt: MouseEvent) => parseInt((<any> evt.target).innerHTML))
  .scan((acc, curr) => acc.concat(curr), [])
  .repeat();

const display$ = roll$
  .mergeMap(arr =>
    displayer$(arr)
      .reduce((acc, curr) => acc + curr, "")
);

const score$ = roll$.mergeMap(arr => scorer$(arr).toArray());
const disable$ = display$.zip(score$);

reset$.subscribe(() => clearDisplay());
function clearDisplay() {
  DOM.buttons.forEach(each => (<HTMLInputElement> each).disabled = false);
  DOM.rollDisplay.forEach(each => each.innerHTML = "");
  DOM.frameScoreDisplay.forEach((each) => each.innerHTML = "");
}

display$.subscribe(display => {
  DOM.rollDisplay.forEach((each: any, index) =>
    each.innerHTML = display[index] || ""
  );
});

score$.subscribe(scores =>
  DOM.frameScoreDisplay.forEach((each: any, index) =>
    each.innerHTML = (typeof scores[index] === "undefined") ? "" : scores[index]
  )
);

disable$.subscribe(([display, scores]) => {
  const lastRoll = parseInt(display[display.length - 1]) || 0;
  if (isGameOver(display, scores))
    enableOnlyUpTo(-1);
  else if (isSpareAttempt(display, scores))
    enableOnlyUpTo(10 - lastRoll);
  else
    enableOnlyUpTo(11);

  function enableOnlyUpTo(button) {
    DOM.buttons.forEach((each, index) =>
      (<HTMLInputElement> each).disabled = index > button
    );
  }
  function isSpareAttempt(display, scores) {
    return display.length % 2 === 1 ||
      (display.length === 20 && display[18] === "X");
  }
  function isGameOver(display, scores) {
    return (scores.length === 10 && display.length > 19);
  }
});
