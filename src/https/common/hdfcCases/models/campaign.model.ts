import mongoose from "mongoose";
import { AgentCampaignRequest, CampaignRequest } from "../types/hdfcCases.type";
import { statusEnum } from "../../enums";

const CampaignSchema = new mongoose.Schema<CampaignRequest>(
  {
    campaignId: { type: Number, required: true, unique: true },
    campaignName: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.ACTIVE,
      required: true,
    },
    updatedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CallerAgent = new mongoose.Schema<AgentCampaignRequest>(
  {
    agentNumber: { type: String, required: true },
    callerId: { type: String, required: true },
    callerUserId: { type: String, required: true },
    campaignId: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.ACTIVE,
      required: true,
    },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

const CallingAgent = mongoose.model<AgentCampaignRequest>(
  "caller_agents",
  CallerAgent
);

const Campaign = mongoose.model<CampaignRequest>("campaigns", CampaignSchema);
export { Campaign, CallingAgent };
