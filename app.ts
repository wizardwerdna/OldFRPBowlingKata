import { test, testSuite, assertEqual } from "./testsuite";
import { scorer$Tests } from "./scorer.spec.ts";
import { displayer$Tests } from "./displayer.spec.ts";
import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { scorer$ } from "./scorer";
import * as $ from "jquery";

console.clear();
test(`==============
FRP Bowling Test Suite`, testSuite, false);
test("FRP Bowling Scorer", scorer$Tests, false);
test("FRP Bowling Displayer", displayer$Tests, false);

const DOM = {
  reset: document.querySelector("button#reset"),
  buttons: document.querySelectorAll("#buttons button"),
  rollDisplay: document.querySelectorAll(".rollDisplay"),
  frameScoreDisplay: document.querySelectorAll(".frameScoreDisplay")
};

const UI = {
  reset:    () => $(DOM.reset).click(),
  button:   x  => $(DOM.buttons).eq(x).click(),
  buttons:  arr => arr.forEach(x => UI.button(x)),
  rollDisplay: () => $(DOM.rollDisplay).text(),
  firstRollDisplay: () => DOM.rollDisplay[0].innerHTML,
  frameScoreDisplay: () =>
    Array.from(DOM.frameScoreDisplay)
      .map(each => parseInt(each.innerHTML))
      .filter(each => !isNaN(each))
};

function isEnabledUpTo(buttons, num) {
  const disableds = Array.from(buttons).map((each: HTMLInputElement) => each.disabled);
  return disableds.slice(0, num + 1).every(x => x === false) &&
         disableds.slice(num + 1).every(x => x === true);
}

const documentLoaded$ = Observable.fromEvent(document, "DOMContentLoaded");
const reset$ = Observable.fromEvent(DOM.reset, "click");
const button$ = Observable.fromEvent(DOM.buttons, "click");
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

function clearDisplay() {
  Array.from(DOM.buttons).forEach(each => (<HTMLInputElement> each).disabled = false);
  Array.from(DOM.rollDisplay).forEach(each => each.innerHTML = "");
  Array.from(DOM.frameScoreDisplay).forEach((each) => each.innerHTML = "");
}

reset$.subscribe(() => clearDisplay());

display$.subscribe(display => {
  Array.from(DOM.rollDisplay).forEach((each: any, index) =>
    each.innerHTML = display[index] || ""
  );
});

score$.subscribe(scores =>
  Array.from(DOM.frameScoreDisplay).forEach((each: any, index) =>
    each.innerHTML = (typeof scores[index] === "undefined") ? "" : scores[index]
  )
);

function enableOnlyUpTo(button) {
  Array.from(DOM.buttons).forEach((each, index) =>
    (<HTMLInputElement> each).disabled = index > button
  );
}
function isSpareAttempt(display, scores) {
  return display.length % 2 === 1;
}
function isGameOver(display, scores) {
  return scores.length === 10 && display.length > 19;
}

disable$.subscribe(([display, scores]) => {
  const lastRoll = parseInt(display[display.length - 1]) || 0;
  if (isGameOver(display, scores))
    enableOnlyUpTo(-1);
  else if (isSpareAttempt(display, scores))
    enableOnlyUpTo(10 - lastRoll);
  else
    enableOnlyUpTo(11);
});

test("FRP Bowling UI", function(){
  test("input and display", function() {
    test("There are 11 buttons", function(){
      assertEqual(11, DOM.buttons.length);
    });
    test("rollDisplay holds 21 spaces", function(){
      assertEqual(21, DOM.rollDisplay.length);
    });
    test("frameScoreDisplay holds 10 spaces", function(){
      assertEqual(10, DOM.frameScoreDisplay.length);
    });
  });
  test("after reset", function(){
    test("rollDisplay", function(){
      UI.reset();
      assertEqual("", UI.rollDisplay());
    });
    test("frameScoreDisplay", function(){
      UI.reset();
      assertEqual([], UI.frameScoreDisplay());
    });
    test("buttons", function(){
      UI.reset();
      assertEqual(true, isEnabledUpTo(DOM.buttons, 10));
    });
  });
  test("after single gutterball", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.button(0);
      assertEqual("-", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.button(0);
      assertEqual([0], UI.frameScoreDisplay());
    });
    test("button", function() {
      UI.reset();
      UI.button(0);
      assertEqual(true, isEnabledUpTo(DOM.buttons, 10));
    });
  });
  test("after single 5-pin roll", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.button(5);
      assertEqual("5", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.button(5);
      assertEqual([5], UI.frameScoreDisplay());
    });
    test("button", function() {
      UI.reset();
      UI.button(5);
      assertEqual(true, isEnabledUpTo(DOM.buttons, 5));
    });
  });
  test("after strike roll", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.button(10);
      assertEqual(" ", UI.firstRollDisplay());
      assertEqual(" X", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.button(10);
      assertEqual([], UI.frameScoreDisplay());
    });
    test("button", function() {
      UI.reset();
      UI.button(10);
      assertEqual(true, isEnabledUpTo(DOM.buttons, 10));
    });
  });
  test("after unfulfilled spare", function() {
    test("rollDisplay", function() {
      UI.reset();
      UI.button(5);
      UI.button(5);
      assertEqual("5/", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.button(5);
      UI.button(5);
      assertEqual([], UI.frameScoreDisplay());
    });
    test("button", function() {
      UI.reset();
      UI.button(5);
      UI.button(5);
      assertEqual(true, isEnabledUpTo(DOM.buttons, 10));
    });
  });
  test("gutterball, then reset", function(){
    test("rollDisplay", function() {
      UI.button(0);
      UI.reset();
      assertEqual("", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.button(0);
      UI.reset();
      assertEqual([], UI.frameScoreDisplay());
    });
    test("buttons", function() {
      UI.button(0);
      UI.reset();
      assertEqual(true, isEnabledUpTo(DOM.buttons, 10));
    });
  });
  test("after partial game", function(){
    test("rollDisplay", function(){
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5]);
      console.log("OMG rollDisplay", UI.rollDisplay());
      assertEqual("5/5/5/", UI.rollDisplay());
    });
    test("frameScoreDisplay", function(){
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5]);
      console.log("OMG rollDisplay", UI.rollDisplay());
      assertEqual([15, 30], UI.frameScoreDisplay());
    });
    test("buttons", function(){
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5]);
      console.log("OMG rollDisplay", UI.rollDisplay());
      assertEqual(true, isEnabledUpTo(DOM.buttons, 11));
    });
  });
  test("after guttergame", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.buttons([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      assertEqual("--------------------", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.buttons([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      assertEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], UI.frameScoreDisplay());
    });
    test("buttons", function() {
      UI.reset();
      UI.buttons([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      assertEqual(true, isEnabledUpTo(DOM.buttons, -1));
    });
  });
  test("after sparegame", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
      assertEqual("5/5/5/5/5/5/5/5/5/5/5", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
      assertEqual([15, 30, 45, 60, 75, 90, 105, 120, 135, 150], UI.frameScoreDisplay());
    });
    test("buttons", function() {
      UI.reset();
      UI.buttons([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
      assertEqual(true, isEnabledUpTo(DOM.buttons, -1));
    });
  });
  test("after perfect game", function(){
    test("rollDisplay", function() {
      UI.reset();
      UI.buttons([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      assertEqual(" X X X X X X X X XXXX", UI.rollDisplay());
    });
    test("frameScoreDisplay", function() {
      UI.reset();
      UI.buttons([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      assertEqual([30, 60, 90, 120, 150, 180, 210, 240, 270, 300], UI.frameScoreDisplay());
    });
    test("butons", function() {
      UI.reset();
      UI.buttons([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      assertEqual(true, isEnabledUpTo(DOM.buttons, -1));
    });
  });
});
