import { Document } from "mongoose";

export enum actionTypeEnum {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
}

export enum elementTypeEnum {
  ADMIN = "ADMIN",
  ROLE = "ROLE",
  TASK = "TASK",
  FAQ = "FAQ",
  TERMS = "TERMS",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  ABOUTUS = "ABOUTUS",
  CONTACTUS = "CONTACTUS",
}

export interface activityLogsTypes extends Document {
  id: string;
  moduleId: string;
  vehicleId: string;
  buyRequestId: string;
  actionFrom: string;
  actionTo: string;
  elementId: string;
  elementType: string;
  description: string;
  userId: string;
  actionType: actionTypeEnum;
  roleId: string;
  createdAt: Date;
}
