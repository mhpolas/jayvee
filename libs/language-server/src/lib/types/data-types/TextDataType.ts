/* eslint-disable import/no-cycle */
import { AbstractDataType } from './AbstractDataType';
import { DataTypeVisitor } from './visitors';

export class TextDataType extends AbstractDataType {
  override isValid(value: unknown): boolean {
    return typeof value === 'string';
  }

  override acceptVisitor<R>(visitor: DataTypeVisitor<R>): R {
    return visitor.visitText(this);
  }

  override getStandardRepresentation(value: unknown): string {
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'string') {
      return value;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Invalid value: ${value} for type ${this.languageType}`);
  }
}