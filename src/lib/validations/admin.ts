import * as z from "zod";

const roleSchema = z.enum(["EMPLOYEE", "ADMIN"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Please enter a valid email address"),
  role: roleSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const editUserSchema = createUserSchema.extend({
  password: z
    .string()
    .refine((v) => v === "" || v.length >= 8, "Password must be at least 8 characters"),
});

export type UserFormData = z.infer<typeof editUserSchema>;

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use 24-hour format (HH:mm)");

export const workScheduleSchema = z
  .object({
    workStartTime: timeSchema,
    workEndTime: timeSchema,
    lateToleranceMinutes: z
      .number()
      .int("Must be a whole number")
      .min(0, "Minimum is 0 minutes")
      .max(120, "Maximum is 120 minutes"),
  })
  .refine((d) => d.workEndTime > d.workStartTime, {
    message: "End time must be after start time",
    path: ["workEndTime"],
  });

export type WorkScheduleFormData = z.infer<typeof workScheduleSchema>;
export type WorkScheduleFormInput = WorkScheduleFormData;
