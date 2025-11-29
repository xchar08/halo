import { RxJsonSchema, toTypedRxJsonSchema, ExtractDocumentTypeFromTypedRxJsonSchema } from 'rxdb';

export const docSchemaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100 // Primary key needs max length
        },
        title: {
            type: 'string'
        },
        // Added missing fields to match Supabase
        url: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        project_id: {
            type: 'string'
        },
        source_type: {
            type: 'string'
        },
        math_density_score: {
            type: 'number',
            minimum: 0,
            maximum: 100
        },
        updated_at: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['id'] // Minimized required fields for robustness
} as const;

const schemaTyped = toTypedRxJsonSchema(docSchemaLiteral);
export type RxDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const docSchema: RxJsonSchema<RxDocumentType> = docSchemaLiteral;


export const citationSchemaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 200 // Composite key usually longer
        },
        source_doc_id: {
            type: 'string'
        },
        target_doc_id: {
            type: 'string'
        },
        citation_type: {
            type: 'string'
        },
        weight: {
            type: 'number'
        }
    },
    required: ['id', 'source_doc_id', 'target_doc_id']
} as const;

const citationSchemaTyped = toTypedRxJsonSchema(citationSchemaLiteral);
export type RxCitationType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof citationSchemaTyped>;
export const citationSchema: RxJsonSchema<RxCitationType> = citationSchemaLiteral;
