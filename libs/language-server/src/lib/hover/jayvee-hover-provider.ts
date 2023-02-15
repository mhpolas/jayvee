import { AstNode, AstNodeHoverProvider, MaybePromise } from 'langium';
import { Hover } from 'vscode-languageserver-protocol';

import { Attribute, Block, isAttribute, isBlock } from '../ast';
import { getMetaInformation } from '../meta-information';

export class JayveeHoverProvider extends AstNodeHoverProvider {
  override getAstNodeHoverContent(
    astNode: AstNode,
  ): MaybePromise<Hover | undefined> {
    let doc = undefined;
    if (isBlock(astNode)) {
      doc = this.getBlockMarkdownDoc(astNode);
    }
    if (isAttribute(astNode)) {
      doc = this.getAttributeMarkdownDoc(astNode);
    }

    if (doc === undefined) {
      return undefined;
    }
    const hover: Hover = {
      contents: {
        kind: 'markdown',
        value: doc,
      },
    };
    return hover;
  }

  private getBlockMarkdownDoc(block: Block): string | undefined {
    const blockMetaInf = getMetaInformation(block.type);
    return blockMetaInf?.getMarkdownDoc();
  }

  private getAttributeMarkdownDoc(attribute: Attribute): string | undefined {
    const block = attribute.$container;
    const blockMetaInf = getMetaInformation(block.type);
    return blockMetaInf?.getAttributeMarkdownDoc(attribute.name);
  }
}