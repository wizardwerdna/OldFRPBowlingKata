import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { test, assertEqual } from "./testsuite.ts";

export function displayer$Tests() {
  test("displaying single empty game", function(){
    testDisplayer([], "");
  });
  test("displaying single gutter ball", function(){
    testDisplayer([0], "-");
  });
  test("displaying strike", function(){
    testDisplayer([10], " X");
  });
  test("displaying other single rolls", function(){
    testDisplayer([3], "3");
  });
  test("displaying open frames and strikes", function(){
    testDisplayer([0, 6], "-6");
    testDisplayer([0, 6, 10, 0, 9], "-6 X-9");
  });
  test("display spares", function(){
    testDisplayer([5, 5, 5], "5/5");
    testDisplayer([0, 10, 5], "-/5");
  });
  test("display complete games", function(){
    testDisplayer(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "--------------------"
    );
    testDisplayer(
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      "5/5/5/5/5/5/5/5/5/5/5"
    );
    testDisplayer([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      " X X X X X X X X XXXX"
    );
  });
}

function testDisplayer(fromSource, expected) {
  displayer$(fromSource)
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
