// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import { strict as assert } from 'assert';

import { AstNode, AstNodeLocator, LangiumDocument } from 'langium';
import { NodeFileSystem } from 'langium/node';

import {
  ValueTypeReference,
  ValuetypeDefinition,
  createJayveeServices,
} from '../..';
import {
  ParseHelperOptions,
  createJayveeValidationProps,
  expectNoParserAndLexerErrors,
  parseHelper,
  readJvTestAssetHelper,
  validationAcceptorMockImpl,
} from '../../../test';

import { validateValueTypeReference } from './value-type-reference';

describe('Validation of ValueTypeReference', () => {
  let parse: (
    input: string,
    options?: ParseHelperOptions,
  ) => Promise<LangiumDocument<AstNode>>;

  const validationAcceptorMock = jest.fn(validationAcceptorMockImpl);

  let locator: AstNodeLocator;

  const readJvTestAsset = readJvTestAssetHelper(
    __dirname,
    '../../../test/assets/',
  );

  async function parseValueTypeReferencesFromValuetypes(input: string) {
    const document = await parse(input);
    expectNoParserAndLexerErrors(document);

    const valueTypeReferences: ValueTypeReference[] = [];

    let valueTypeDefinition: ValuetypeDefinition | undefined;
    let i = 0;
    do {
      valueTypeDefinition = locator.getAstNode<ValuetypeDefinition>(
        document.parseResult.value,
        `valueTypes@${i}`,
      );
      if (valueTypeDefinition !== undefined) {
        const valueTypeRef = valueTypeDefinition.type;
        assert(valueTypeRef !== undefined);
        valueTypeReferences.push(valueTypeRef);
      }
      ++i;
    } while (valueTypeDefinition !== undefined);

    return valueTypeReferences;
  }

  beforeAll(() => {
    // Create language services
    const services = createJayveeServices(NodeFileSystem).Jayvee;
    locator = services.workspace.AstNodeLocator;
    // Parse function for Jayvee (without validation)
    parse = parseHelper(services);
  });

  afterEach(() => {
    // Reset mock
    validationAcceptorMock.mockReset();
  });

  it('should have no error on reference to non-generic value type', async () => {
    const text = readJvTestAsset(
      'value-type-reference/valid-reference-to-non-generic-value-type.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(0);
  });

  it('should have no error on reference to generic value type with single generic', async () => {
    const text = readJvTestAsset(
      'value-type-reference/valid-reference-to-single-generic-value-type.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(0);
  });

  it('should have no error on reference to generic value type with multiple generics', async () => {
    const text = readJvTestAsset(
      'value-type-reference/valid-reference-to-multiple-generic-value-type.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(0);
  });

  it('should diagnose error on reference to generic value type with missing generic parameters', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-missing-generic.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
    expect(validationAcceptorMock).toHaveBeenCalledWith(
      'error',
      `The referenced value type ValueType requires 2 generic parameters but found 0.`,
      expect.any(Object),
    );
  });

  it('should diagnose error on reference to generic value type with too few generic parameters', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-too-few-generic-parameters.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
    expect(validationAcceptorMock).toHaveBeenCalledWith(
      'error',
      `The referenced value type ValueType requires 2 generic parameters but found 1.`,
      expect.any(Object),
    );
  });

  it('should diagnose error on reference to generic value type with too few generic parameters', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-too-many-generic-parameters.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
    expect(validationAcceptorMock).toHaveBeenCalledWith(
      'error',
      `The referenced value type ValueType requires 2 generic parameters but found 3.`,
      expect.any(Object),
    );
  });

  it('should diagnose error on reference to non-generic value type with generic parameters', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-too-non-generic-with-generic-parameters.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
    expect(validationAcceptorMock).toHaveBeenCalledWith(
      'error',
      `The referenced value type ValueType requires 0 generic parameters but found 1.`,
      expect.any(Object),
    );
  });

  it('should diagnose error on reference to non-referenceable value type', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-to-non-referenceable-value-type-in-value-type.jv',
    );

    (await parseValueTypeReferencesFromValuetypes(text)).forEach(
      (valueTypeRef) => {
        validateValueTypeReference(
          valueTypeRef,
          createJayveeValidationProps(validationAcceptorMock),
        );
      },
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(2);
    expect(validationAcceptorMock).toHaveBeenNthCalledWith(
      1,
      'error',
      `Value type Constraint cannot be referenced in this context`,
      expect.any(Object),
    );
    expect(validationAcceptorMock).toHaveBeenNthCalledWith(
      2,
      'error',
      `Value type Regex cannot be referenced in this context`,
      expect.any(Object),
    );
  });

  it('should diagnose error on reference to non-referenceable value-type in a block', async () => {
    const text = readJvTestAsset(
      'value-type-reference/invalid-reference-to-non-referenceable-value-type-in-block.jv',
    );

    const document = await parse(text);
    expectNoParserAndLexerErrors(document);
    const valueTypeRef = locator.getAstNode<ValueTypeReference>(
      document.parseResult.value,
      `pipelines@0/blocks@0/body/properties@0/value/values@0/value/type`,
    );
    assert(valueTypeRef !== undefined);

    validateValueTypeReference(
      valueTypeRef,
      createJayveeValidationProps(validationAcceptorMock),
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
    expect(validationAcceptorMock).toHaveBeenCalledWith(
      'error',
      `Value type Constraint cannot be referenced in this context`,
      expect.any(Object),
    );
  });

  it('should not diagnose error on reference to non-referenceable value-type in a builtin blocktype', async () => {
    const text = readJvTestAsset(
      'value-type-reference/valid-reference-to-non-referenceable-value-type-in-builtin-blocktype.jv',
    );

    const document = await parse(text);
    expectNoParserAndLexerErrors(document);
    const valueTypeRef = locator.getAstNode<ValueTypeReference>(
      document.parseResult.value,
      `blocktypes@0/properties@0/valueType`,
    );
    assert(valueTypeRef !== undefined);

    validateValueTypeReference(
      valueTypeRef,
      createJayveeValidationProps(validationAcceptorMock),
    );

    expect(validationAcceptorMock).toHaveBeenCalledTimes(0);
  });
});