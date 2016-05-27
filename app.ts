import { test, testSuite } from "./testsuite";
import { scorer$Tests } from "./scorer.spec.ts";
import { displayer$Tests } from "./displayer.spec.ts";
test(">>>> BEGIN FRP Bowling Test Suite", testSuite);
test(">>>> BEGIN FRP Bowling Scorer", scorer$Tests);
test(">>>> BEGIN FRP Bowling Displayer", displayer$Tests);
