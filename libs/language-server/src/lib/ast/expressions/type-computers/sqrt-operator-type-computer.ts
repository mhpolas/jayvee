// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import {
  type ValueType,
  type ValueTypeProvider,
} from '../../wrappers/value-type';
import { DefaultUnaryOperatorTypeComputer } from '../operator-type-computer';

export class SqrtOperatorTypeComputer extends DefaultUnaryOperatorTypeComputer {
  constructor(protected readonly valueTypesProvider: ValueTypeProvider) {
    super(valueTypesProvider.Primitives.Decimal);
  }

  override doComputeType(): ValueType {
    return this.valueTypesProvider.Primitives.Decimal;
  }
}
