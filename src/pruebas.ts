interface Api {
  test(arg: string, reset?: boolean): string;
  test(arg: string, arg2: object, reset?: boolean): string;
}

class WhateverApi implements Api {
  test(arg: string, reset?: boolean): string;
  test(arg: string, arg2: object, reset?: boolean): string;
  test(arg: string, reset?: boolean): string {
    return arg;
  }
}

const api = new WhateverApi();
api.test('1', true);
api.test('1', { '2': '3' });

// export interface IBuilder extends IValidatable {
//   getWorker(): IBlock | IEntity;
//   buildComponent(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined;
//   buildComponent(rawJson: RawJSON, entityMap: EntityMap, resetBlock?: boolean): ReactElement | undefined;
// }
