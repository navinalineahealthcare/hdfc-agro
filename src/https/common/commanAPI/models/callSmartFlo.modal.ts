import { Schema, model, Document } from "mongoose";
import { IClickToCall } from "../types/callSmartFlo.type";

// Create the schema using the interface
const clickToCallSchema = new Schema<IClickToCall>(
  {
    uuid: { type: String, default: null },
    casesId: { type: Schema.Types.ObjectId, ref: "AssignMaster" },
    call_to_number: { type: String, default: null },
    caller_id_number: { type: String, default: null },
    start_stamp: { type: String, default: null },
    answer_agent_number: { type: String, default: null },
    call_id: { type: String, default: null },
    billing_circle: {
      operator: { type: String, default: null },
      circle: { type: String, default: null },
    },
    call_status: { type: String, default: null },
    direction: { type: String, default: null },
    customer_no_with_prefix: { type: String, default: null },
    async: { type: Number, default: null },
    get_call_id: { type: Number, default: null },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date },
    createdBy: { type: String, default: "System" },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

// Create and export the model
const ClickToCall = model<IClickToCall>("click_to_call", clickToCallSchema);

const CallFlowSchema = new Schema(
  {
    type: String,
    value: String,
    time: String,
    id: String,
    name: String,
    dialst: String,
    num: String,
    subtype: String,
    extension: String,
    number: String,
    anstime: String,
  },
  { _id: false }
);

const CallResponseSchema = new Schema({
  callRequestId: { type: Schema.Types.ObjectId, ref: "ClickToCall" },
  casesId: { type: Schema.Types.ObjectId, ref: "AssignMaster" },
  uuid: String,
  callToNumber: String,
  callerIdNumber: String,
  startStamp: String,
  answerStamp: String,
  endStamp: String,
  hangupCause: String,
  billsec: String,
  digitsDialed: String,
  direction: String,
  duration: String,
  answeredAgent: { type: Object },
  answeredAgentName: String,
  answeredAgentNumber: String,
  missedAgent: String,
  callFlow: { type: [CallFlowSchema], default: [] },
  broadcastLeadFields: String,
  recordingUrl: String,
  callStatus: String,
  callId: String,
  outboundSec: String,
  agentRingTime: String,
  agentTransferRingTime: String,
  billingCircle: {
    operator: String,
    circle: String,
  },
  callConnected: Boolean,
  awsCallRecordingIdentifier: String,
  customerNoWithPrefix: String,
  campaignName: String,
  campaignId: String,
  customerRingTime: String,
  reasonKey: String,
  async: String,
  getCallId: String,
});

const CallResponse = model("CallResponse", CallResponseSchema);
export { ClickToCall, CallResponse };
