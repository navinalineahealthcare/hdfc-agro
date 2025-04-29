import { faqType } from "../types/faq.type";

export const faqResponse = (data: faqType | faqType[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (faq: faqType) => {
  return {
    id: faq._id,
    question: faq.question,
    answer: faq.answer,
    status: faq.status,
    type: faq.type,
    createdAt: faq.createdAt,
    deletedAt: faq.deletedAt,
  };
};
