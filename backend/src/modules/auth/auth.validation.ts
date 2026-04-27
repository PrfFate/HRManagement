import { z } from "zod";

const optionalPhoneSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{10,20}$/, "Geçerli bir telefon numarası giriniz.")
    .optional(),
);

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ad soyad en az 2 karakter olmalıdır.")
    .max(100, "Ad soyad en fazla 100 karakter olabilir."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi giriniz.")
    .max(254, "E-posta en fazla 254 karakter olabilir."),
  phone: optionalPhoneSchema,
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .max(72, "Şifre en fazla 72 karakter olabilir."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi giriniz.")
    .max(254, "E-posta en fazla 254 karakter olabilir."),
  password: z.string().min(1, "Şifre giriniz.").max(72, "Şifre en fazla 72 karakter olabilir."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
