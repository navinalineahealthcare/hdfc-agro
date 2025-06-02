import moment from "moment";

export const salesCaseListResponse = (data: any[] | any) => {
  if (Array.isArray(data)) {
    return data.map((d) => formatSalesCase(d));
  }

  return formatSalesCase(data);
};

const formatSalesCase = (item: any) => {
  const openCase = item.openCaseId || {};

  return {
    _id: item._id,
    requestDate: formatDate(item.requestDate),
    requestID: item.requestId?.toString() || "",
    proposalNo: item.proposalNo || "",
    uniqueId: openCase.uniqueIdNum || "",
    proposalName: item.proposerName || "",
    insured: item.insuredName || "",
    insurerDivisionName: openCase.tpaName || "",
    medicalTests: openCase.testCategory || "",
    currentstatus: item.status || "",
    apptDateTime: formatDate(openCase.createdAt),
    action: "", // Add any dynamic logic if needed
  };
};

const formatDate = (date?: string | Date): string => {
  return date ? moment(date).format("DD/MM/YYYY HH:mm:ss") : "";
};
