/* 错误定义 */

const ex = {
  Declare_Bad: 'declare_bad',
  Value_TypeBad: 'value-type-bad',
  Value_Bad: 'value-bad',
  Definition_Bad: 'definition-bad',
  Breaking_Rules: 'breaking-rules',
}

function throwException(name, category, message, ex) {
  if (variantTypeIs(category, 'function')) category = category();
  const e = new Error();
  e.name = ex;
  e.message = `${category} ${name} ${message}`;
  throw e;
}

/* 基础功能 */

function stringEqualIgnoreCase(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function variantTypeIs(variant, type) {
  return stringEqualIgnoreCase(Object.prototype.toString.call(variant), `[object ${type}]`);
}

function variantValueIn(variant, values) {
  return values.includes(variant);
}

function objectHas(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function numberIsFloat(number) {
  return ~~number !== number;
}

function numberIsInteger(number) {
  return ~~number === number;
}


/* 函数参数检查 */

function checkParamValue(type, value, name, category) {
  if (type === 'integer') {
    if (!variantTypeIs(value, 'number')) throwException(name, category, '的实际值不是数值类型', ex.Value_TypeBad);
    if (numberIsFloat(value)) throwException(name, category, '要求是 integer 实际值是 float', ex.Value_TypeBad);
  } else if (type === 'float') {
    if (!variantTypeIs(value, 'number')) throwException(name, category, '的实际值不是数值类型', ex.Value_TypeBad);
    if (numberIsInteger(value)) throwException(name, category, '要求是 float 实际值是 ineger', ex.Value_TypeBad);
  } else if (type === 'string') {
    if (!variantTypeIs(value, 'string')) throwException(name, category, '的实际值不是 string', ex.Value_TypeBad);
  } else if (type === 'boolean') {
    if (!variantTypeIs(value, 'boolean')) throwException(name, category, '的实际值不是 boolean', ex.Value_TypeBad);
  } else {
    throwException(name, category, '只能是 integer float string boolean 其中之一', ex.Declare_Bad);
  }
}

function checkFunctionParamValue(params, ...values) {
  if (!variantTypeIs(params, 'array')) throwException(`表示形参类型的变量应该是 array`, ex.Value_TypeBad);
  const len = params.length;
  if (values.length < len) throw `实参的个数少于形参的个数`;
  for (let i = 0; i < len; i++) {
    checkParamValue(params[i], values[i], `parameter ${i+1}`, () => { return (new Error()).stack.split('\n')[5].trim().split(' ')[1]; });
  }
}


/* 对象属性检查 */

/**
 * 命名规则：
 * 只能以 _ [a-z] [A-Z] 开头
 * 其余可以包含 _ [a-z] [A-Z] [0-9]
 * 最小长度 1，最大长度 64
 */
function checkName(name) {
  if (!variantTypeIs(name, 'string')) throwException('name 字面量必须是 string', ex.Value_TypeBad);
  const re = /^(_|[a-z]|[A-Z])(_|[a-z]|[A-Z]|[0-9]){0,63}$/g;
  if (name.search(re) !== 0) throwException(`${name} 不是有效的 name`, ex.Value_Bad);
}

const PropertyTypes = ['integer', 'float', 'string', 'boolean'];
const ParamTypes = ['integer', 'float', 'string', 'boolean'];
const ResultTypes = ['integer', 'float', 'string', 'boolean', 'void'];

/*
 * 类型的规则：
 * type 字面量只能是 options 的其中之一
 */
function checkType(type, options) {
  if (!variantTypeIs(type, 'string')) throwException('type 字面量必须是 string', ex.Value_TypeBad);
  if (!variantValueIn(type.toLowerCase(), options)) throwException(`type 只能是 ${options.join(' ')} 其中之一，使用了 ${type}`, ex.Value_TypeBad); 
}

/*
 * 类型-值的规则：
 * 允许为 null：为 null值或者值的类型和 type 要求一致
 * 禁止为 null：值的类型必须和 type 要求一致
 */
function checkTypeValue(type, value, nullable, name, category) {
  if (nullable) {
    if (value !== null) checkParamValue(type, value, name, category);
  } else {
    checkParamValue(type, value, name, category);
  }
}

function checkParamDefinition(definition, typeOptions, category) {
  // 必须是 Object
  if (!variantTypeIs(definition, 'object')) throwException(`${category}定义必须是 object`, ex.Definition_Bad);

  // 必须包含 name 定义并且是 string
  if (!objectHas(definition, 'name')) throwException(`${category}必须包含 name 定义`, ex.Definition_Bad);
  // 获取并检查 name
  const name = definition.name;
  checkName(name);

  // 必须包含 type 定义并且是 string
  if (!objectHas(definition, 'type')) throwException(`${category}必须包含 type 定义`, ex.Definition_Bad);
  // 获取并检查 type
  const type = definition.type;
  checkType(type, typeOptions);

  // 必须包含 nullable 定义并且是 boolean
  if (!objectHas(definition, 'nullable')) throwException(`${category}必须包含 nullable 定义`, ex.Definition_Bad);
  const nullable = definition.nullable;
  if (!variantTypeIs(nullable, 'boolean')) throwException('nullable 必须是 boolean', ex.Value_TypeBad);
  // nullable 只是 true false
  if (!variantValueIn(nullable, [true, false])) throwException('nullable 只是 true false 其中之一', ex.Declare_Bad);

  // 须包含 default 定义
  if (!objectHas(definition, 'default')) throwException(`${category}必须包含 default 定义`, ex.Definition_Bad);
  const default_value = definition.default;
  if (nullable) {
    // 此属性允许为 null 时，default 值可以是 null 或者和 type 一致
    if ((default_value === null) || !variantTypeIs(default_value, type)) {
      throwException(`${category}允许为 null 时 default 既不是 null 也没有和 type 一致`, ex.Breaking_Rules);
    }
  }
}

function checkMethodDefinition(method) {
  // 必须是 Object
  if (!variantTypeIs(method, 'object')) throwException('方法定义必须是 Object', ex.Definition_Bad);
 
  // 必须包含 name 定义并且是 string
  if (!objectHas(method, 'name')) throwException('方法定义必须包含 name', ex.Definition_Bad);
  const name = method.name;
  checkName(name);

  // 必须包含 params 定义并且是 array
  if (!objectHas(method, 'params')) throwException('方法定义必须包含 params', ex.Definition_Bad);
  const params = method.params;
  if (!variantTypeIs(params, 'array')) throwException('方法定义的 params 必须是 array', ex.Value_TypeBad);
  // 检查 params 的每一项
  for (const param of params) checkParamDefinition(param, ParamTypes, '参数');

  // 必须包含 result 定义并且是 object
  if (!objectHas(method, 'result')) throwException('方法定义必须包含 result', ex.Definition_Bad);
  const result = method.result;
  if (!variantTypeIs(result, 'object')) throwException('result 必须是 object', ex.Value_TypeBad);
  // result 必须包含 type
  if (!objectHas(result, 'type')) throwException('方法定义的 result 必须包含 type', ex.Definition_Bad);
  // 检查 result 的 type
  checkType(result.type, ResultTypes)

  // 必须包含 fun 定义并且是 function
  if (!objectHas(method, 'fun')) throwException('方法定义必须 包含 fun', ex.Definition_Bad);
  const fun = method.fun;
  if (!variantTypeIs(fun, 'function')) throwException('fun 必须是 function', ex.Value_TypeBad);
}


const existed = [];

function define(definition) {

  /* 检查 definition 的基本内容 */

  if (!variantTypeIs(definition, 'object')) throwException('Kind 定义必须是 object', ex.Value_TypeBad);
  if (!objectHas(definition, 'name')) throwException('Kind 定义必须包含 name', ex.Definition_Bad);
  if (!objectHas(definition, 'properties')) throwException('Kind 定义必须包含 properties', ex.Definition_Bad);
  if (!objectHas(definition, 'methods')) throwException('Kind 定义必须包含 methods', ex.Definition_Bad);
  if (existed.includes(definition.name)) throwException('不能重复定义 Kind', ex.Definition_Bad);
  existed.push(definition.name);


  /* 检查每个属性的定义 */
  const properties = definition.properties;
  if (!variantTypeIs(properties, 'array')) throwException('properties 定义必须是数组', ex.Value_TypeBad);
  properties.forEach(property => checkParamDefinition(property, PropertyTypes, '属性'));


  /* 检查每个方法的定义 */

  const methods = definition.methods;
  if (!variantTypeIs(methods, 'array')) throwException('methods 定义必须是数组', ex.Value_TypeBad);
  methods.forEach(method => checkMethodDefinition(method));

  // TODO 检查是否有重复定义

  const kind = {
    create: function (data) {
      if (!variantTypeIs(data, 'object')) throwException('用于创建实例的数据必须是 object', ex.Value_TypeBad);

      const object = new Object();

      /* 为队形绑定属性 */

      for (const property of properties) {

        /* 获取、检查属性值是否符合类型要求，并赋予到 object 上 */

        let value;
        const name = property.name;
        if (objectHas(data, name)) {
          value = data[name];
        } else {
          value = property.default;
        }
        checkTypeValue(property.type, value, property.nullable, name, '属性');

        object[name] = value;
      }


      /* 为对象绑定方法 */

      for (const method of methods) {
        object[method.name] = function (...params) {

          /* 根据形参定义，检查实参 */

          const formal_params = method.params;
          const actual_params = params;
          const pass_params = [];

          // 实参长度小于形参，使用形参的默认值
          // 实参长度大于形参，额外别传递的参数被忽略
          // 实参是否符合形参定义
          for (let i = 0; i < formal_params.length; i++) {
            const formal = formal_params[i];
            const actual = (i < actual_params.length ? actual_params[i] : formal.default);
            checkTypeValue(formal.type, actual, formal.nullable, formal.name, `${definition.name} 方法 ${method.name} 的参数`);
            pass_params.push(actual);
          }

          // 执行-检查-返回结果
          const result = method.fun.call(object, ...pass_params);
          const result_defintion = method.result;
          if (stringEqualIgnoreCase(result_defintion.type, 'void')) {
            return;
          } else {
            checkTypeValue(result_defintion.type, result, true, 'result', `${definition.name} 方法 ${method.name} 的`);
            return result;
          }
        }
      }


      /* Kind 实例创建完成 */

      return object;
    }
  }

  return kind;
}

export { define, checkFunctionParamValue, ex }
