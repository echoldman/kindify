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
