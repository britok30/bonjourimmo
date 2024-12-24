import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export const FAQ = () => {
  const t = useTranslations("faq");

  const faqItems = [
    { question: t("questions.q1"), answer: t("answers.a1") },
    { question: t("questions.q2"), answer: t("answers.a2") },
    { question: t("questions.q3"), answer: t("answers.a3") },
    { question: t("questions.q4"), answer: t("answers.a4") },
    { question: t("questions.q5"), answer: t("answers.a5") },
    { question: t("questions.q6"), answer: t("answers.a6") },
    { question: t("questions.q7"), answer: t("answers.a7") },
    { question: t("questions.q8"), answer: t("answers.a8") },
    { question: t("questions.q9"), answer: t("answers.a9") },
    { question: t("questions.q10"), answer: t("answers.a10") },
  ];

  return (
    <section className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl mb-4">{t("title")}</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
