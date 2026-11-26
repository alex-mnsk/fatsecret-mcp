export type NutritionEnv = {
  FATSECRET_CONSUMER_KEY: string;
  FATSECRET_CONSUMER_SECRET: string;
  FATSECRET_ACCESS_TOKEN: string;
  FATSECRET_ACCESS_SECRET: string;
};

export type ApiParameter = [
  name: string,
  type: 'String' | 'Long' | 'Int' | 'Decimal' | 'Bool' | 'Boolean' | 'Array',
  required: boolean,
  description: string
];

export type ApiMethod = {
  name: string;
  apiMethod: string | null;
  source: string;
  title: string;
  description: string;
  endpoint: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  encoding: 'form' | 'json';
  write: boolean;
  delegated: boolean;
  premier: boolean;
  parameters: ApiParameter[];
};
