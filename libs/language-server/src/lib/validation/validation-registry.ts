import { ValidationRegistry } from 'langium';

import type { JayveeServices } from '../jayvee-module';

/**
 * Registry for validation checks.
 */
export class JayveeValidationRegistry extends ValidationRegistry {
  constructor(services: JayveeServices) {
    super(services);
    const pipelineValidator = services.validation.PipelineValidator;
    this.register(pipelineValidator.checks, pipelineValidator);

    const layoutValidator = services.validation.LayoutValidator;
    this.register(layoutValidator.checks, layoutValidator);

    const pipeValidator = services.validation.PipeValidator;
    this.register(pipeValidator.checks, pipeValidator);

    const blockValidator = services.validation.BlockValidator;
    this.register(blockValidator.checks, blockValidator);
  }
}