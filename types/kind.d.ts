interface ArgumentDefinition {
  name: string;
  type: string;
  nullable: boolean;
  default: any;
}

interface MethodDefinition {
  name: string;
  params: ArgumentDefinition[];
  fun: Function;
}

interface KindDefinition {
  name: string;
  properties: ArgumentDefinition[];
  methods: MethodDefinition[];
}

declare function define (definition: KindDefinition): Object;
