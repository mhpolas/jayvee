// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import { ExecutionContext } from '../execution-context';

export interface ConstraintExecutor {
  isValid(value: unknown, context: ExecutionContext): boolean;
}