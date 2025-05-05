export enum statusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum CaseStatusEnum {
  RECEIVED = 'Received',
  RECALL = 'Recall',
  SENT_TO_QC = 'Sent to QC',
  CLOSED = 'Closed',
  INSURER_ACTIONABLE = 'Insurer actionable',
  CANCELLED = 'Cancelled',
  ABORT = 'Abort',
  QC_REJECTED = 'QC Rejected',
  REQUESTED = 'Requested',
}

export enum rolesEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  QC = "QC",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
}

export enum devicesEnum {
  IOS = "IOS",
  ANDROID = "ANDROID",
  WEB = "WEB",
}
