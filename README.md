# Kindify

Kindify 是一个用来检查 js 函数和对象的数据类型的工具。

函数检查

```js
import { checkFunctionParamValue  } from "../src/kind.mjs";

function myfun1(str1, int1) {
  checkFunctionParamValue(['string', 'integer'], str1, int1);
  console.log(str1 + ' : ' + int1);
}

myfun1('hello', 123);
```



对象类别定义和创建

```js
const sub_definition = {
  name: 'Sub',
  properties: [
    {
      name: 'title',
      type: 'string',
      nullable: false,
      default: null,
    },
    {
      name: 'len',
      type: 'integer',
      nullable: false,
      default: null
    }
  ],
  methods: [
    {
      name: 'show',
      params: [],
      result: {
        type: 'void'
      },
      fun: function () {
        console.log(`${this.title} ${this.len}`);
      }
    },
    {
      name: 'setLen',
      params: [
        {
          name: 'len',
          type: 'integer',
          nullable: false,
          default: 20
        }
      ],
      result: {
        type: 'integer'
      },
      fun: function (len) {
        this.len = len;
        return len;
      }
    }
  ],
}

import { define } from '../src/kind.mjs';

const kindSub = define(sub_definition);
const sub1 = kindSub.create({ title: 'hello, world 1', len: 10 });
console.log(sub1);

sub1.show();

sub1.setLen();
sub1.show();

sub1.setLen(24);
sub1.show();
```





