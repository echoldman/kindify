import { checkFunctionParamValue } from 'kind';

function myfun1 (str1, int1) {
  checkFunctionParamValue(['string', 'integer'], str1, int1);
  return int1;
}

const a = myfun1('abc', 10);
test(a, () => {
  expect(a).toBe(10);
});
