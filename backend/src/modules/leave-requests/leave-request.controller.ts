import { ApiResponse } from "../../common/utils/apiResponse.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { leaveRequestService } from "./leave-request.service.js";

export const leaveRequestController = {
  create: asyncHandler(async (req, res) => {
    const leaveRequest = await leaveRequestService.create(req.user!.userId, req.body);

    res.status(201).json(ApiResponse.success("İzin talebi oluşturuldu.", leaveRequest));
  }),

  listAll: asyncHandler(async (req, res) => {
    const result = await leaveRequestService.listAll(req.query);

    res.json(ApiResponse.paginated("İzin talepleri listelendi.", result.items, result.pagination));
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await leaveRequestService.listMine(req.user!.userId, req.query);

    res.json(ApiResponse.paginated("İzin talepleriniz listelendi.", result.items, result.pagination));
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const leaveRequest = await leaveRequestService.updateStatus(req.params.id, req.body);

    res.json(ApiResponse.success("İzin talebi durumu güncellendi.", leaveRequest));
  }),
};
