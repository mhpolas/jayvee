// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import {
  type BlockDefinition,
  type InternalValueRepresentation,
  type TypedConstraintDefinition,
  createJayveeServices,
} from '@jvalue/jayvee-language-server';
import {
  type ParseHelperOptions,
  expectNoParserAndLexerErrors,
  parseHelper,
  readJvTestAssetHelper,
} from '@jvalue/jayvee-language-server/test';
import {
  type AstNode,
  type AstNodeLocator,
  type LangiumDocument,
} from 'langium';
import { NodeFileSystem } from 'langium/node';

import { getTestExecutionContext } from '../../../../test/utils';

import { RegexConstraintExecutor } from './regex-constraint-executor';

describe('Validation of RegexConstraintExecutor', () => {
  let parse: (
    input: string,
    options?: ParseHelperOptions,
  ) => Promise<LangiumDocument<AstNode>>;

  let locator: AstNodeLocator;

  const readJvTestAsset = readJvTestAssetHelper(
    __dirname,
    '../../../../test/assets/',
  );

  async function parseAndValidateConstraint(
    input: string,
    value: InternalValueRepresentation,
  ): Promise<boolean> {
    const document = await parse(input, { validationChecks: 'all' });
    expectNoParserAndLexerErrors(document);

    const usageBlock = locator.getAstNode<BlockDefinition>(
      document.parseResult.value,
      'pipelines@0/blocks@2',
    ) as BlockDefinition;
    const constraint = locator.getAstNode<TypedConstraintDefinition>(
      document.parseResult.value,
      'constraints@0',
    ) as TypedConstraintDefinition;

    return new RegexConstraintExecutor().isValid(
      value,
      // Execution context with initial stack containing usage block of constraint and constraint itself
      getTestExecutionContext(locator, document, [usageBlock, constraint]),
    );
  }

  beforeAll(() => {
    // Create language services
    const services = createJayveeServices(NodeFileSystem).Jayvee;
    locator = services.workspace.AstNodeLocator;
    // Parse function for Jayvee (without validation)
    parse = parseHelper(services);
  });

  it('should diagnose no error on valid value', async () => {
    const text = readJvTestAsset(
      'regex-constraint-executor/valid-constraint.jv',
    );

    const valid = await parseAndValidateConstraint(text, 'a');

    expect(valid).toBe(true);
  });

  it('should diagnose error on invalid value', async () => {
    const text = readJvTestAsset(
      'regex-constraint-executor/valid-constraint.jv',
    );

    const valid = await parseAndValidateConstraint(text, '0');

    expect(valid).toBe(false);
  });
});
