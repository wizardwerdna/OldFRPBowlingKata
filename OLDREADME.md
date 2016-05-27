# FRP Bowling Kata

The classic blowing Kata, executed with Functional Responsive Programming, using rxjs5 Observables.

To install, simply install node, clone the repostiory and then execute:

```bash
cd FRPBowlingKata
npm install && tsd install
```

## Test Development

This program was built using a home-grown test runner, displaying test
results in the Browser console.  (Tested with Chrome, Safari and Firefox)

The code for the testrunner and the tests can be found in "testsuite.ts".

Tests are given using the function `test(<testName>, <testFunction>)`, where

`testName` is a string defining the tests included, and
`testFunction` is a string defining the setup and assertions for the test.

`test`s are and can be nested.

```typescript
const constant = false;

test("this is a suite of tests", function(){
  test("should recognize truth", fuction(){
    assertEquals(true, true);
  })
  test("should recognize a true constant", function(){
    aasertEquals(true, constant);
  })
})
 ```

## Review Development

 screencast will follow
