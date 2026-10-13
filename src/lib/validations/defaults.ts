import * as z from "zod";

/**
 * Extracts a sensible fallback default value for a specific Zod field.
 */
function getDefaultForField(field: unknown): unknown {
  if (!field) return "";

  if (field instanceof z.ZodDefault) {
    return field.parse(undefined);
  }

  if (field instanceof z.ZodString) return "";
  if (field instanceof z.ZodNumber) return 0;
  if (field instanceof z.ZodBoolean) return false;
  if (field instanceof z.ZodArray) return [];

  if (field instanceof z.ZodEnum) {
    return field.options[0] ?? "";
  }

  if (field instanceof z.ZodOptional) {
    return getDefaultForField(field.unwrap());
  }

  if (field instanceof z.ZodNullable) {
    return null;
  }

  return "";
}

/**
 * Automatically creates default form values from a Zod schema.
 *
 * @param schema - A Zod schema (such as ZodObject)
 * @param overrides - Optional initial values to override defaults
 * @returns Fully typed default values matching `z.infer<TSchema>`
 */
export function getDefaultValues<TSchema extends z.ZodType>(
  schema: TSchema,
  overrides?: Partial<z.infer<TSchema>>
): z.infer<TSchema> {
  const defaults: Record<string, unknown> = {};

  if (schema instanceof z.ZodObject) {
    for (const [key, field] of Object.entries(schema.shape)) {
      defaults[key] = getDefaultForField(field);
    }
  }

  return { ...defaults, ...overrides } as z.infer<TSchema>;
}
