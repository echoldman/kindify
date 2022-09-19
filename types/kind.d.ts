declare function checkFunctionParamValue(params: string[], ...values: any[]): void;

interface ParamDefinition {
  name: string;
  type: string;
  nullable: boolean;
  default: any;
}

interface MethodDefinition {
  name: string;
  params: ParamDefinition[];
  fun: Function;
}

interface KindDefinition {
  name: string;
  properties: ParamDefinition[];
  methods: MethodDefinition[];
}

declare function define (definition: KindDefinition): Object;
