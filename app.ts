import { test, testSuite } from "./testsuite";
import { scorer$Tests } from "./scorer.spec.ts";
import { displayer$Tests } from "./displayer.spec.ts";
console.clear();
test(`==============
FRP Bowling Test Suite`, testSuite, false);
test("FRP Bowling Scorer", scorer$Tests, false);
test("FRP Bowling Displayer", displayer$Tests);
