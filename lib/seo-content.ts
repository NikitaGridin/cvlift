import { locales, type Locale, type LocalizedValue } from "@/lib/i18n";

export type SeoFaq = {
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
};

export type SeoPage = {
  slug: string;
  localizedSlugs: LocalizedValue<string>;
  title: LocalizedValue<string>;
  eyebrow: LocalizedValue<string>;
  description: LocalizedValue<string>;
  metaTitle: LocalizedValue<string>;
  metaDescription: LocalizedValue<string>;
  cta: LocalizedValue<string>;
  bullets: Array<LocalizedValue<string>>;
  sections: Array<{
    title: LocalizedValue<string>;
    text: LocalizedValue<string>;
    bullets: Array<LocalizedValue<string>>;
  }>;
  faqs: SeoFaq[];
};

const l = <T,>(en: T, ru: T): LocalizedValue<T> => ({ en, ru });

export const seoPages: SeoPage[] = [
  {
    slug: "ats-resume-checker",
    localizedSlugs: l("ats-resume-checker", "proverka-rezyume-ats"),
    title: l("ATS Resume Checker", "ATS-проверка резюме"),
    eyebrow: l("Resume scanner", "Сканер резюме"),
    description: l(
      "Check whether your resume is structured for applicant tracking systems and easy for recruiters to scan.",
      "Проверьте, понятно ли резюме для ATS-систем и удобно ли рекрутеру быстро его просмотреть.",
    ),
    metaTitle: l(
      "ATS Resume Checker | CVlift",
      "ATS-проверка резюме онлайн | CVlift",
    ),
    metaDescription: l(
      "Use CVlift to check ATS readiness, resume structure, keyword coverage, and recruiter readability before applying.",
      "Проверьте резюме на ATS-совместимость, структуру, ключевые слова и читаемость для рекрутера перед откликом.",
    ),
    cta: l("Check ATS readiness", "Проверить ATS-готовность"),
    bullets: [
      l(
        "Find formatting issues that make resumes harder to parse.",
        "Найдите проблемы форматирования, из-за которых резюме сложнее распарсить.",
      ),
      l(
        "Review sections, skills, keywords, and achievement clarity.",
        "Проверьте разделы, навыки, ключевые слова и ясность достижений.",
      ),
      l(
        "Get fixes that improve both ATS quality and human readability.",
        "Получите правки, которые улучшают и ATS-качество, и читаемость для человека.",
      ),
    ],
    sections: [
      {
        title: l(
          "What an ATS resume checker should look for",
          "Что должна проверять ATS-проверка",
        ),
        text: l(
          "A strong resume needs more than keywords. It should be structured clearly, use standard section names, avoid confusing layouts, and make the candidate's impact easy to understand.",
          "Сильному резюме нужны не только ключевые слова. Важны понятная структура, стандартные названия разделов, аккуратная верстка и ясное описание вашего вклада.",
        ),
        bullets: [
          l(
            "Clear experience, skills, education, and project sections.",
            "Понятные разделы опыта, навыков, образования и проектов.",
          ),
          l(
            "Role-specific keywords used naturally in context.",
            "Ключевые слова роли, использованные естественно и в контексте.",
          ),
          l(
            "Bullet points that explain scope, tools, and outcomes.",
            "Буллеты, которые раскрывают масштаб, инструменты и результат.",
          ),
        ],
      },
      {
        title: l("How CVlift helps", "Как помогает CVlift"),
        text: l(
          "CVlift reviews the resume for ATS compatibility and translates weak spots into practical edits you can apply immediately.",
          "CVlift проверяет ATS-совместимость резюме и превращает слабые места в практичные правки, которые можно применить сразу.",
        ),
        bullets: [
          l("Score the resume from 0 to 100.", "Оценить резюме по шкале от 0 до 100."),
          l(
            "Highlight weak sections and missing signals.",
            "Подсветить слабые разделы и недостающие сигналы.",
          ),
          l(
            "Generate an improved resume draft with stronger phrasing.",
            "Сгенерировать улучшенный черновик с более сильными формулировками.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l("What is an ATS resume checker?", "Что такое ATS-проверка резюме?"),
        answer: l(
          "An ATS resume checker reviews whether your resume can be parsed and ranked by applicant tracking systems while staying readable for recruiters.",
          "ATS-проверка показывает, сможет ли система распознать и ранжировать резюме, а рекрутер быстро понять его смысл.",
        ),
      },
      {
        question: l(
          "Does ATS optimization mean keyword stuffing?",
          "ATS-оптимизация означает набивку ключевыми словами?",
        ),
        answer: l(
          "No. Strong ATS optimization uses relevant keywords naturally inside clear experience, skills, and achievement sections.",
          "Нет. Хорошая ATS-оптимизация использует релевантные ключевые слова естественно: в опыте, навыках и достижениях.",
        ),
      },
      {
        question: l(
          "Can CVlift check a resume without a vacancy?",
          "Можно проверить резюме без вакансии?",
        ),
        answer: l(
          "Yes. You can run a general resume audit or compare your resume against a specific vacancy.",
          "Да. Можно запустить общий аудит резюме или сравнить его с конкретной вакансией.",
        ),
      },
    ],
  },
  {
    slug: "resume-score",
    localizedSlugs: l("resume-score", "ocenka-rezyume"),
    title: l("Resume Score Checker", "Оценка резюме"),
    eyebrow: l("Score your CV", "Оцените CV"),
    description: l(
      "Get a simple 0-100 resume score with clear reasons, weak points, and the next best fixes.",
      "Получите оценку резюме от 0 до 100, понятные причины, слабые места и следующие лучшие правки.",
    ),
    metaTitle: l("Resume Score Checker | CVlift", "Оценка резюме онлайн | CVlift"),
    metaDescription: l(
      "Score your resume with CVlift and get specific fixes for ATS quality, structure, achievements, readability, and job fit.",
      "Получите оценку резюме, ATS score, слабые места и конкретные правки для структуры, достижений и совпадения с вакансией.",
    ),
    cta: l("Score my resume", "Оценить резюме"),
    bullets: [
      l(
        "Understand why your resume feels weak or unclear.",
        "Поймите, почему резюме выглядит слабым или неясным.",
      ),
      l(
        "See ATS, structure, readability, and positioning signals.",
        "Увидьте сигналы ATS, структуры, читаемости и позиционирования.",
      ),
      l(
        "Turn the score into ranked fixes, not generic advice.",
        "Превратите оценку в приоритетные правки, а не в общие советы.",
      ),
    ],
    sections: [
      {
        title: l(
          "A resume score should explain the why",
          "Оценка резюме должна объяснять причину",
        ),
        text: l(
          "A number is only useful if it shows what to fix. CVlift pairs the score with weak points, strengths, and recommended changes.",
          "Число полезно только тогда, когда понятно, что исправлять. CVlift связывает оценку со слабыми местами, сильными сторонами и рекомендуемыми изменениями.",
        ),
        bullets: [
          l(
            "Total resume score for quick readiness.",
            "Итоговая оценка резюме для быстрой проверки готовности.",
          ),
          l(
            "ATS and match scores for practical application decisions.",
            "ATS и match-оценки для практичных решений перед откликом.",
          ),
          l(
            "Specific recommendations tied to resume sections.",
            "Конкретные рекомендации, привязанные к разделам резюме.",
          ),
        ],
      },
      {
        title: l("Use the score before applying", "Используйте оценку до отклика"),
        text: l(
          "Running a resume score before sending applications helps you avoid wasting strong opportunities on a draft that is not ready.",
          "Проверка резюме до отклика помогает не тратить сильные возможности на черновик, который ещё не готов.",
        ),
        bullets: [
          l(
            "Improve low-impact bullet points.",
            "Улучшить буллеты с низким влиянием.",
          ),
          l("Add missing role signals.", "Добавить недостающие сигналы роли."),
          l(
            "Make the resume easier to scan in under a minute.",
            "Сделать резюме понятным за минутный просмотр.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l("What is a good resume score?", "Какая оценка резюме считается хорошей?"),
        answer: l(
          "A strong resume score is usually 80 or higher, but the best score depends on the role, competition, and how clearly your experience matches the vacancy.",
          "Сильная оценка обычно начинается от 80, но хороший результат зависит от роли, конкуренции и точности совпадения опыта с вакансией.",
        ),
      },
      {
        question: l("Should I improve every weak point?", "Нужно исправлять каждое слабое место?"),
        answer: l(
          "Start with high-impact fixes first: unclear achievements, missing keywords, weak structure, and gaps against the target role.",
          "Начинайте с правок с высоким влиянием: неясных достижений, пропущенных ключевых слов, слабой структуры и пробелов относительно целевой роли.",
        ),
      },
      {
        question: l(
          "Can I score a resume without a job description?",
          "Можно оценить резюме без описания вакансии?",
        ),
        answer: l(
          "Yes. CVlift can run a general audit focused on market readiness, clarity, ATS quality, and positioning.",
          "Да. CVlift может провести общий аудит готовности к рынку, ясности, ATS-качества и позиционирования.",
        ),
      },
    ],
  },
  {
    slug: "resume-keywords",
    localizedSlugs: l("resume-keywords", "klyuchevye-slova-rezyume"),
    title: l(
      "Resume Keywords for Job Applications",
      "Ключевые слова резюме для откликов",
    ),
    eyebrow: l("Keyword matching", "Сопоставление ключевых слов"),
    description: l(
      "Find the important role keywords your resume should include naturally before you apply.",
      "Найдите важные ключевые слова роли, которые стоит естественно добавить в резюме до отклика.",
    ),
    metaTitle: l(
      "Resume Keywords for Job Applications | CVlift",
      "Ключевые слова для резюме и ATS | CVlift",
    ),
    metaDescription: l(
      "Learn how to use resume keywords naturally and compare your resume against a vacancy with CVlift.",
      "CVlift находит недостающие ключевые слова из вакансии и помогает добавить их в резюме естественно, без переспама.",
    ),
    cta: l("Check keyword match", "Проверить ключевые слова"),
    bullets: [
      l(
        "Compare your resume against the language of a target role.",
        "Сравните резюме с языком целевой роли.",
      ),
      l(
        "Avoid keyword stuffing that makes the resume sound unnatural.",
        "Избегайте набивки ключевыми словами, из-за которой резюме звучит неестественно.",
      ),
      l(
        "Add missing tools, skills, and responsibilities where they fit your real experience.",
        "Добавьте недостающие инструменты, навыки и обязанности там, где они соответствуют вашему реальному опыту.",
      ),
    ],
    sections: [
      {
        title: l("Keywords should support evidence", "Ключевые слова должны подкрепляться фактами"),
        text: l(
          "Recruiters and ATS systems look for relevant language, but keywords work best when they are attached to real examples of work.",
          "Рекрутеры и ATS ищут релевантные формулировки, но ключевые слова работают лучше всего, когда связаны с реальными примерами работы.",
        ),
        bullets: [
          l(
            "Use role keywords in experience bullets, not only in a skills list.",
            "Используйте ключевые слова роли в опыте, а не только в списке навыков.",
          ),
          l(
            "Connect tools to outcomes and business impact.",
            "Связывайте инструменты с результатами и бизнес-эффектом.",
          ),
          l(
            "Keep the resume readable for a human reviewer.",
            "Сохраняйте резюме читабельным для человека.",
          ),
        ],
      },
      {
        title: l("Match the vacancy before you apply", "Сравните с вакансией до отклика"),
        text: l(
          "CVlift can compare your resume with a pasted vacancy and show where your resume is under-aligned.",
          "CVlift может сравнить резюме с вставленной вакансией и показать, где оно недостаточно совпадает с ролью.",
        ),
        bullets: [
          l(
            "Identify missing skills and role signals.",
            "Найти недостающие навыки и сигналы роли.",
          ),
          l(
            "Improve phrasing without inventing unverifiable facts.",
            "Улучшить формулировки без выдумывания непроверяемых фактов.",
          ),
          l(
            "Generate a stronger draft tailored to the target role.",
            "Сгенерировать более сильный черновик под целевую роль.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l(
          "How many resume keywords should I include?",
          "Сколько ключевых слов нужно добавить в резюме?",
        ),
        answer: l(
          "There is no fixed number. Include the keywords that honestly match your experience and are important for the role.",
          "Фиксированного числа нет. Добавляйте те ключевые слова, которые честно соответствуют вашему опыту и важны для роли.",
        ),
      },
      {
        question: l("Where should resume keywords go?", "Куда добавлять ключевые слова резюме?"),
        answer: l(
          "Use them in skills, summary, and experience bullets. The strongest keywords are backed by real work examples.",
          "Используйте их в навыках, summary и буллетах опыта. Самые сильные ключевые слова подкреплены реальными примерами работы.",
        ),
      },
      {
        question: l("Can CVlift find missing keywords?", "Может ли CVlift найти недостающие ключевые слова?"),
        answer: l(
          "Yes. In vacancy mode, CVlift checks how well your resume matches the target role and recommends changes.",
          "Да. В режиме вакансии CVlift проверяет совпадение с целевой ролью и рекомендует изменения.",
        ),
      },
    ],
  },
  {
    slug: "resume-improvement",
    localizedSlugs: l("resume-improvement", "uluchshit-rezyume"),
    title: l("Resume Improvement Tool", "Инструмент улучшения резюме"),
    eyebrow: l("Rewrite weak resumes", "Усиление слабых резюме"),
    description: l(
      "Improve weak bullet points, structure, achievements, and positioning with a focused AI resume workflow.",
      "Улучшайте слабые буллеты, структуру, достижения и позиционирование в сфокусированном AI-процессе.",
    ),
    metaTitle: l(
      "Resume Improvement Tool | CVlift",
      "Улучшить резюме с AI | CVlift",
    ),
    metaDescription: l(
      "Improve your resume with CVlift. Get weak points, strong points, ranked fixes, and an improved resume draft.",
      "Улучшите резюме с AI: найдите слабые места, усилите достижения, структуру, ключевые слова и получите готовый черновик.",
    ),
    cta: l("Improve my resume", "Улучшить резюме"),
    bullets: [
      l(
        "Rewrite responsibilities into achievement-driven bullets.",
        "Перепишите обязанности в буллеты, построенные вокруг достижений.",
      ),
      l(
        "Improve structure, readability, and role positioning.",
        "Улучшите структуру, читаемость и позиционирование под роль.",
      ),
      l(
        "See what to replace with verified numbers and details.",
        "Увидьте, что заменить проверенными цифрами и деталями.",
      ),
    ],
    sections: [
      {
        title: l("Better resumes are specific", "Сильные резюме конкретны"),
        text: l(
          "Generic resumes often list tasks without explaining scope, tools, outcomes, or business value. CVlift helps convert that into sharper language.",
          "Общие резюме часто перечисляют задачи без масштаба, инструментов, результатов и бизнес-ценности. CVlift помогает превратить это в более точные формулировки.",
        ),
        bullets: [
          l(
            "Replace passive responsibilities with action-led bullets.",
            "Заменить пассивные обязанности на буллеты с активным действием.",
          ),
          l(
            "Add measurable placeholders where verified metrics are needed.",
            "Добавить измеримые плейсхолдеры там, где нужны проверенные метрики.",
          ),
          l(
            "Keep claims realistic and easy to discuss in interviews.",
            "Сохранять утверждения реалистичными и удобными для обсуждения на интервью.",
          ),
        ],
      },
      {
        title: l("Improve the whole application package", "Улучшайте весь пакет отклика"),
        text: l(
          "A resume rewrite is more useful when it connects to a clear application strategy and cover letter.",
          "Переписанное резюме полезнее, когда связано с понятной стратегией отклика и сопроводительным письмом.",
        ),
        bullets: [
          l(
            "Generate an improved resume draft.",
            "Сгенерировать улучшенный черновик резюме.",
          ),
          l(
            "Create a cover letter aligned with the resume.",
            "Создать сопроводительное письмо, согласованное с резюме.",
          ),
          l("Save past checks in history.", "Сохранить прошлые проверки в истории."),
        ],
      },
    ],
    faqs: [
      {
        question: l("Can AI improve my resume?", "Может ли AI улучшить резюме?"),
        answer: l(
          "AI can improve clarity, structure, phrasing, and positioning. You should verify every metric and factual detail before using the final version.",
          "AI может улучшить ясность, структуру, формулировки и позиционирование. Перед использованием финальной версии нужно проверить каждую метрику и факт.",
        ),
      },
      {
        question: l("Why are some values shown in brackets?", "Почему некоторые значения в скобках?"),
        answer: l(
          "Bracketed values are editable placeholders. Replace them with verified numbers from your real work before applying.",
          "Значения в скобках — редактируемые плейсхолдеры. Перед откликом замените их проверенными цифрами из реальной работы.",
        ),
      },
      {
        question: l("Does CVlift rewrite the whole resume?", "CVlift переписывает всё резюме?"),
        answer: l(
          "Yes. CVlift can generate an improved resume draft, not just small grammar edits.",
          "Да. CVlift может сгенерировать улучшенный черновик резюме, а не только мелкие грамматические правки.",
        ),
      },
    ],
  },
  {
    slug: "cover-letter-generator",
    localizedSlugs: l("cover-letter-generator", "soprovoditelnoe-pismo"),
    title: l("Cover Letter Generator", "Генератор сопроводительных писем"),
    eyebrow: l("Application writing", "Текст для отклика"),
    description: l(
      "Generate a focused cover letter that matches your resume and the role you are applying for.",
      "Сгенерируйте сфокусированное сопроводительное письмо, связанное с резюме и целевой ролью.",
    ),
    metaTitle: l(
      "Cover Letter Generator | CVlift",
      "Генератор сопроводительного письма | CVlift",
    ),
    metaDescription: l(
      "Use CVlift to generate a polished cover letter from your resume and target vacancy.",
      "Сгенерируйте сопроводительное письмо по резюме и вакансии: короткое, конкретное и согласованное с вашим опытом.",
    ),
    cta: l("Generate cover letter", "Сгенерировать письмо"),
    bullets: [
      l(
        "Create a letter based on your resume and target role.",
        "Создать письмо на основе резюме и целевой роли.",
      ),
      l(
        "Keep the message concise, confident, and recruiter-friendly.",
        "Сохранить текст коротким, уверенным и удобным для рекрутера.",
      ),
      l(
        "Align the cover letter with your strongest resume points.",
        "Связать сопроводительное письмо с сильнейшими пунктами резюме.",
      ),
    ],
    sections: [
      {
        title: l(
          "A cover letter should support the resume",
          "Сопроводительное письмо должно поддерживать резюме",
        ),
        text: l(
          "The best cover letters do not repeat every resume bullet. They explain why your experience matters for the specific role.",
          "Лучшие сопроводительные письма не повторяют каждый буллет резюме. Они объясняют, почему ваш опыт важен для конкретной роли.",
        ),
        bullets: [
          l("Open with clear role fit.", "Начать с понятного соответствия роли."),
          l(
            "Connect achievements to business needs.",
            "Связать достижения с бизнес-потребностями.",
          ),
          l(
            "Keep the letter specific and easy to scan.",
            "Сделать письмо конкретным и удобным для быстрого просмотра.",
          ),
        ],
      },
      {
        title: l(
          "Use the resume and vacancy together",
          "Используйте резюме и вакансию вместе",
        ),
        text: l(
          "CVlift uses the resume and vacancy context to generate a letter that matches the application instead of sounding generic.",
          "CVlift использует контекст резюме и вакансии, чтобы письмо соответствовало отклику, а не звучало шаблонно.",
        ),
        bullets: [
          l(
            "Reflect the target role language.",
            "Отразить язык целевой роли.",
          ),
          l(
            "Stay consistent with the improved resume.",
            "Сохранить согласованность с улучшенным резюме.",
          ),
          l(
            "Avoid unsupported claims and vague enthusiasm.",
            "Избежать неподтвержденных заявлений и расплывчатого энтузиазма.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l(
          "Should every application include a cover letter?",
          "Нужно ли сопроводительное письмо для каждого отклика?",
        ),
        answer: l(
          "Not every role requires one, but a focused cover letter can help when you need to explain fit, motivation, or a career transition.",
          "Не каждая роль требует письмо, но сфокусированный текст помогает объяснить соответствие, мотивацию или карьерный переход.",
        ),
      },
      {
        question: l(
          "Can CVlift generate a cover letter from a resume?",
          "Может ли CVlift создать письмо по резюме?",
        ),
        answer: l(
          "Yes. CVlift generates a cover letter as part of the resume analysis result.",
          "Да. CVlift генерирует сопроводительное письмо как часть результата анализа резюме.",
        ),
      },
      {
        question: l("How long should a cover letter be?", "Какой длины должно быть сопроводительное письмо?"),
        answer: l(
          "A strong cover letter is usually short: a clear opening, two focused body paragraphs, and a concise close.",
          "Сильное сопроводительное письмо обычно короткое: ясное начало, два сфокусированных абзаца и лаконичное завершение.",
        ),
      },
    ],
  },
  {
    slug: "resume-job-match",
    localizedSlugs: l("resume-job-match", "rezume-pod-vakansiyu"),
    title: l("Resume Job Match Checker", "Проверка резюме под вакансию"),
    eyebrow: l("Vacancy matching", "Сравнение с вакансией"),
    description: l(
      "Compare your resume with a job description and see what to change before applying.",
      "Сравните резюме с описанием вакансии и поймите, что исправить до отклика.",
    ),
    metaTitle: l(
      "Resume Job Match Checker | CVlift",
      "Проверка резюме под вакансию | CVlift",
    ),
    metaDescription: l(
      "Paste a job description and compare your resume against role requirements, keywords, seniority signals, and recruiter expectations.",
      "Вставьте текст вакансии и проверьте совпадение резюме с требованиями, ключевыми словами, уровнем роли и ожиданиями рекрутера.",
    ),
    cta: l("Check job match", "Проверить совпадение"),
    bullets: [
      l(
        "Find gaps between your resume and the job description.",
        "Найдите расхождения между резюме и описанием вакансии.",
      ),
      l(
        "Prioritize missing skills, tools, and seniority signals.",
        "Приоритизируйте недостающие навыки, инструменты и сигналы уровня.",
      ),
      l(
        "Rewrite the resume around the role without inventing facts.",
        "Адаптируйте резюме под роль без выдумывания фактов.",
      ),
    ],
    sections: [
      {
        title: l("Generic resumes lose relevance", "Общие резюме теряют релевантность"),
        text: l(
          "A strong candidate can still look weak when the resume language does not match the vacancy. CVlift highlights the exact parts that need alignment.",
          "Даже сильный кандидат может выглядеть слабее, если язык резюме не совпадает с вакансией. CVlift показывает конкретные места для адаптации.",
        ),
        bullets: [
          l(
            "Compare responsibilities, skills, tools, and outcomes.",
            "Сравнить обязанности, навыки, инструменты и результаты.",
          ),
          l(
            "See missing role evidence before sending an application.",
            "Увидеть недостающие доказательства соответствия до отклика.",
          ),
          l(
            "Turn vacancy requirements into resume edits.",
            "Превратить требования вакансии в правки резюме.",
          ),
        ],
      },
      {
        title: l("Use the vacancy as a scoring context", "Используйте вакансию как контекст оценки"),
        text: l(
          "CVlift checks not only grammar or formatting, but how well the resume fits the exact role you want.",
          "CVlift проверяет не только грамматику или формат, а то, насколько резюме подходит конкретной роли.",
        ),
        bullets: [
          l("Get a vacancy match score.", "Получить оценку совпадения с вакансией."),
          l(
            "Improve keywords where they naturally belong.",
            "Усилить ключевые слова там, где они звучат естественно.",
          ),
          l(
            "Create a stronger version for the selected position.",
            "Создать более сильную версию под выбранную должность.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l(
          "Can I paste a job description into CVlift?",
          "Можно вставить описание вакансии в CVlift?",
        ),
        answer: l(
          "Yes. Paste the vacancy text to get a targeted match score and role-specific recommendations.",
          "Да. Вставьте текст вакансии, чтобы получить оценку совпадения и рекомендации под конкретную роль.",
        ),
      },
      {
        question: l(
          "What does vacancy match measure?",
          "Что измеряет совпадение с вакансией?",
        ),
        answer: l(
          "It checks relevant skills, tools, experience signals, achievements, keywords, and whether the resume is positioned for the target role.",
          "Оно проверяет релевантные навыки, инструменты, сигналы опыта, достижения, ключевые слова и позиционирование под роль.",
        ),
      },
      {
        question: l(
          "Should I customize my resume for every job?",
          "Нужно адаптировать резюме под каждую вакансию?",
        ),
        answer: l(
          "For important roles, yes. A tailored resume usually communicates relevance faster than a generic version.",
          "Для важных вакансий — да. Адаптированное резюме обычно быстрее показывает релевантность, чем общая версия.",
        ),
      },
    ],
  },
  {
    slug: "ai-resume-builder",
    localizedSlugs: l("ai-resume-builder", "ai-konstruktor-rezyume"),
    title: l("AI Resume Builder", "AI-конструктор резюме"),
    eyebrow: l("AI resume writing", "AI для резюме"),
    description: l(
      "Build a sharper resume draft from your existing experience, target role, and verified achievements.",
      "Соберите более сильный черновик резюме из вашего опыта, целевой роли и подтвержденных достижений.",
    ),
    metaTitle: l("AI Resume Builder | CVlift", "AI-конструктор резюме | CVlift"),
    metaDescription: l(
      "Use CVlift as an AI resume builder to improve structure, rewrite weak bullet points, add relevant keywords, and prepare a stronger application.",
      "Используйте CVlift как AI-конструктор резюме: улучшайте структуру, буллеты, ключевые слова и готовьте сильный отклик.",
    ),
    cta: l("Build my resume", "Собрать резюме"),
    bullets: [
      l(
        "Transform raw experience into clear resume sections.",
        "Превратите сырой опыт в понятные разделы резюме.",
      ),
      l(
        "Generate stronger achievement bullets with editable metrics.",
        "Создавайте сильные буллеты достижений с редактируемыми метриками.",
      ),
      l(
        "Keep the final resume aligned with the job you want.",
        "Сохраняйте финальное резюме согласованным с нужной вакансией.",
      ),
    ],
    sections: [
      {
        title: l("AI should strengthen the truth", "AI должен усиливать реальные факты"),
        text: l(
          "CVlift helps you phrase real work more clearly instead of creating unsupported claims that are hard to defend in interviews.",
          "CVlift помогает яснее описать реальный опыт, а не создавать неподтвержденные утверждения, которые сложно защитить на интервью.",
        ),
        bullets: [
          l("Rewrite vague responsibilities.", "Переписать расплывчатые обязанности."),
          l("Add achievement framing.", "Добавить фокус на достижениях."),
          l(
            "Keep placeholders visible until you verify the numbers.",
            "Оставлять плейсхолдеры видимыми, пока вы не проверите цифры.",
          ),
        ],
      },
      {
        title: l("Built for applications, not templates", "Не шаблон, а подготовка к отклику"),
        text: l(
          "A resume builder is useful only when it understands ATS, recruiters, and the role context. CVlift combines all three.",
          "Конструктор резюме полезен только тогда, когда учитывает ATS, рекрутеров и контекст роли. CVlift объединяет все три слоя.",
        ),
        bullets: [
          l(
            "Score the resume before and after edits.",
            "Оценить резюме до и после правок.",
          ),
          l(
            "Use keywords from the target role.",
            "Использовать ключевые слова целевой роли.",
          ),
          l(
            "Generate a cover letter from the same context.",
            "Создать сопроводительное письмо из того же контекста.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l(
          "Is CVlift a resume builder or a resume checker?",
          "CVlift — это конструктор или проверка резюме?",
        ),
        answer: l(
          "Both. CVlift checks your current resume and can generate a stronger draft based on the analysis.",
          "И то, и другое. CVlift проверяет текущее резюме и может создать более сильный черновик на основе анализа.",
        ),
      },
      {
        question: l(
          "Can AI write a resume from scratch?",
          "Может ли AI написать резюме с нуля?",
        ),
        answer: l(
          "AI can structure and draft a resume, but the best result needs your real experience, verified metrics, and target role context.",
          "AI может структурировать и подготовить черновик, но лучший результат требует вашего реального опыта, проверенных метрик и контекста роли.",
        ),
      },
      {
        question: l(
          "Will the resume sound generic?",
          "Резюме будет звучать шаблонно?",
        ),
        answer: l(
          "CVlift focuses on concrete role signals and achievements, so the output is more specific than a generic template.",
          "CVlift фокусируется на конкретных сигналах роли и достижениях, поэтому результат специфичнее обычного шаблона.",
        ),
      },
    ],
  },
  {
    slug: "resume-optimizer",
    localizedSlugs: l("resume-optimizer", "optimizaciya-rezyume"),
    title: l("Resume Optimizer", "Оптимизация резюме"),
    eyebrow: l("Search-ready resume", "Резюме для выдачи"),
    description: l(
      "Optimize your resume for ATS filters, keyword search, recruiter scanning, and target job requirements.",
      "Оптимизируйте резюме для ATS-фильтров, поиска по ключевым словам, рекрутера и требований вакансии.",
    ),
    metaTitle: l("Resume Optimizer | CVlift", "Оптимизация резюме для ATS | CVlift"),
    metaDescription: l(
      "Optimize your resume with CVlift for ATS score, keyword match, readability, achievements, and vacancy relevance.",
      "Оптимизируйте резюме с CVlift: ATS score, совпадение ключевых слов, читаемость, достижения и релевантность вакансии.",
    ),
    cta: l("Optimize my resume", "Оптимизировать резюме"),
    bullets: [
      l(
        "Improve ATS parsing, section names, and formatting signals.",
        "Улучшите ATS-чтение, названия разделов и сигналы форматирования.",
      ),
      l(
        "Raise keyword coverage without making the resume unnatural.",
        "Повышайте покрытие ключевых слов без неестественного текста.",
      ),
      l(
        "Prioritize fixes that can move the resume closer to an interview.",
        "Приоритизируйте правки, которые приближают резюме к интервью.",
      ),
    ],
    sections: [
      {
        title: l(
          "Optimization is more than grammar",
          "Оптимизация — это больше, чем грамматика",
        ),
        text: l(
          "A polished resume can still underperform if it misses target keywords, hides impact, or uses a structure that ATS tools parse poorly.",
          "Даже аккуратное резюме может работать плохо, если в нем нет ключевых слов, спрятан результат или структура плохо читается ATS.",
        ),
        bullets: [
          l(
            "Check keyword coverage against the target role.",
            "Проверить покрытие ключевых слов под целевую роль.",
          ),
          l(
            "Make achievements easier to scan.",
            "Сделать достижения проще для быстрого просмотра.",
          ),
          l(
            "Remove weak or distracting phrasing.",
            "Убрать слабые или отвлекающие формулировки.",
          ),
        ],
      },
      {
        title: l(
          "Optimize before high-value applications",
          "Оптимизируйте перед важными откликами",
        ),
        text: l(
          "CVlift helps you avoid sending a resume that has obvious gaps for the exact job you want.",
          "CVlift помогает не отправлять резюме с очевидными пробелами для вакансии, которая вам действительно важна.",
        ),
        bullets: [
          l("Review ATS and recruiter signals.", "Проверить ATS и рекрутерские сигналы."),
          l("Get ranked changes first.", "Получить приоритетные изменения."),
          l(
            "Generate an improved version in one flow.",
            "Сгенерировать улучшенную версию в одном процессе.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: l(
          "What is resume optimization?",
          "Что такое оптимизация резюме?",
        ),
        answer: l(
          "Resume optimization means improving structure, keywords, achievements, readability, and role fit so the resume performs better in screening.",
          "Оптимизация резюме — это улучшение структуры, ключевых слов, достижений, читаемости и совпадения с ролью для лучшего прохождения отбора.",
        ),
      },
      {
        question: l(
          "Does resume optimization guarantee interviews?",
          "Оптимизация резюме гарантирует интервью?",
        ),
        answer: l(
          "No tool can guarantee interviews, but optimization can remove common blockers before a recruiter or ATS reviews the resume.",
          "Нет, ни один инструмент не гарантирует интервью, но оптимизация помогает убрать частые блокеры до проверки рекрутером или ATS.",
        ),
      },
      {
        question: l(
          "Is this different from a resume template?",
          "Это отличается от шаблона резюме?",
        ),
        answer: l(
          "Yes. A template changes layout. CVlift focuses on content quality, ATS fit, keywords, and the logic of your application.",
          "Да. Шаблон меняет внешний вид. CVlift работает с качеством содержания, ATS, ключевыми словами и логикой отклика.",
        ),
      },
    ],
  },
];

export const faqItems: SeoFaq[] = [
  {
    question: l("What is CVlift?", "Что такое CVlift?"),
    answer: l(
      "CVlift is an AI resume analysis tool that scores your resume, finds weak points, recommends fixes, and generates an improved resume draft.",
      "CVlift — AI-инструмент для анализа резюме: он ставит оценку, находит слабые места, рекомендует правки и генерирует улучшенный черновик.",
    ),
  },
  {
    question: l(
      "Can I analyze a resume without a vacancy?",
      "Можно анализировать резюме без вакансии?",
    ),
    answer: l(
      "Yes. CVlift supports a general resume audit and a vacancy-based analysis mode.",
      "Да. CVlift поддерживает общий аудит резюме и анализ под конкретную вакансию.",
    ),
  },
  {
    question: l("What file types can I upload?", "Какие типы файлов можно загрузить?"),
    answer: l(
      "CVlift supports PDF, DOCX, and TXT resume uploads.",
      "CVlift поддерживает загрузку резюме в PDF, DOCX и TXT.",
    ),
  },
  {
    question: l("What does the resume score mean?", "Что означает оценка резюме?"),
    answer: l(
      "The score summarizes resume readiness across ATS quality, structure, achievements, readability, and role fit.",
      "Оценка показывает готовность резюме по ATS-качеству, структуре, достижениям, читаемости и соответствию роли.",
    ),
  },
  {
    question: l(
      "Does CVlift create a better resume version?",
      "Создает ли CVlift улучшенную версию резюме?",
    ),
    answer: l(
      "Yes. Each analysis can generate an improved resume draft and a cover letter.",
      "Да. Каждый анализ может сгенерировать улучшенный черновик резюме и сопроводительное письмо.",
    ),
  },
  {
    question: l(
      "Why does the improved resume include bracketed numbers?",
      "Почему в улучшенном резюме есть числа в скобках?",
    ),
    answer: l(
      "Bracketed values are placeholders for details you should verify and replace with your real metrics before applying.",
      "Значения в скобках — плейсхолдеры для деталей, которые нужно проверить и заменить реальными метриками перед откликом.",
    ),
  },
  {
    question: l(
      "Can CVlift compare my resume to a job description?",
      "Может ли CVlift сравнить резюме с описанием вакансии?",
    ),
    answer: l(
      "Yes. Paste the vacancy text to get a vacancy match score and tailored fixes.",
      "Да. Вставьте текст вакансии, чтобы получить оценку совпадения и точечные правки.",
    ),
  },
  {
    question: l("Is the advice generic?", "Рекомендации будут общими?"),
    answer: l(
      "CVlift focuses on specific weak points from your resume and returns concrete changes rather than generic resume tips.",
      "CVlift фокусируется на конкретных слабых местах вашего резюме и возвращает практичные изменения вместо общих советов.",
    ),
  },
];

export const seoKeywordClusters: Record<string, LocalizedValue<string[]>> = {
  "ats-resume-checker": l(
    [
      "ATS resume checker",
      "resume ATS checker",
      "ATS friendly resume",
      "resume parser check",
      "applicant tracking system resume",
    ],
    [
      "проверка резюме ATS",
      "ATS проверка резюме онлайн",
      "проверить резюме для ATS",
      "ATS совместимость резюме",
      "как пройти ATS резюме",
    ],
  ),
  "resume-score": l(
    [
      "resume score checker",
      "CV score",
      "resume review score",
      "free resume score",
      "resume grading tool",
    ],
    [
      "оценка резюме",
      "проверить резюме онлайн",
      "оценить резюме",
      "скоринг резюме",
      "AI анализ резюме",
    ],
  ),
  "resume-keywords": l(
    [
      "resume keywords",
      "ATS keywords",
      "resume keyword scanner",
      "job keywords for resume",
      "keyword match resume",
    ],
    [
      "ключевые слова для резюме",
      "ключевые слова ATS",
      "поиск ключевых слов в резюме",
      "ключевые навыки в резюме",
      "резюме ключевые слова вакансии",
    ],
  ),
  "resume-improvement": l(
    [
      "improve my resume",
      "resume improvement tool",
      "AI resume review",
      "resume rewrite",
      "make resume better",
    ],
    [
      "улучшить резюме",
      "как улучшить резюме",
      "AI проверка резюме",
      "переписать резюме",
      "сделать резюме лучше",
    ],
  ),
  "cover-letter-generator": l(
    [
      "cover letter generator",
      "AI cover letter",
      "cover letter for job application",
      "generate cover letter",
      "cover letter from resume",
    ],
    [
      "генератор сопроводительного письма",
      "сопроводительное письмо AI",
      "сопроводительное письмо к резюме",
      "написать сопроводительное письмо",
      "сопроводительное письмо по вакансии",
    ],
  ),
  "resume-job-match": l(
    [
      "resume job match",
      "match resume to job description",
      "compare resume to job description",
      "job description resume checker",
      "tailor resume to job",
    ],
    [
      "резюме под вакансию",
      "сравнить резюме с вакансией",
      "проверка резюме под вакансию",
      "адаптировать резюме под вакансию",
      "соответствие резюме вакансии",
    ],
  ),
  "ai-resume-builder": l(
    [
      "AI resume builder",
      "resume builder AI",
      "build resume with AI",
      "AI CV builder",
      "AI resume writer",
    ],
    [
      "AI конструктор резюме",
      "нейросеть для резюме",
      "составить резюме с AI",
      "AI генератор резюме",
      "написать резюме нейросетью",
    ],
  ),
  "resume-optimizer": l(
    [
      "resume optimizer",
      "ATS resume optimizer",
      "optimize resume",
      "resume optimization",
      "CV optimizer",
    ],
    [
      "оптимизация резюме",
      "оптимизировать резюме",
      "ATS оптимизация резюме",
      "резюме для поиска работы",
      "улучшить выдачу резюме",
    ],
  ),
};

export function getSeoPage(slug: string) {
  return seoPages.find((page) =>
    locales.some((locale) => page.localizedSlugs[locale] === slug),
  );
}

export function getSeoPagePath(page: SeoPage, locale: Locale = "en") {
  const slug = page.localizedSlugs[locale];

  return locale === "ru" ? `/ru/${slug}` : `/${slug}`;
}

export function getSeoPageLanguageAlternates(page: SeoPage) {
  return {
    en: getSeoPagePath(page, "en"),
    ru: getSeoPagePath(page, "ru"),
    "x-default": getSeoPagePath(page, "en"),
  };
}

export function getSeoPageKeywords(page: SeoPage, locale: Locale) {
  const baseKeywords = seoKeywordClusters[page.slug]?.[locale] ?? [];

  return [
    ...baseKeywords,
    locale === "ru" ? "CVlift" : "CVlift",
    locale === "ru" ? "анализ резюме" : "resume analysis",
    locale === "ru" ? "резюме для IT" : "IT resume",
  ];
}

export function getRequiredSeoPage(slug: string): SeoPage {
  const page = getSeoPage(slug);

  if (!page) {
    throw new Error(`Missing SEO page: ${slug}`);
  }

  return page;
}
