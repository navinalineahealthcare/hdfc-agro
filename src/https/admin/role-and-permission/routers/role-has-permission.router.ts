import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { idRoleHasPermissionParamsRequest } from "../requests/id.params.filter.request";
import { RoleHasPermissionController } from "../controllers/roleHasPermission.controller";
import { rolePermissionUpdateReuest } from "../requests/role.permission.update.request";
import {
  roleCreateRequest,
  RoleFilterRequest,
} from "../requests/role.add.request";
import { paginationCleaner } from "../../../../middleware/Pagination";

const router = Router();

router.get(
  "/list/:id",
  RequestParamsValidator(idRoleHasPermissionParamsRequest),
  RoleHasPermissionController.RolePermissionList
);

router.put(
  "/update",
  RequestValidator(rolePermissionUpdateReuest),
  RoleHasPermissionController.PermissionUpdate
);

router.post(
  "/add",
  RequestValidator(roleCreateRequest),
  RoleHasPermissionController.RoleCreate
);

router.get("/role-list", RoleHasPermissionController.RoleList);

router.get(
  "/specific-user-list",
  RequestSortValidator(["firstName", "lastName", "email", "role", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(RoleFilterRequest),
  RoleHasPermissionController.SpecificUserList
);
export default router;
