import {
  getResumeAgentConversationCreditCost,
  spendResumeAgentConversationCredit,
} from "@/lib/credits";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export class ResumeAgentCreditsUnavailableError extends Error {
  status = 503;

  constructor() {
    super("Credits are temporarily unavailable. Please try again later.");
    this.name = "ResumeAgentCreditsUnavailableError";
  }
}

export async function chargeResumeAgentConversationStart(
  userId: string,
  conversationId: string,
) {
  const conversationCreditCost = getResumeAgentConversationCreditCost();

  if (conversationCreditCost === 0) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    throw new ResumeAgentCreditsUnavailableError();
  }

  return prisma.$transaction((tx) =>
    spendResumeAgentConversationCredit(
      tx,
      userId,
      conversationId,
      conversationCreditCost,
    ),
  );
}
