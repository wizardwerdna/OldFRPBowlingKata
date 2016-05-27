import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { test, assertEqual } from "./testsuite.ts";

export function displayer$Tests() {
  test("displaying empty game", function(){
    testDisplayer([], "");
  });
  test("displaying gutter ball", function(){
    testDisplayer([0], "-");
  });
  test("displaying strike", function(){
    testDisplayer([10], " X");
  });
}

function testDisplayer(fromSource, expected) {
  displayer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result.join("")),
    error  => console.error("Error: ", error)
  );
}
