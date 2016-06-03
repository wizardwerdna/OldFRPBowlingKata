import { DOM } from "./ui";
import { test, assertEqual } from "./testsuite";
import * as $ from "jquery";

export const UI = {
  reset:    () => $(DOM.reset).click(),
  button:   x  => $(DOM.buttons).eq(x).click(),
  buttons:  arr => arr.forEach(x => UI.button(x)),
  rollDisplay: () => $(DOM.rollDisplay).text(),
  firstRollDisplay: () => DOM.rollDisplay[0].innerHTML,
  frameScoreDisplay: () =>
    DOM.frameScoreDisplay
      .map(each => parseInt(each.innerHTML))
      .filter(each => !isNaN(each)),
  isEnabledUpTo: (num) => {
    const disableds = DOM.buttons.map((each: HTMLInputElement) => each.disabled);
    return disableds.slice(0, num + 1).every(x => x === false) &&
           disableds.slice(num + 1).every(x => x === true);
  }
};

export function uiTests() {
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
        assertEqual(true, UI.isEnabledUpTo(10));
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
        assertEqual(true, UI.isEnabledUpTo(10));
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
        assertEqual(true, UI.isEnabledUpTo(5));
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
        assertEqual(true, UI.isEnabledUpTo(10));
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
        assertEqual(true, UI.isEnabledUpTo(10));
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
        assertEqual(true, UI.isEnabledUpTo(10));
      });
    });
    test("after partial game", function(){
      test("rollDisplay", function(){
        UI.reset();
        UI.buttons([5, 5, 5, 5, 5, 5]);
        assertEqual("5/5/5/", UI.rollDisplay());
      });
      test("frameScoreDisplay", function(){
        UI.reset();
        UI.buttons([5, 5, 5, 5, 5, 5]);
        assertEqual([15, 30], UI.frameScoreDisplay());
      });
      test("buttons", function(){
        UI.reset();
        UI.buttons([5, 5, 5, 5, 5, 5]);
        assertEqual(true, UI.isEnabledUpTo(11));
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
        assertEqual(true, UI.isEnabledUpTo(-1));
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
        assertEqual(true, UI.isEnabledUpTo(-1));
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
        assertEqual(true, UI.isEnabledUpTo(-1));
      });
    });
    test("tenth frame games", function() {
      const nineStrikes = [10, 10, 10, 10, 10, 10, 10, 10, 10];
      const tenStrikes = nineStrikes.concat(10);
      test("perfect game tenth frame", function() {
        UI.reset();
        UI.buttons(tenStrikes);
        assertEqual(true, UI.isEnabledUpTo(10));
        UI.button(10);
        assertEqual(true, UI.isEnabledUpTo(10));
      });
      test("strike and pins", function(){
        UI.reset();
        UI.buttons(tenStrikes.concat(5));
        assertEqual(true, UI.isEnabledUpTo(5));
        UI.button(5);
        assertEqual(true, UI.isEnabledUpTo(-1));
      });
      test("spare and strike", function(){
        UI.reset();
        UI.buttons(nineStrikes.concat(5, 5));
        assertEqual(true, UI.isEnabledUpTo(10));
        UI.button(10);
        assertEqual(true, UI.isEnabledUpTo(-1));
      });
    });
  });
}
