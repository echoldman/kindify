import { checkFunctionParamValue  } from "../src/kind.mjs";

function myfun1(str1, int1) {
  checkFunctionParamValue(['string', 'integer'], str1, int1);
  console.log(str1 + ' : ' + int1);
}

myfun1('hello', 123);
