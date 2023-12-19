import {
  BlockDefinition,
  CompositeBlocktypeDefinition,
  PipelineDefinition,
} from '../generated/ast';

import { AstNodeWrapper } from './ast-node-wrapper';
import { PipeWrapper, createWrappersFromPipeChain } from './pipe-wrapper';

export class PipelineWrapper
  implements AstNodeWrapper<PipelineDefinition | CompositeBlocktypeDefinition>
{
  public readonly astNode: PipelineDefinition | CompositeBlocktypeDefinition;

  allPipes: PipeWrapper[] = [];

  constructor(
    pipelineDefinition: PipelineDefinition | CompositeBlocktypeDefinition,
  ) {
    this.astNode = pipelineDefinition;

    this.allPipes = pipelineDefinition.pipes.flatMap((pipe) =>
      createWrappersFromPipeChain(pipe),
    );
  }

  static canBeWrapped(pipelineDefinition: PipelineDefinition): boolean {
    for (const pipeDefinition of pipelineDefinition.pipes) {
      for (
        let chainIndex = 0;
        chainIndex < pipeDefinition.blocks.length - 1;
        ++chainIndex
      ) {
        if (!PipeWrapper.canBeWrapped(pipeDefinition, chainIndex)) {
          return false;
        }
      }
    }
    return true;
  }

  getStartingBlockPipes(): PipeWrapper[] {
    return this.allPipes.filter((pipe) => {
      const fromBlock = pipe.from;
      const isToOfOtherPipe =
        this.allPipes.filter((p) => p.to === fromBlock).length > 0;
      return !isToOfOtherPipe;
    });
  }

  getStartingBlocks(): BlockDefinition[] {
    return this.getStartingBlockPipes().map((p) => p.from);
  }

  getSuccessorPipes(blockDefinition: BlockDefinition): PipeWrapper[] {
    return this.allPipes.filter((pipe) => {
      return pipe.from === blockDefinition;
    });
  }

  getSuccessorBlocks(blockDefinition: BlockDefinition): BlockDefinition[] {
    return this.getSuccessorPipes(blockDefinition).map((p) => p.to);
  }

  getPredecessorPipes(blockDefinition: BlockDefinition): PipeWrapper[] {
    return this.allPipes.filter((pipe) => {
      return pipe.to === blockDefinition;
    });
  }

  getPredecessorBlocks(blockDefinition: BlockDefinition): BlockDefinition[] {
    return this.getPredecessorPipes(blockDefinition).map((p) => p.from);
  }
}
