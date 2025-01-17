// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import {
  type AstNode,
  type AstNodeLocator,
  type LangiumDocument,
} from 'langium';
import { NodeFileSystem } from 'langium/node';

import {
  type JayveeServices,
  type PropertyBody,
  createJayveeServices,
} from '../../..';
import {
  type ParseHelperOptions,
  createJayveeValidationProps,
  expectNoParserAndLexerErrors,
  parseHelper,
  readJvTestAssetHelper,
  validationAcceptorMockImpl,
} from '../../../../test';

import { checkConstraintTypeSpecificPropertyBody } from './property-body';

describe('Validation of constraint type specific property bodies', () => {
  let parse: (
    input: string,
    options?: ParseHelperOptions,
  ) => Promise<LangiumDocument<AstNode>>;

  const validationAcceptorMock = jest.fn(validationAcceptorMockImpl);

  let locator: AstNodeLocator;
  let services: JayveeServices;

  const readJvTestAsset = readJvTestAssetHelper(
    __dirname,
    '../../../../test/assets/',
  );

  async function parseAndValidatePropertyAssignment(input: string) {
    const document = await parse(input);
    expectNoParserAndLexerErrors(document);

    const propertyBody = locator.getAstNode<PropertyBody>(
      document.parseResult.value,
      'constraints@0/body',
    ) as PropertyBody;

    const props = createJayveeValidationProps(validationAcceptorMock, services);

    const wrapper = props.wrapperFactories.TypedObject.wrap(
      propertyBody.$container.type,
    );
    expect(wrapper).toBeDefined();

    checkConstraintTypeSpecificPropertyBody(propertyBody, props);
  }

  beforeAll(() => {
    // Create language services
    services = createJayveeServices(NodeFileSystem).Jayvee;

    locator = services.workspace.AstNodeLocator;

    // Parse function for Jayvee (without validation)
    parse = parseHelper(services);
  });

  afterEach(() => {
    // Reset mock
    validationAcceptorMock.mockReset();
  });

  describe('LengthConstraint constraint type', () => {
    it('should diagnose error on min > max', async () => {
      const text = readJvTestAsset(
        'property-body/constrainttype-specific/length-constraint/invalid-min-greater-max.jv',
      );

      await parseAndValidatePropertyAssignment(text);

      expect(validationAcceptorMock).toHaveBeenCalledTimes(2);
      expect(validationAcceptorMock).toHaveBeenCalledWith(
        'error',
        `The minimum length needs to be smaller or equal to the maximum length`,
        expect.any(Object),
      );
    });
  });

  describe('RangeConstraint constraint type', () => {
    it('should diagnose error on lower bound > upper bound', async () => {
      const text = readJvTestAsset(
        'property-body/constrainttype-specific/range-constraint/invalid-lower-above-upper.jv',
      );

      await parseAndValidatePropertyAssignment(text);

      expect(validationAcceptorMock).toHaveBeenCalledTimes(2);
      expect(validationAcceptorMock).toHaveBeenCalledWith(
        'error',
        `The lower bound needs to be smaller or equal to the upper bound`,
        expect.any(Object),
      );
    });

    it('should diagnose error on lower bound = upper bound without bound inclusivity = true', async () => {
      const text = readJvTestAsset(
        'property-body/constrainttype-specific/range-constraint/invalid-missing-bound-inclusivity.jv',
      );

      await parseAndValidatePropertyAssignment(text);

      expect(validationAcceptorMock).toHaveBeenCalledTimes(1);
      expect(validationAcceptorMock).toHaveBeenCalledWith(
        'error',
        `Lower and upper bounds need to be inclusive if they are identical`,
        expect.any(Object),
      );
    });
  });
});
