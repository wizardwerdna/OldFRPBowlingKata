import { Observable } from "rxjs";
import { test, testSuite } from "./testsuite";
import { scorer$Tests } from "./scorer.spec.ts";
import { displayer$Tests } from "./displayer.spec.ts";
console.clear();
test(`==============
FRP Bowling Test Suite`, testSuite, false);
test("FRP Bowling Scorer", scorer$Tests, false);
test("FRP Bowling Displayer", displayer$Tests);
import { scorer$ } from "./scorer";
import { displayer$ } from "./displayer";
import * as $ from "jquery";
require("./styles.css");

testSuite();

const DOM = {
  buttons: document.querySelector("#buttons"),
  reset: document.querySelector("#reset"),
  rollDisplay: document.querySelectorAll(".roll-display"),
  frameScoreDisplay: document.querySelectorAll(".frame-score")
};

const domContentLoaded$ = Observable.fromEvent(document, "DOMContentLoaded");

const reset$ = Observable.fromEvent(DOM.reset, "click");

const rollPin$ = Observable.fromEvent(DOM.buttons, "click")
  .filter((evt: any) => evt.target.tagName === "BUTTON")
  .map((evt: any) => parseInt(evt.target.innerHTML));

const gameRoll$ = rollPin$
  .takeUntil(reset$)
  .scan((acc: any, curr) => acc.concat(curr), [])
  .repeat()
  ;

const gameScoreDisplay$ = gameRoll$
  .concatMap(rolls => scorer$(rolls).filter(y => !isNaN(y)).toArray());

const gameRollsDisplay$ = gameRoll$
  .concatMap(rolls => displayer$(rolls).toArray());


domContentLoaded$.subscribe(_ => resetDisplay());

reset$.subscribe(_ => resetDisplay());

function displayArray(domElement, items) {
  Array.from(domElement).forEach(
    (each: any, index) => each.innerHTML = items[index] || ""
  );
}

function resetDisplay() {
  displayArray(DOM.frameScoreDisplay, []);
  displayArray(DOM.rollDisplay, []);
  Array.from(DOM.buttons.childNodes).forEach(function(node) {
    (<HTMLInputElement> node).disabled = false;
  });
}

function isGameOver(rollDisplay, scoreDisplay) {
  if (rollDisplay.length >= 20 && scoreDisplay.length >= 10)
  return rollDisplay.length >= 20 && scoreDisplay.length >= 10;
}

function isSpareRoll(rollDisplay, scoreDisplay) {
  return rollDisplay.length % 2 === 1 ||
         rollDisplay.length === 20 && rollDisplay[18] === "X"
  ;
}

function enableDisableButtons(rollDisplay, scoreDisplay) {
  Array.from(DOM.buttons.childNodes)
  .filter((elt: any) => elt.tagName === "BUTTON")
  .forEach((node, index) => {
    (<HTMLInputElement> node).disabled =
      isGameOver(rollDisplay, scoreDisplay) ||
      (isSpareRoll(rollDisplay, scoreDisplay) &&
        parseInt(rollDisplay[rollDisplay.length - 1]) + index > 10);
  });
}

gameRollsDisplay$.withLatestFrom(gameScoreDisplay$, (r, s) => [r, s])
.subscribe((x) => {
  const rollDisplay: any = x[0];
  const scoreDisplay: any = x[1];

  let display = rollDisplay.join("");
  const tenth = display.slice(18).replace(/ /g, "");
  display = display.slice(0, 18) + tenth;

  displayArray(DOM.rollDisplay, display);
  displayArray(DOM.frameScoreDisplay, scoreDisplay);
  enableDisableButtons(display, scoreDisplay);
});

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
