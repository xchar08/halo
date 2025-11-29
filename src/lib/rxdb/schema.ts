import { RxJsonSchema, toTypedRxJsonSchema, ExtractDocumentTypeFromTypedRxJsonSchema } from 'rxdb';

export const docSchemaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        title: { type: 'string' },
        url: { type: 'string' },
        content: { type: 'string' },
        project_id: { type: 'string' },
        source_type: { type: 'string' },
        math_density_score: { type: 'number' },
        metadata: { type: 'object' }, // Critical fix for Monitor logic
        updated_at: { type: 'string', format: 'date-time' }
    },
    required: ['id']
} as const;

const schemaTyped = toTypedRxJsonSchema(docSchemaLiteral);
export type RxDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const docSchema: RxJsonSchema<RxDocumentType> = docSchemaLiteral;

export const citationSchemaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 200 },
        source_doc_id: { type: 'string' },
        target_doc_id: { type: 'string' },
        citation_type: { type: 'string' },
        weight: { type: 'number' }
    },
    required: ['id']
} as const;

const citationSchemaTyped = toTypedRxJsonSchema(citationSchemaLiteral);
export type RxCitationType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof citationSchemaTyped>;
export const citationSchema: RxJsonSchema<RxCitationType> = citationSchemaLiteral;
