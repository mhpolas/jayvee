// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

export * from './primitive-value-types';

/* Note: Only export types if possible to enforce usage of WrapperFactory outside this directory */

export {
  isPrimitiveValueType,
  type PrimitiveValueType,
} from './primitive-value-type';

export {
  type BooleanValuetype,
  isBooleanValuetype,
} from './boolean-value-type';
export {
  type CellRangeValuetype,
  isCellRangeValuetype,
} from './cell-range-value-type';
export {
  type ConstraintValuetype,
  isConstraintValuetype,
} from './constraint-value-type';
export {
  type DecimalValuetype,
  isDecimalValuetype,
} from './decimal-value-type';
export {
  type IntegerValuetype,
  isIntegerValuetype,
} from './integer-value-type';
export { type RegexValuetype, isRegexValuetype } from './regex-value-type';
export { type TextValuetype, isTextValuetype } from './text-value-type';
export {
  type ValuetypeAssignmentValuetype,
  isValuetypeAssignmentValuetype,
} from './value-type-assignment-value-type';
export {
  type TransformValuetype,
  isTransformValuetype,
} from './transform-value-type';

export * from './collection'; // type export handled one level deeper
