/* eslint-disable import/no-cycle */
import { DataTypeVisitor } from './visitors/DataTypeVisitor';

import { AbstractDataType } from './AbstractDataType';

export class DecimalDataType extends AbstractDataType {
  override isValid(value: unknown): boolean {
    if (typeof value === 'string') {
      return !!value.match(/[+-]?([0-9]*[.])?[0-9]+/);
    }

    return !Number.isNaN(value);
  }

  override acceptVisitor<R>(visitor: DataTypeVisitor<R>): R {
    return visitor.visitDecimal(this);
  }
}
