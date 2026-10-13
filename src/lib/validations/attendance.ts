import * as z from "zod";

export const createAttendanceActionSchema = (
  isExplanationRequired: boolean,
  actionType: "check-in" | "check-out" = "check-in"
) =>
  z.object({
    notes: isExplanationRequired
      ? z
          .string()
          .trim()
          .min(
            10,
            `Explanation must be at least 10 characters for ${
              actionType === "check-in" ? "late arrival" : "early departure"
            }.`
          )
          .max(255, "Notes cannot exceed 255 characters.")
      : z.string().trim().max(255).optional(),
  });

export type AttendanceActionFormValues = z.infer<
  ReturnType<typeof createAttendanceActionSchema>
>;
