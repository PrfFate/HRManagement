import { z } from "zod";

import { LeaveStatuses, LeaveTypes } from "../../common/constants/leave.js";

const leaveTypeSchema = z.enum([LeaveTypes.Annual, LeaveTypes.Sick, LeaveTypes.Personal], {
  errorMap: () => ({ message: "İzin türü seçiniz." }),
});

const leaveListStatusSchema = z.enum(
  [LeaveStatuses.Pending, LeaveStatuses.Approved, LeaveStatuses.Rejected],
  {
    errorMap: () => ({ message: "İzin durumu geçersiz." }),
  },
);

const leaveDecisionStatusSchema = z.enum([LeaveStatuses.Approved, LeaveStatuses.Rejected], {
  errorMap: () => ({ message: "İzin durumu seçiniz." }),
});

const optionalPageSchema = z.coerce
  .number({
    invalid_type_error: "Sayfa numarası geçersiz.",
  })
  .int("Sayfa numarası geçersiz.")
  .optional();

const optionalPageSizeSchema = z.coerce
  .number({
    invalid_type_error: "Sayfa boyutu geçersiz.",
  })
  .int("Sayfa boyutu geçersiz.")
  .optional();

function parseDateInput(value: string) {
  const normalizedValue = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedValue);
  const localMatch = /^(\d{2})[./-](\d{2})[./-](\d{4})$/.exec(normalizedValue);

  const year = Number(isoMatch?.[1] ?? localMatch?.[3]);
  const month = Number(isoMatch?.[2] ?? localMatch?.[2]);
  const day = Number(isoMatch?.[3] ?? localMatch?.[1]);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function todayBusinessDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Istanbul",
    year: "numeric",
  }).formatToParts(new Date());
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = Number(partMap.year);
  const month = Number(partMap.month);
  const day = Number(partMap.day);

  return new Date(Date.UTC(year, month - 1, day));
}

function dateSchema(requiredMessage: string, invalidMessage: string) {
  return z
    .string({
      required_error: requiredMessage,
      invalid_type_error: invalidMessage,
    })
    .trim()
    .min(1, requiredMessage)
    .transform((value, context) => {
      const date = parseDateInput(value);

      if (!date) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: invalidMessage,
        });

        return z.NEVER;
      }

      return date;
    });
}

export const createLeaveRequestSchema = z
  .object({
    leaveType: leaveTypeSchema,
    startDate: dateSchema("Başlangıç tarihi seçiniz.", "Geçerli bir başlangıç tarihi giriniz."),
    endDate: dateSchema("Bitiş tarihi seçiniz.", "Geçerli bir bitiş tarihi giriniz."),
    description: z.string().trim().max(500, "Açıklama en fazla 500 karakter olabilir.").optional(),
  })
  .superRefine((data, context) => {
    if (!(data.startDate instanceof Date) || !(data.endDate instanceof Date)) {
      return;
    }

    const today = todayBusinessDate();

    if (data.startDate < today) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Başlangıç tarihi geçmiş bir tarih olamaz.",
        path: ["startDate"],
      });
    }

    if (data.endDate < today) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitiş tarihi geçmiş bir tarih olamaz.",
        path: ["endDate"],
      });
    }

    if (data.startDate > data.endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
        path: ["endDate"],
      });
    }
  });

export const listLeaveRequestsQuerySchema = z.object({
  search: z.string().trim().max(100, "Arama metni en fazla 100 karakter olabilir.").optional(),
  status: leaveListStatusSchema.optional(),
  page: optionalPageSchema,
  pageSize: optionalPageSizeSchema,
});

export const leaveRequestIdParamsSchema = z.object({
  id: z.string().uuid("Geçerli bir izin talebi kimliği giriniz."),
});

export const updateLeaveRequestStatusSchema = z.object({
  status: leaveDecisionStatusSchema,
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;
export type ListLeaveRequestsQuery = z.infer<typeof listLeaveRequestsQuerySchema>;
export type UpdateLeaveRequestStatusInput = z.infer<typeof updateLeaveRequestStatusSchema>;
