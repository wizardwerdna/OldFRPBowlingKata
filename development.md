# FRP Bowling Kata

## Installation

bash
```bash
npm install && tsd install
```

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <div><h1>FRP Bowling Kata</h1</div>
  <script src="bundle.js"></script>
</body>
</html>
```


app.ts
```typescript
console.log('app.ts here');
```

## 1. EmptyGame

app.ts
```typescript
import { test, testSuite } from "./testsuite";

test(">>>> BEGIN FRP Bowling Test Suite", testSuite);
```

testsuite.ts
```
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
```

## 2. Partial Open Frame

testsuite.ts
```typescript
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
}

function testScorer(fromSource, expected) {
  scorer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
```

scorer.ts
```typescript
import { Observable } from "rxjs";

export function scorer$(fromSource) {
  return Observable.empty();
}
```

## 3. Full Open Frame

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource);
}
```

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
});
```

# 4. Full Open Frame 2
scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource).take(1);
}
```

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
});
```

# 5. Full Open Frame 3

scorer.ts
```typecript
export function scorer$(fromSource) {
  return Observable.from(fromSource).takeLast(1);
}
```

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
  testScorer([1, 1], [2]);
});
```
## 6. Two Open Frames

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .reduce((acc: any, curr) => acc + curr);
}
```

testsuite.ts
```typecript
test("two open frames", function(){
  testScorer([0, 0, 1, 2], [0, 3]);
});
```

## 7. Two Open Frames 2

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .reduce((acc: any, curr) => acc + curr);
}
```

testsuite.ts
```typecript
test("two open frames", function(){
  testScorer([0, 1, 1, 2], [1, 4]);
});
```

## 8. one completed spare

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame => frame.reduce(sumReducer);

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frame => frame.reduce(sumReducer))
    .scan(sumReducer);
}
```

testsuite.ts
```typecript
test("one completed spare", function(){
  testScorer([5, 5, 5], [15, 20]);
});
```

## 9. one completed spare 2

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.reduce((acc, curr) => acc + curr + (acc + curr === 10 ? 5 : 0));

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
}
```

testsuite.ts
```typecript
test("one completed spare", function(){
  testScorer([5, 5, 5], [15, 20]);
  testScorer([5, 5, 9], [19, 28]);
});
```

## 9. one completed strike

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
        rolls[0] + rolls[1] === 10 ?
          rolls.reduce(sumReducer) :
          rolls[0] + (rolls[1] || 0)
      );

  return Observable.from(fromSource)
    .bufferCount(3, 1)    // change rolls into triplets
    .windowCount(2)       // break frames into two-roll sets
    .mergeMap(frameScorer)// score each frame separately
    .scan(sumReducer);    // add the frames
}
```

testsuite.ts
```typecript
test("one completed strike", function(){
  testScorer([10, 1, 2], [13, 16]);
});
```

## 10. Partial Mark Frames

scorer.ts
```
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
          rolls.pins[0] === 10 || rolls.pins[0] + rolls.pins[1] === 10 ?
          rolls.pins.reduce(sumReducer) :
          rolls.pins[0] + (rolls.pins[1] || 0)
      );

  const frameReducer =
    (acc, curr) => {
      if (curr[0] === 10 && acc.isLastInFrame)
        return {
          frame: acc.frame + 1,
          isLastInFrame: true,
          pins: curr
        };
      else
        return {
          frame: acc.isLastInFrame ? acc.frame + 1 : acc.frame,
          isLastInFrame: !acc.isLastInFrame,
          pins: curr
        };
    };

  const sourceToFrame$ = fromSource =>
    Observable.from(fromSource)
      .bufferCount(3, 1)
      .scan(frameReducer, {isLastInFrame: true, frame: 0});

  return sourceToFrame$(fromSource)
    .groupBy(roll => roll.frame)
    .mergeMap(frameScorer)
    .scan(sumReducer)
    .take(10);
}
```

testsuite.ts
```typecript
test("partial spare", function(){
  testScorer([5, 5], []);
});

test("partial strike", function(){
  testScorer([10], []);
  testScorer([10, 5], []);
  testScorer([10, 10], []);
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
```

