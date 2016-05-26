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
  testScorer([0, 0, 1, 2], [0, 3]);
});
```
