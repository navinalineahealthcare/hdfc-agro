import { Types, Document } from "mongoose";

export interface IClickToCall extends Document {
  uuid: string;
  call_to_number: string;
  casesId: Types.ObjectId;
  caller_id_number: string;
  start_stamp: string;
  answer_agent_number: string;
  call_id: string;
  billing_circle: {
    operator: string;
    circle: string;
  };
  call_status: string;
  direction: string;
  customer_no_with_prefix: string;
  async: number;
  get_call_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  status?: string;
}

// 1. Interface for CallFlow
interface CallFlow {
  type: string;
  value: string;
  time: string;
  id: string;
  name: string;
  dialst: string;
  num: string;
  subtype: string;
  extension: string;
  number: string;
  anstime: string;
}

// 2. Interface for CallResponse
export interface CallResponseDocument extends Document {
  callRequestId: Types.ObjectId;
  casesId: Types.ObjectId;
  uuid: string;
  callToNumber: string;
  callerIdNumber: string;
  startStamp: string;
  answerStamp: string;
  endStamp: string;
  hangupCause: string;
  billsec: string;
  digitsDialed: string;
  direction: string;
  duration: string;
  answeredAgent: object;
  answeredAgentName: string;
  answeredAgentNumber: string;
  missedAgent: string;
  callFlow: CallFlow[];
  broadcastLeadFields: string;
  recordingUrl: string;
  callStatus: string;
  callId: string;
  outboundSec: string;
  agentRingTime: string;
  agentTransferRingTime: string;
  billingCircle: {
    operator: string;
    circle: string;
  };
  callConnected: boolean;
  awsCallRecordingIdentifier: string;
  customerNoWithPrefix: string;
  campaignName: string;
  campaignId: string;
  customerRingTime: string;
  reasonKey: string;
  async: string;
  getCallId: string;
}
