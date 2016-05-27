import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { test, assertEqual } from "./testsuite.ts";

export function displayer$Tests() {
  test("testing truth", function(){
    assertEqual(true, true);
  });

  test("displaying empty game", function(){
    testDisplayer([], "");
  });
}

function testDisplayer(fromSource, expected) {
  displayer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
