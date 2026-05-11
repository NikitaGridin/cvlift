import {
  trainerTopics,
  type TrainerSpecialty,
} from "@/lib/technical-interview-question-bank";

export const TRAINER_FREE_TOPIC_COUNT = 4;
export const TRAINER_PAID_TEST_CREDIT_COST = 2;
export const TRAINER_ALL_QUESTIONS_CREDIT_COST = 10;

export function getTrainerTopicCreditCost(
  specialty: TrainerSpecialty,
  topicId: string,
) {
  const topicIndex = trainerTopics[specialty].findIndex(
    (topic) => topic.id === topicId,
  );

  return topicIndex >= 0 && topicIndex < TRAINER_FREE_TOPIC_COUNT
    ? 0
    : TRAINER_PAID_TEST_CREDIT_COST;
}

export function getTrainerAllQuestionsCreditCost() {
  return TRAINER_ALL_QUESTIONS_CREDIT_COST;
}

export function formatTrainerCreditCost(cost: number) {
  return cost === 0 ? "Бесплатно" : `${cost} ${getPointWord(cost)}`;
}

export function formatTrainerPointAmount(value: number) {
  return `${value} ${getPointWord(value)}`;
}

function getPointWord(value: number) {
  const absValue = Math.abs(value);
  const lastTwoDigits = absValue % 100;
  const lastDigit = absValue % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "поинтов";
  }

  if (lastDigit === 1) {
    return "поинт";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "поинта";
  }

  return "поинтов";
}
