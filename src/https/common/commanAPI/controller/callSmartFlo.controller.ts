import { Request, Response } from "express";
import { env } from "../../../../env";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import { statusEnumText } from "../../../../utils/utils";
import { CaseStatusEnum, statusEnum } from "../../enums";
import { axiosRequest } from "../../../../utils/axiosRequest";
import { CallResponse, ClickToCall } from "../models/callSmartFlo.modal";

export class callarSmartFloController {
  public static async clickToCall(req: Request, res: Response): Promise<void> {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      let { alternateMobileNo, MobileNo } = req.body.validatedData;

      const caseExist = await AssignMaster.findOne({
        where: { id: casesId, deletedAt: null },
      }).lean();

      if (!caseExist) {
        res.status(400).send({
          status: false,
          message: "Case not found",
        });
      }

      const headers = {
        accept: "application/json",
        Authorization:
          env.smartFlo.callingAuthToken ??
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Mzc2NzQiLCJpc3MiOiJodHRwczovL2Nsb3VkcGhvbmUudGF0YXRlbGVzZXJ2aWNlcy5jb20vdG9rZW4vZ2VuZXJhdGUiLCJpYXQiOjE3MzE0OTc3MjAsImV4cCI6MjAzMTQ5NzcyMCwibmJmIjoxNzMxNDk3NzIwLCJqdGkiOiJTUGJ2Q3M1aTdHczdHQW5MIn0.vLXFZdtKVrMrKGxbgmeS6jPhtloEULcYMgiKB54S_No",
        "content-type": "application/json",
      };

      const data = {
        async: 1,
        destination_number:
          caseExist?.mobileNo ??
          (caseExist?.alternateMobileNo || alternateMobileNo) ??
          MobileNo,
        get_call_id: 1,
        agent_number: env.smartFlo.callingDefAgentNumber,
        caller_id: env.smartFlo.callingDefCallerId,
      };
      const result = await axiosRequest({
        headers,
        data: JSON.stringify(data),
        url: env.smartFlo.callingBaseUrl + "/v1/click_to_call",
        method: "post",
      });

      if (!result?.response?.data || !result?.response?.data?.success) {
        res.status(400).send({
          status: false,
          message: `Calling Failed${": " + (result?.errorData?.message ?? "")}`,
        });
      }
      const callRequest = await ClickToCall.create({
        callId: result?.response?.data?.call_id,
        casesId: casesId,
        caller_id_number: env.smartFlo.callingDefCallerId,
      });

      res.status(200).json({
        status: true,
        message: "Click to call initiated successfully",
        data: {
          callRequestId: callRequest._id,
          callId: result?.response?.data?.call_id,
          casesId: casesId,
          caller_id_number: env.smartFlo.callingDefCallerId,
        },
      });
    } catch (error) {
      console.error("Error importing Excel data:", error);

      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  public static async hangUPCallRequest(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let { callId } = req.body.validatedData;
      const headers = {
        accept: "application/json",
        Authorization:
          env.smartFlo.callingAuthToken ??
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Mzc2NzQiLCJpc3MiOiJodHRwczovL2Nsb3VkcGhvbmUudGF0YXRlbGVzZXJ2aWNlcy5jb20vdG9rZW4vZ2VuZXJhdGUiLCJpYXQiOjE3MzE0OTc3MjAsImV4cCI6MjAzMTQ5NzcyMCwibmJmIjoxNzMxNDk3NzIwLCJqdGkiOiJTUGJ2Q3M1aTdHczdHQW5MIn0.vLXFZdtKVrMrKGxbgmeS6jPhtloEULcYMgiKB54S_No",
        "content-type": "application/json",
      };
      const result = await axiosRequest({
        headers,
        data: JSON.stringify({ call_id: callId }),
        url: env.smartFlo.callingBaseUrl + "/v1/call/hangup",
        method: "post",
      });
      res.status(200).json({
        status: true,
        data: result?.response?.data,
        message: "Call response fetched successfully",
      });
    } catch (error) {
      console.error("Error creating disposition:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // webhook for call status and recording
  public static async clickToCallWebhook(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { call_id } = req.body.validatedData;
      const requestData = await ClickToCall.findOne({ callId: call_id });
      if (!requestData) {
        res.status(400).send({
          status: false,
          message: "Call request not found",
        });
      }
      if (requestData) {
        requestData.uuid = req?.body?.uuid;
        requestData.call_to_number = req?.body?.call_to_number;
        requestData.caller_id_number = req?.body?.caller_id_number;
        requestData.answer_agent_number = req?.body?.answer_agent_number;
        requestData.billing_circle = req?.body?.billing_circle;
        requestData.call_status = req?.body?.call_status;
        requestData.direction = req?.body?.direction;
        requestData.customer_no_with_prefix =
          req?.body?.customer_no_with_prefix;
        requestData.async = req?.body?.async;
        requestData.get_call_id = req?.body?.get_call_id;
        requestData.deletedAt = null;

        await requestData.save();
      }

      res.status(200).json({
        status: true,
        message: "Call webhook processed successfully",
      });
    } catch (error) {
      console.error("Error processing call webhook:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // webhook for call status and recording
  public static async hangUPCallWebhook(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { call_id } = req.body;
      const requestData = await ClickToCall.findOne({ callId: call_id }).lean();
      if (!requestData) {
        res.status(400).send({
          status: false,
          message: "Call request not found",
        });
      }
      const callResponse = await CallResponse.create({
        callRequestId: requestData?._id,
        casesId: requestData?.casesId,
        uuid: req?.body?.uuid,
        callToNumber: req?.body?.call_to_number,
        callerIdNumber: req?.body?.caller_id_number,
        startStamp: req?.body?.start_stamp,
        answerStamp: req?.body?.answer_stamp,
        endStamp: req?.body?.end_stamp,
        hangupCause: req?.body?.hangup_cause,
        billsec: req?.body?.billsec,
        digitsDialed: req?.body?.digits_dialed,
        direction: req?.body?.direction,
        duration: req?.body?.duration,
        answeredAgent: req?.body?.answered_agent,
        answeredAgentName: req?.body?.answered_agent_name,
        answeredAgentNumber: req?.body?.answered_agent_number,
        missedAgent: req?.body?.missed_agent,
        callFlow: req?.body?.call_flow,
        broadcastLeadFields: req?.body?.broadcast_lead_fields,
        recordingUrl: req?.body?.recording_url,
        callStatus: req?.body?.call_status,
        callId: req?.body?.call_id,
        outboundSec: req?.body?.outbound_sec,
        agentRingTime: req?.body?.agent_ring_time,
        agentTransferRingTime: req?.body?.agent_transfer_ring_time,
        billingCircle: req?.body?.billing_circle,
        callConnected: req?.body?.call_connected,
        awsCallRecordingIdentifier: req?.body?.aws_call_recording_identifier,
        customerNoWithPrefix: req?.body?.customer_no_with_prefix,
        campaignName: req?.body?.campaign_name,
        campaignId: req?.body?.campaign_id,
        customerRingTime: req?.body?.customer_ring_time,
        reasonKey: req?.body?.reason_key,
        async: req?.body?.async,
        getCallId: req?.body?.get_call_id,
      });

      res.status(200).json({
        status: true,
        data: callResponse,
        message: "Call webhook processed successfully",
      });
    } catch (error) {
      console.error("Error processing call webhook:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // not used yet

  public static async callStatus(req: Request, res: Response): Promise<void> {
    try {
      const { callId } = req.body.validatedData;
      const headers = {
        accept: "application/json",
        Authorization:
          env.smartFlo.callingAuthToken ??
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Mzc2NzQiLCJpc3MiOiJodHRwczovL2Nsb3VkcGhvbmUudGF0YXRlbGVzZXJ2aWNlcy5jb20vdG9rZW4vZ2VuZXJhdGUiLCJpYXQiOjE3MzE0OTc3MjAsImV4cCI6MjAzMTQ5NzcyMCwibmJmIjoxNzMxNDk3NzIwLCJqdGkiOiJTUGJ2Q3M1aTdHczdHQW5MIn0.vLXFZdtKVrMrKGxbgmeS6jPhtloEULcYMgiKB54S_No",
        "content-type": "application/json",
      };
      const result = await axiosRequest({
        headers,
        data: JSON.stringify({ call_id: callId }),
        url: env.smartFlo.callingBaseUrl + "/v1/call/status",
        method: "post",
      });
      res.status(200).json({
        status: true,
        data: result?.response?.data,
        message: "Call status fetched successfully",
      });
    } catch (error) {
      console.error("Error creating disposition:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  public static async callRecording(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { callId } = req.body.validatedData;
      const headers = {
        accept: "application/json",
        Authorization:
          env.smartFlo.callingAuthToken ??
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Mzc2NzQiLCJpc3MiOiJodHRwczovL2Nsb3VkcGhvbmUudGF0YXRlbGVzZXJ2aWNlcy5jb20vdG9rZW4vZ2VuZXJhdGUiLCJpYXQiOjE3MzE0OTc3MjAsImV4cCI6MjAzMTQ5NzcyMCwibmJmIjoxNzMxNDk3NzIwLCJqdGkiOiJTUGJ2Q3M1aTdHczdHQW5MIn0.vLXFZdtKVrMrKGxbgmeS6jPhtloEULcYMgiKB54S_No",
        "content-type": "application/json",
      };
      const result = await axiosRequest({
        headers,
        data: JSON.stringify({ call_id: callId }),
        url: env.smartFlo.callingBaseUrl + "/v1/call/recording",
        method: "post",
      });
      res.status(200).json({
        status: true,
        data: result?.response?.data,
        message: "Call recording fetched successfully",
      });
    } catch (error) {
      console.error("Error creating disposition:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }
}
