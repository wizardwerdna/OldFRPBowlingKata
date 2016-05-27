import { Observable } from "rxjs";
import { scorer$ } from "./scorer";
import { test, assertEqual } from "./testsuite.ts";

export function scorer$Tests() {

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
    testScorer([5, 5, 9], [19, 28]);
    testScorer([5, 5, 5, 5, 5], [15, 30, 35]);
  });

  test("one completed strike", function(){
    testScorer([10, 1, 2], [13, 16]);
  });

  test("zero game", function(){
    testScorer(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  });

  test("spare game", function(){
    testScorer(
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [15, 30, 45, 60, 75, 90, 105, 120, 135, 150]
    );
  });

  test("perfect game", function(){
    testScorer(
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [30, 60, 90, 120, 150, 180, 210, 240, 270, 300]
    );
  });

  test("partial spare", function(){
    testScorer([5, 5], []);
  });

  test("partial strike", function(){
    testScorer([10], []);
    testScorer([10, 5], []);
    testScorer([10, 10], []);
  });

}

function testScorer(fromSource, expected) {
  scorer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
