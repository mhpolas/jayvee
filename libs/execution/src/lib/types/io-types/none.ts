// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import { IOType } from '@jvalue/jayvee-language-server';

import { IOTypeImplementation } from './io-type-implementation';

export class None implements IOTypeImplementation<IOType.NONE> {
  public readonly ioType = IOType.NONE;
  private static _instance?: None;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get singletonInstance(): None {
    if (this._instance === undefined) {
      this._instance = new this();
    }
    return this._instance;
  }

  toDebugString(): string {
    return '<None>';
  }
}

export const NONE = None.singletonInstance;
