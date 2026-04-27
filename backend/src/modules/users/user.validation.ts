import { z } from "zod";

import { RoleIds } from "../../common/constants/roles.js";

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

export const listUsersQuerySchema = z.object({
  search: z.string().trim().max(100, "Arama metni en fazla 100 karakter olabilir.").optional(),
  roleId: z.coerce
    .number({
      invalid_type_error: "Rol filtresi geçersiz.",
    })
    .int("Rol filtresi geçersiz.")
    .optional(),
  page: optionalPageSchema,
  pageSize: optionalPageSizeSchema,
});

export const listPendingUsersQuerySchema = z.object({
  search: z.string().trim().max(100, "Arama metni en fazla 100 karakter olabilir.").optional(),
  page: optionalPageSchema,
  pageSize: optionalPageSizeSchema,
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid("Geçerli bir kullanıcı kimliği giriniz."),
});

export const updateUserRoleSchema = z.object({
  roleId: z.coerce
    .number({
      required_error: "Rol seçiniz.",
      invalid_type_error: "Rol seçiniz.",
    })
    .int("Rol geçersiz.")
    .refine(
      (roleId) => [RoleIds.Manager, RoleIds.Employee, RoleIds.PendingUser].includes(
        roleId as typeof RoleIds[keyof typeof RoleIds],
      ),
      "Rol geçersiz.",
    ),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type ListPendingUsersQuery = z.infer<typeof listPendingUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
