/******************************************************************************
 * This file was generated by langium-cli 0.5.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AstNode, AstReflection, Reference, ReferenceInfo, isAstNode, TypeMetaData } from 'langium';

export type BlockType = CSVFileExtractor | LayoutValidator | PostgresLoader;

export const BlockType = 'BlockType';

export function isBlockType(item: unknown): item is BlockType {
    return reflection.isInstance(item, BlockType);
}

export type IntAttributeValue = IntValue | RuntimeParameter;

export const IntAttributeValue = 'IntAttributeValue';

export function isIntAttributeValue(item: unknown): item is IntAttributeValue {
    return reflection.isInstance(item, IntAttributeValue);
}

export type IntValue = number;

export type Section = ColumnSection | RowSection;

export const Section = 'Section';

export function isSection(item: unknown): item is Section {
    return reflection.isInstance(item, Section);
}

export type StringAttributeValue = RuntimeParameter | StringValue;

export const StringAttributeValue = 'StringAttributeValue';

export function isStringAttributeValue(item: unknown): item is StringAttributeValue {
    return reflection.isInstance(item, StringAttributeValue);
}

export type StringValue = string;

export type Type = 'boolean' | 'decimal' | 'integer' | 'text';

export interface Block extends AstNode {
    readonly $container: Pipeline;
    name: string
    type: BlockType
}

export const Block = 'Block';

export function isBlock(item: unknown): item is Block {
    return reflection.isInstance(item, Block);
}

export interface ColumnSection extends AstNode {
    readonly $container: Layout;
    columnId: string
    type: Type
}

export const ColumnSection = 'ColumnSection';

export function isColumnSection(item: unknown): item is ColumnSection {
    return reflection.isInstance(item, ColumnSection);
}

export interface CSVFileExtractor extends AstNode {
    readonly $container: Block;
    url: StringAttribute
}

export const CSVFileExtractor = 'CSVFileExtractor';

export function isCSVFileExtractor(item: unknown): item is CSVFileExtractor {
    return reflection.isInstance(item, CSVFileExtractor);
}

export interface IntAttribute extends AstNode {
    readonly $container: PostgresLoader;
    value: IntAttributeValue
}

export const IntAttribute = 'IntAttribute';

export function isIntAttribute(item: unknown): item is IntAttribute {
    return reflection.isInstance(item, IntAttribute);
}

export interface Layout extends AstNode {
    readonly $container: Model | Pipeline;
    name: string
    sections: Array<Section>
}

export const Layout = 'Layout';

export function isLayout(item: unknown): item is Layout {
    return reflection.isInstance(item, Layout);
}

export interface LayoutAttribute extends AstNode {
    readonly $container: LayoutValidator;
    value: Reference<Layout>
}

export const LayoutAttribute = 'LayoutAttribute';

export function isLayoutAttribute(item: unknown): item is LayoutAttribute {
    return reflection.isInstance(item, LayoutAttribute);
}

export interface LayoutValidator extends AstNode {
    readonly $container: Block;
    layout: LayoutAttribute
}

export const LayoutValidator = 'LayoutValidator';

export function isLayoutValidator(item: unknown): item is LayoutValidator {
    return reflection.isInstance(item, LayoutValidator);
}

export interface Model extends AstNode {
    layouts: Array<Layout>
    pipelines: Array<Pipeline>
}

export const Model = 'Model';

export function isModel(item: unknown): item is Model {
    return reflection.isInstance(item, Model);
}

export interface Pipe extends AstNode {
    readonly $container: Pipeline;
    from: Reference<Block>
    to: Reference<Block>
}

export const Pipe = 'Pipe';

export function isPipe(item: unknown): item is Pipe {
    return reflection.isInstance(item, Pipe);
}

export interface Pipeline extends AstNode {
    readonly $container: Model;
    blocks: Array<Block>
    layouts: Array<Layout>
    name: string
    pipes: Array<Pipe>
}

export const Pipeline = 'Pipeline';

export function isPipeline(item: unknown): item is Pipeline {
    return reflection.isInstance(item, Pipeline);
}

export interface PostgresLoader extends AstNode {
    readonly $container: Block;
    database: StringAttribute
    host: StringAttribute
    name: 'PostgresLoader'
    password: StringAttribute
    port: IntAttribute
    table: StringAttribute
    username: StringAttribute
}

export const PostgresLoader = 'PostgresLoader';

export function isPostgresLoader(item: unknown): item is PostgresLoader {
    return reflection.isInstance(item, PostgresLoader);
}

export interface RowSection extends AstNode {
    readonly $container: Layout;
    header: boolean
    rowId: number
    type: Type
}

export const RowSection = 'RowSection';

export function isRowSection(item: unknown): item is RowSection {
    return reflection.isInstance(item, RowSection);
}

export interface RuntimeParameter extends AstNode {
    readonly $container: IntAttribute | StringAttribute;
    name: string
}

export const RuntimeParameter = 'RuntimeParameter';

export function isRuntimeParameter(item: unknown): item is RuntimeParameter {
    return reflection.isInstance(item, RuntimeParameter);
}

export interface StringAttribute extends AstNode {
    readonly $container: CSVFileExtractor | PostgresLoader;
    value: StringAttributeValue
}

export const StringAttribute = 'StringAttribute';

export function isStringAttribute(item: unknown): item is StringAttribute {
    return reflection.isInstance(item, StringAttribute);
}

export type JayveeAstType = 'Block' | 'BlockType' | 'CSVFileExtractor' | 'ColumnSection' | 'IntAttribute' | 'IntAttributeValue' | 'Layout' | 'LayoutAttribute' | 'LayoutValidator' | 'Model' | 'Pipe' | 'Pipeline' | 'PostgresLoader' | 'RowSection' | 'RuntimeParameter' | 'Section' | 'StringAttribute' | 'StringAttributeValue';

export class JayveeAstReflection implements AstReflection {

    getAllTypes(): string[] {
        return ['Block', 'BlockType', 'CSVFileExtractor', 'ColumnSection', 'IntAttribute', 'IntAttributeValue', 'Layout', 'LayoutAttribute', 'LayoutValidator', 'Model', 'Pipe', 'Pipeline', 'PostgresLoader', 'RowSection', 'RuntimeParameter', 'Section', 'StringAttribute', 'StringAttributeValue'];
    }

    isInstance(node: unknown, type: string): boolean {
        return isAstNode(node) && this.isSubtype(node.$type, type);
    }

    isSubtype(subtype: string, supertype: string): boolean {
        if (subtype === supertype) {
            return true;
        }
        switch (subtype) {
            case ColumnSection:
            case RowSection: {
                return this.isSubtype(Section, supertype);
            }
            case CSVFileExtractor:
            case LayoutValidator:
            case PostgresLoader: {
                return this.isSubtype(BlockType, supertype);
            }
            case RuntimeParameter: {
                return this.isSubtype(StringAttributeValue, supertype) || this.isSubtype(IntAttributeValue, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'LayoutAttribute:value': {
                return Layout;
            }
            case 'Pipe:from': {
                return Block;
            }
            case 'Pipe:to': {
                return Block;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'Layout': {
                return {
                    name: 'Layout',
                    mandatory: [
                        { name: 'sections', type: 'array' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    mandatory: [
                        { name: 'layouts', type: 'array' },
                        { name: 'pipelines', type: 'array' }
                    ]
                };
            }
            case 'Pipeline': {
                return {
                    name: 'Pipeline',
                    mandatory: [
                        { name: 'blocks', type: 'array' },
                        { name: 'layouts', type: 'array' },
                        { name: 'pipes', type: 'array' }
                    ]
                };
            }
            case 'RowSection': {
                return {
                    name: 'RowSection',
                    mandatory: [
                        { name: 'header', type: 'boolean' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new JayveeAstReflection();
