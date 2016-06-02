import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { scorer$ } from "./scorer";
import * as $ from "jquery";
import { test, testSuite, assertEqual } from "./testsuite";

import { scorer$Tests } from "./scorer.spec";
import { displayer$Tests } from "./displayer.spec";
import { uiTests  } from "./ui.spec";

console.clear();
test(`==============
FRP Bowling Test Suite`, testSuite, false);
test("FRP Bowling Scorer", scorer$Tests, false);
test("FRP Bowling Displayer", displayer$Tests, false);
test("FRP Bowling UI", uiTests);

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
require("./styles.css");
require("./Rx_Logo_S.png");
