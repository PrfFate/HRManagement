import { ApiResponse } from "../../common/utils/apiResponse.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { userService } from "./user.service.js";

export const userController = {
  list: asyncHandler(async (req, res) => {
    const result = await userService.list(req.query);

    res.json(ApiResponse.paginated("Kullanıcılar listelendi.", result.items, result.pagination));
  }),

  listPending: asyncHandler(async (req, res) => {
    const result = await userService.listPending(req.query);

    res.json(
      ApiResponse.paginated("Bekleyen kullanıcılar listelendi.", result.items, result.pagination),
    );
  }),

  approve: asyncHandler(async (req, res) => {
    const user = await userService.approve(req.params.id);

    res.json(ApiResponse.success("Kullanıcı onaylandı.", user));
  }),

  reject: asyncHandler(async (req, res) => {
    const user = await userService.reject(req.params.id);

    res.json(ApiResponse.success("Kullanıcı reddedildi.", user));
  }),

  updateRole: asyncHandler(async (req, res) => {
    const user = await userService.updateRole(req.params.id, req.body, req.user!.userId);

    res.json(ApiResponse.success("Kullanıcı rolü güncellendi.", user));
  }),
};
