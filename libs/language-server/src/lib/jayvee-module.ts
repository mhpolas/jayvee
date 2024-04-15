// SPDX-FileCopyrightText: 2023 Friedrich-Alexander-Universitat Erlangen-Nurnberg
//
// SPDX-License-Identifier: AGPL-3.0-only

import {
  type DeepPartial,
  type DefaultSharedModuleContext,
  type LangiumServices,
  type LangiumSharedServices,
  type Module,
  type PartialLangiumServices,
  createDefaultModule,
  createDefaultSharedModule,
  inject,
} from 'langium';

import {
  DefaultOperatorEvaluatorRegistry,
  DefaultOperatorTypeComputerRegistry,
  type OperatorEvaluatorRegistry,
  type OperatorTypeComputerRegistry,
} from './ast/expressions/operator-registry';
import {
  JayveeGeneratedModule,
  JayveeGeneratedSharedModule,
} from './ast/generated/module';
import { WrapperFactoryProvider } from './ast/wrappers/wrapper-factory-provider';
import { JayveeWorkspaceManager } from './builtin-library/jayvee-workspace-manager';
import { JayveeCompletionProvider } from './completion/jayvee-completion-provider';
import { JayveeHoverProvider } from './hover/jayvee-hover-provider';
import { JayveeValueConverter } from './jayvee-value-converter';
import { RuntimeParameterProvider } from './services/runtime-parameter-provider';
import { JayveeValidationRegistry } from './validation/validation-registry';

/**
 * Declaration of custom services for the Jayvee language.
 * https://langium.org/docs/configuration-services/#adding-new-services
 */
export interface JayveeAddedServices {
  RuntimeParameterProvider: RuntimeParameterProvider;
  operators: {
    TypeComputerRegistry: OperatorTypeComputerRegistry;
    EvaluatorRegistry: OperatorEvaluatorRegistry;
  };
  WrapperFactories: WrapperFactoryProvider;
  validation: {
    ValidationRegistry: JayveeValidationRegistry;
  };
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type JayveeServices = LangiumServices & JayveeAddedServices;

export type JayveeSharedServices = LangiumSharedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const JayveeModule: Module<
  JayveeServices,
  PartialLangiumServices & JayveeAddedServices
> = {
  parser: {
    ValueConverter: () => new JayveeValueConverter(),
  },
  validation: {
    ValidationRegistry: (services) => new JayveeValidationRegistry(services),
  },
  lsp: {
    CompletionProvider: (services: JayveeServices) =>
      new JayveeCompletionProvider(services),
    HoverProvider: (services: JayveeServices) =>
      new JayveeHoverProvider(services),
  },
  RuntimeParameterProvider: () => new RuntimeParameterProvider(),
  operators: {
    TypeComputerRegistry: () => new DefaultOperatorTypeComputerRegistry(),
    EvaluatorRegistry: () => new DefaultOperatorEvaluatorRegistry(),
  },
  WrapperFactories: (services) =>
    new WrapperFactoryProvider(services.operators.EvaluatorRegistry),
};

export const JayveeSharedModule: Module<
  JayveeSharedServices,
  DeepPartial<JayveeSharedServices>
> = {
  workspace: {
    WorkspaceManager: (services) => new JayveeWorkspaceManager(services),
  },
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createJayveeServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Jayvee: JayveeServices;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    JayveeGeneratedSharedModule,
    JayveeSharedModule,
  );
  const Jayvee = inject(
    createDefaultModule({ shared }),
    JayveeGeneratedModule,
    JayveeModule,
  );
  shared.ServiceRegistry.register(Jayvee);

  return { shared, Jayvee };
}
