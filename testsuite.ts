import { Observable } from "rxjs";

const scorer$ = (fromSource) => { return Observable.throw("funny"); };

export function testSuite () {

  test("should know the truth", function(){
    assertEqual(true, true);
  });

  test("should score empty game", function(){
    scorer$([]).toArray()
      .subscribe(
        result => assertEqual([], result),
        error  => console.error("Error: ", error)
      );
  });

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
