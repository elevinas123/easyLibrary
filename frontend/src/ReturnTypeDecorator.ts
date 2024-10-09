import 'reflect-metadata';

export function ReturnType(type: any) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('returnType', type, target, propertyKey);
  };
}