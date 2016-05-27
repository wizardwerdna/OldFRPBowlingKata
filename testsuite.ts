import { Observable } from "rxjs";
import { scorer$ } from "./scorer";

export function testSuite () {

  test("should know the truth", function(){
    assertEqual(true, true);
  });

  test("should score empty game", function(){
    testScorer([], []);
  });

  test("partial open frame", function(){
    testScorer([0], [0]);
  });

  test("full open frame", function(){
    testScorer([0, 0], [0]);
    testScorer([0, 1], [1]);
    testScorer([1, 1], [2]);
  });

  test("two open frames", function(){
    testScorer([0, 0, 1, 2], [0, 3]);
    testScorer([0, 1, 1, 2], [1, 4]);
  });

  test("one completed spare", function(){
    testScorer([5, 5, 5], [15, 20]);
  });
}

function testScorer(fromSource, expected) {
  scorer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}

function assertEqual(expected, value) {
  if (JSON.stringify(expected) === JSON.stringify(value)) {
    console.info("%cexpected value %o was returned", "color: green", expected);
  } else {
    console.error("expected %o, but got %o", expected, value);
  }
}

export function test(testName, tests) {
  console.group(testName);
  tests();
  console.groupEnd();
}
