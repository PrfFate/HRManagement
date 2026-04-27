import { ApiResponse } from "../../common/utils/apiResponse.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authService } from "./auth.service.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json(ApiResponse.success("Kayıt oluşturuldu.", user));
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    res.json(ApiResponse.success("Giriş başarılı.", result));
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.me(req.user!.userId);

    res.json(ApiResponse.success("Kullanıcı bilgileri getirildi.", user));
  }),
};
