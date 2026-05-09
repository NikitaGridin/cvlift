export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedValue<T> = Record<Locale, T>;

export const defaultLocale: Locale = "en";

export function localized<T>(en: T, ru: T): LocalizedValue<T> {
  return { en, ru };
}

export const translations = {
  en: {
    "common.appName": "CVlift",
    "common.balance": "Balance",
    "common.credits": "CV Credits",
    "common.profile": "Profile",
    "common.signedIn": "Signed in",
    "common.signIn": "Sign in",
    "common.signOut": "Sign out",
    "common.exit": "Exit",
    "common.upload": "Upload",
    "common.uploadResume": "Upload resume",
    "common.history": "History",
    "common.creditsPage": "Credits",
    "common.faq": "FAQ",
    "common.readFaq": "Read FAQ",
    "common.startAnalysis": "Start analysis",
    "common.analyzeResume": "Analyze resume",
    "common.copy": "Copy",
    "common.ready": "Ready",
    "common.unavailable": "Unavailable",
    "common.language": "Language",
    "marketing.nav.ats": "ATS checker",
    "marketing.nav.resumeScore": "Resume score",
    "marketing.header.upload": "Upload",
    "marketing.header.signIn": "Sign in",
    "marketing.footer.description":
      "AI resume analysis for candidates who want clearer positioning, better bullets, and stronger applications.",
    "marketing.footer.product": "Product",
    "marketing.footer.legal": "Legal",
    "marketing.footer.useCases": "Use cases",
    "marketing.footer.privacy": "Privacy Policy",
    "marketing.footer.terms": "Terms of Service",
    "marketing.footer.cookies": "Cookie Policy",
    "marketing.footer.requisites": "Requisites",
    "home.badge": "Premium AI resume copilot",
    "home.title": "More interviews with a sharper resume",
    "home.description":
      "CVlift gives you an ATS score, vacancy match, weak points, and a rewritten resume that is easier for recruiters to trust.",
    "home.primarySignedIn": "Upload resume",
    "home.primarySignedOut": "Analyze resume",
    "home.outcome.ats": "ATS score in seconds",
    "home.outcome.fixes": "Concrete resume fixes",
    "home.outcome.match": "Vacancy match",
    "home.outcome.draft": "Improved resume draft",
    "home.segment.title": "Built for serious job seekers",
    "home.segment.subtitle":
      "Candidates use CVlift before they send high-stakes applications.",
    "home.segment.engineers": "Software engineers",
    "home.segment.pm": "Product managers",
    "home.segment.data": "Data analysts",
    "home.segment.design": "Designers",
    "home.segment.marketing": "Marketing leads",
    "home.segment.switchers": "Career switchers",
    "home.stats.vacancies.label": "vacancies analyzed",
    "home.stats.vacancies.text":
      "Role descriptions checked for skills, keywords, seniority signals, and hiring expectations.",
    "home.stats.resumes.label": "resumes reviewed",
    "home.stats.resumes.text":
      "Candidate resumes scored across ATS quality, structure, achievements, and role fit.",
    "home.stats.interviews.label": "interviews reported",
    "home.stats.interviews.text":
      "Users turned clearer resume positioning into recruiter conversations and next steps.",
    "home.stats.offers.label": "offers landed",
    "home.stats.offers.text":
      "Candidates reported successful outcomes after improving resumes with CVlift.",
    "home.signals.eyebrow": "Job search outcomes",
    "home.signals.title":
      "The same signals that help candidates move from resume edits to interviews.",
    "home.signals.text":
      "CVlift focuses on the resume problems that usually block callbacks: unclear positioning, weak achievements, missing keywords, and poor structure.",
    "home.signals.positioning.title": "Interview-ready positioning",
    "home.signals.positioning.text":
      "Turn scattered experience into a clear target role story recruiters can scan fast.",
    "home.signals.achievements.title": "Measurable achievements",
    "home.signals.achievements.text":
      "Find vague bullets and replace them with stronger impact, scope, and metrics.",
    "home.signals.fit.title": "Vacancy-specific fit",
    "home.signals.fit.text":
      "Compare the resume against a role before applying and fix the gaps first.",
    "home.signals.keywords.title": "Keyword search coverage",
    "home.signals.keywords.text":
      "Score the resume's ATS keyword set and add missing terms without making the text feel stuffed.",
    "home.useCases.eyebrow": "Use cases",
    "home.useCases.title": "Choose the resume workflow you need right now.",
    "home.useCases.text":
      "Open a focused guide, then move straight into analysis when your resume is ready.",
    "home.useCases.openPage": "Open page",
    "home.feedback.eyebrow": "Candidate feedback",
    "home.feedback.title": "Resume clarity people can actually use.",
    "home.feedback.badge": "Built for focused applications",
    "home.testimonial.1.quote":
      "CVlift showed why my resume sounded busy but not convincing. The rewrite made every bullet more specific and easier to defend.",
    "home.testimonial.1.role": "Frontend engineer",
    "home.testimonial.1.context": "Applying to senior product teams",
    "home.testimonial.2.quote":
      "The vacancy match view helped me stop sending the same generic resume everywhere. I could see what to change before applying.",
    "home.testimonial.2.role": "Product manager",
    "home.testimonial.2.context": "B2B SaaS roles",
    "home.testimonial.3.quote":
      "The red placeholders were useful. I knew exactly where to add verified numbers instead of leaving weak responsibilities.",
    "home.testimonial.3.role": "Data analyst",
    "home.testimonial.3.context": "Career transition",
    "home.cta.eyebrow": "Ready before you apply",
    "home.cta.title":
      "Upload your resume and see exactly what is holding it back.",
    "home.cta.text":
      "Get a clear score, ranked fixes, an improved resume, and a cover letter in one focused flow.",
    "home.cta.google": "Start with Google",
    "home.cta.secondary": "Keyword audit",
    "home.tokens.eyebrow": "CV Credits",
    "home.tokens.title": "Token packages for stronger resume iterations.",
    "home.tokens.text":
      "Use tokens for AI analysis, vacancy matching, keyword audits, and stricter checks against your target salary range.",
    "home.tokens.perAnalysis": "1 token = 1 full resume analysis",
    "home.tokens.popular": "Best sprint",
    "home.tokens.balance": "Package balance",
    "home.tokens.units": "tokens",
    "home.tokens.mock": "Preview only",
    "home.tokens.starter.name": "5 tokens",
    "home.tokens.starter.description":
      "For a fast resume pass before several high-priority applications.",
    "home.tokens.focused.name": "15 tokens",
    "home.tokens.focused.description":
      "For role tailoring, keyword experiments, and multiple resume versions.",
    "home.tokens.career.name": "30 tokens",
    "home.tokens.career.description":
      "For a full search cycle across roles, salary ranges, and repeated iterations.",
    "preview.steps.upload": "Upload",
    "preview.steps.analyze": "Analyze",
    "preview.steps.improve": "Improve",
    "preview.title": "CVlift analysis",
    "preview.subtitle": "Score, fixes, and improved draft",
    "preview.badge": "AI review",
    "preview.fileTypes": "PDF, DOCX, TXT",
    "preview.upload": "Upload your resume",
    "preview.vacancyMode": "Vacancy mode",
    "appShell.eyebrow": "CVlift intelligence",
    "upload.title": "Upload resume",
    "upload.subtitle":
      "Run a general audit or compare the resume against a specific vacancy.",
    "resume.error.vacancyRequired": "Add vacancy text.",
    "resume.error.roleRequired": "Choose a target IT role.",
    "resume.error.salaryInvalid": "Enter a valid salary range.",
    "resume.error.uploadFirst": "Upload your resume first.",
    "resume.error.noCredits": "Not enough CV Credits to analyze a resume.",
    "resume.error.sessionExpired":
      "Your session expired. Please return to the landing page and sign in again.",
    "resume.error.unavailable":
      "Resume analysis is temporarily unavailable. Please try again later.",
    "resume.file.empty": "PDF, DOCX, or TXT",
    "resume.upload.title": "Upload resume",
    "resume.upload.subtitle": "Get a score, weak points, and concrete fixes.",
    "resume.upload.drop": "Drop a resume or tap to browse.",
    "resume.credits.available": "{count} CV Credits available",
    "resume.credits.cost": "Each resume analysis costs {count} credit.",
    "resume.credits.topUp": "View packages",
    "resume.mode.vacancy.title": "With vacancy",
    "resume.mode.vacancy.text": "Score resume against a target role.",
    "resume.mode.general.title": "Without vacancy",
    "resume.mode.general.text": "Audit resume quality and market readiness.",
    "resume.vacancyText": "Vacancy text",
    "resume.vacancyPlaceholder": "Paste the vacancy description...",
    "resume.target.title": "Target conditions",
    "resume.target.subtitle":
      "AI will judge the resume against this role and salary range.",
    "resume.target.role": "Target IT role",
    "resume.target.salaryFrom": "Salary from",
    "resume.target.salaryTo": "Salary to",
    "resume.target.currency": "Currency",
    "resume.target.help":
      "Use the range you want to justify. Higher ranges make the analysis stricter.",
    "resume.whatYouGet": "What you will get",
    "resume.whatYouGetText":
      "Score, vacancy match, keyword audit, ideas to add, improved resume, and cover letter.",
    "resume.general.title": "General resume audit",
    "resume.general.text":
      "The score will focus on ATS quality, clarity, achievements, structure, seniority signal, and target role positioning.",
    "resume.progress.title": "Analyzing resume",
    "resume.progress.text": "Building your score, fixes, and improved draft.",
    "resume.loading.upload.title": "Uploading resume",
    "resume.loading.upload.detail":
      "Preparing your document for a clean, focused review.",
    "resume.loading.upload.short": "Upload",
    "resume.loading.read.title": "Reading experience",
    "resume.loading.read.detail":
      "Finding roles, skills, achievements, and career signals.",
    "resume.loading.read.short": "Read",
    "resume.loading.match.title": "Matching the vacancy",
    "resume.loading.match.detail":
      "Comparing your resume with the target role and required keywords.",
    "resume.loading.match.short": "Match",
    "resume.loading.keywords.title": "Auditing keywords",
    "resume.loading.keywords.detail":
      "Checking ATS/search coverage and missing role-specific terms.",
    "resume.loading.keywords.short": "Keywords",
    "resume.loading.positioning.title": "Auditing positioning",
    "resume.loading.positioning.detail":
      "Checking clarity, seniority signal, structure, and focus.",
    "resume.loading.positioning.short": "Positioning",
    "resume.loading.score.title": "Scoring readiness",
    "resume.loading.score.detail":
      "Reviewing ATS quality, readability, structure, and impact.",
    "resume.loading.score.short": "Score",
    "resume.loading.improve.title": "Writing stronger bullets",
    "resume.loading.improve.detail":
      "Turning weak points into sharper achievements and clearer value.",
    "resume.loading.improve.short": "Improve",
    "resume.loading.finish.title": "Finalizing report",
    "resume.loading.finish.detail":
      "Preparing your recommendations, improved resume, and cover letter.",
    "resume.loading.finish.short": "Finish",
    "credits.title": "Credits",
    "credits.subtitle":
      "Use CV Credits for resume analysis and stronger resume iterations.",
    "credits.perAnalysis": "{count} credit per resume analysis.",
    "credits.added": "{count} credits added",
    "credits.addedText": "Total internal balance added to your account.",
    "credits.spent": "{count} credits spent",
    "credits.spentText": "Resume analyses already used.",
    "credits.packagesEyebrow": "Packages",
    "credits.topUpTitle": "Credit package preview",
    "credits.topUpText":
      "These package cards are shown as a preview. Credit activation is currently disabled.",
    "credits.mockBadge": "Preview",
    "credits.usage": "Credit usage",
    "credits.usageText":
      "Each completed resume analysis spends one credit. Credit packages are currently display-only.",
    "credits.packages.starter.name": "Starter",
    "credits.packages.starter.description":
      "For quick resume checks before several applications.",
    "credits.packages.focused.name": "Focused",
    "credits.packages.focused.description":
      "Best for focused job search sprints and role tailoring.",
    "credits.packages.focused.badge": "Most popular",
    "credits.packages.career.name": "Career",
    "credits.packages.career.description":
      "For repeated iterations across multiple roles and resumes.",
    "history.title": "History",
    "history.subtitle": "Reopen previous resume checks and improved drafts.",
    "history.empty.eyebrow": "No history yet",
    "history.empty.title": "Run your first real analysis",
    "history.empty.text":
      "History is empty until you upload a resume and receive your first analysis.",
    "analysis.title": "Analysis result",
    "analysis.subtitle":
      "Score, weak spots, ATS issues, and the improved resume draft.",
    "analysis.empty.title": "No analysis found",
    "analysis.empty.text": "Upload a resume to generate a fresh AI analysis.",
    "analysis.empty.cta": "Start analysis",
    "analysis.mode.general": "General resume audit",
    "analysis.mode.vacancy": "Vacancy-based analysis",
    "analysis.score.ats.caption": "Parser-friendly structure",
    "analysis.score.positioning": "Positioning",
    "analysis.score.positioning.caption": "Target role clarity",
    "analysis.score.match": "Match",
    "analysis.score.match.caption": "Vacancy fit",
    "analysis.score.keywords": "Keywords",
    "analysis.score.keywords.caption": "ATS/search coverage",
    "analysis.score.structure": "Structure",
    "analysis.score.structure.caption": "Scanning and readability",
    "analysis.fixes.title": "Recommended fixes",
    "analysis.fixes.text": "Ranked by impact and ready to apply.",
    "analysis.impact": "{impact} impact",
    "analysis.match.title.general": "Resume readiness",
    "analysis.match.title.vacancy": "Resume match",
    "analysis.match.text.general": "ATS, clarity, positioning.",
    "analysis.match.text.vacancy": "ATS, keywords, structure.",
    "analysis.progress.ats": "ATS compatibility",
    "analysis.progress.positioning": "Role positioning",
    "analysis.progress.keywords": "Keyword matching",
    "analysis.progress.structure": "Structure",
    "analysis.progress.readability": "Readability",
    "analysis.weakPoints": "Weak points",
    "analysis.strengths": "Strengths",
    "analysis.target.title": "Target conditions",
    "analysis.target.role": "Role",
    "analysis.target.salary": "Salary range",
    "analysis.target.notSpecified": "Not specified",
    "analysis.keywords.title": "Keyword audit",
    "analysis.keywords.text":
      "Terms that affect ATS parsing and search ranking for the target role.",
    "analysis.keywords.matched": "Found",
    "analysis.keywords.missing": "Missing",
    "analysis.keywords.recommended": "Recommended",
    "analysis.keywords.actions": "Ranking actions",
    "analysis.keywords.empty":
      "No keyword data available for this older analysis.",
    "analysis.ideas.title": "Ideas to strengthen the resume",
    "analysis.ideas.text":
      "Credible additions to validate the target role and salary range.",
    "analysis.ideas.empty":
      "No resume ideas available for this older analysis.",
    "analysis.ideas.example": "Example bullet",
    "analysis.ideas.why": "Why it helps",
    "analysis.priority.high": "High",
    "analysis.priority.medium": "Medium",
    "analysis.priority.low": "Low",
    "analysis.fixCategory.experience": "Experience",
    "analysis.fixCategory.stack": "Stack",
    "analysis.fixCategory.achievements": "Achievements",
    "analysis.fixCategory.ats": "ATS",
    "analysis.fixCategory.structure": "Structure",
    "analysis.fixCategory.vacancyMatch": "Vacancy match",
    "analysis.fixCategory.keywords": "Keywords",
    "analysis.fixCategory.compensation": "Compensation",
    "analysis.fixCategory.positioning": "Positioning",
    "analysis.docs.title": "Generated documents",
    "analysis.docs.text":
      "Review the improved resume, original text, and cover letter in one wide workspace.",
    "analysis.docs.improved": "Improved",
    "analysis.docs.original": "Original",
    "analysis.docs.cover": "Cover letter",
    "analysis.docs.improvedTitle": "Improved resume",
    "analysis.docs.originalTitle": "Original resume",
    "analysis.docs.coverTitle": "Cover letter",
    "analysis.docs.fillIns":
      "Red highlights mark values you should replace with verified numbers or details.",
    "cookie.title": "Cookie preferences",
    "cookie.text":
      "CVlift uses essential cookies for sign-in and security. Optional cookies may help us improve the product experience.",
    "cookie.read": "Read our",
    "cookie.policy": "Cookie Policy",
    "cookie.necessary": "Necessary only",
    "cookie.accept": "Accept all",
  },
  ru: {
    "common.appName": "CVlift",
    "common.balance": "Баланс",
    "common.credits": "CV Credits",
    "common.profile": "Профиль",
    "common.signedIn": "Вы вошли",
    "common.signIn": "Войти",
    "common.signOut": "Выйти",
    "common.exit": "Выйти",
    "common.upload": "Загрузка",
    "common.uploadResume": "Загрузить резюме",
    "common.history": "История",
    "common.creditsPage": "Кредиты",
    "common.faq": "FAQ",
    "common.readFaq": "Читать FAQ",
    "common.startAnalysis": "Начать анализ",
    "common.analyzeResume": "Проверить резюме",
    "common.copy": "Копировать",
    "common.ready": "Готово",
    "common.unavailable": "Недоступно",
    "common.language": "Язык",
    "marketing.nav.ats": "ATS-проверка",
    "marketing.nav.resumeScore": "Оценка резюме",
    "marketing.header.upload": "Загрузить",
    "marketing.header.signIn": "Войти",
    "marketing.footer.description":
      "AI-анализ резюме для кандидатов, которым нужны ясное позиционирование, сильные буллеты и более убедительные отклики.",
    "marketing.footer.product": "Продукт",
    "marketing.footer.legal": "Документы",
    "marketing.footer.useCases": "Сценарии",
    "marketing.footer.privacy": "Политика приватности",
    "marketing.footer.terms": "Условия сервиса",
    "marketing.footer.cookies": "Политика cookie",
    "marketing.footer.requisites": "Реквизиты",
    "home.badge": "Премиальный AI-помощник для резюме",
    "home.title": "Больше интервью с сильным резюме",
    "home.description":
      "CVlift дает ATS-оценку, совпадение с вакансией, слабые места и улучшенную версию резюме, которой проще доверять рекрутерам.",
    "home.primarySignedIn": "Загрузить резюме",
    "home.primarySignedOut": "Проверить резюме",
    "home.outcome.ats": "ATS-оценка за секунды",
    "home.outcome.fixes": "Конкретные правки резюме",
    "home.outcome.match": "Подбор под вакансию",
    "home.outcome.draft": "Улучшенная версия резюме",
    "home.segment.title": "Для осознанного поиска работы",
    "home.segment.subtitle":
      "Кандидаты используют CVlift перед отправкой важных откликов.",
    "home.segment.engineers": "Разработчики",
    "home.segment.pm": "Product-менеджеры",
    "home.segment.data": "Дата-аналитики",
    "home.segment.design": "Дизайнеры",
    "home.segment.marketing": "Маркетологи",
    "home.segment.switchers": "Смена карьеры",
    "home.stats.vacancies.label": "вакансий проанализировано",
    "home.stats.vacancies.text":
      "Описания ролей проверены по навыкам, ключевым словам, уровню и ожиданиям нанимающих команд.",
    "home.stats.resumes.label": "резюме проверено",
    "home.stats.resumes.text":
      "Резюме оценены по ATS-качеству, структуре, достижениям и соответствию роли.",
    "home.stats.interviews.label": "интервью отмечено",
    "home.stats.interviews.text":
      "Пользователи превращали более ясное позиционирование в разговоры с рекрутерами.",
    "home.stats.offers.label": "офферов получено",
    "home.stats.offers.text":
      "Кандидаты сообщали об успешных результатах после улучшения резюме в CVlift.",
    "home.signals.eyebrow": "Результаты поиска",
    "home.signals.title":
      "Те же сигналы, которые помогают перейти от правок резюме к интервью.",
    "home.signals.text":
      "CVlift фокусируется на проблемах, которые чаще всего мешают откликам: неясное позиционирование, слабые достижения, пропущенные ключевые слова и плохая структура.",
    "home.signals.positioning.title": "Позиционирование под интервью",
    "home.signals.positioning.text":
      "Соберите разрозненный опыт в понятную историю целевой роли, которую рекрутер быстро считывает.",
    "home.signals.achievements.title": "Измеримые достижения",
    "home.signals.achievements.text":
      "Найдите размытые буллеты и замените их более сильным влиянием, масштабом и метриками.",
    "home.signals.fit.title": "Соответствие вакансии",
    "home.signals.fit.text":
      "Сравните резюме с ролью до отклика и сначала закройте пробелы.",
    "home.signals.keywords.title": "Охват ключевых слов",
    "home.signals.keywords.text":
      "Оцените набор ATS-ключей и добавьте недостающие термины так, чтобы резюме звучало естественно.",
    "home.useCases.eyebrow": "Сценарии",
    "home.useCases.title": "Выберите нужный сценарий работы с резюме.",
    "home.useCases.text":
      "Откройте короткий гид, затем сразу переходите к анализу, когда резюме готово.",
    "home.useCases.openPage": "Открыть",
    "home.feedback.eyebrow": "Отзывы кандидатов",
    "home.feedback.title":
      "Ясность резюме, которой реально можно пользоваться.",
    "home.feedback.badge": "Для точечных откликов",
    "home.testimonial.1.quote":
      "CVlift показал, почему резюме выглядело занятым, но не убедительным. Переписанная версия сделала каждый буллет конкретнее.",
    "home.testimonial.1.role": "Frontend-разработчик",
    "home.testimonial.1.context": "Отклики в senior product-команды",
    "home.testimonial.2.quote":
      "Сравнение с вакансией помогло перестать отправлять одно и то же резюме везде. Я видел, что менять до отклика.",
    "home.testimonial.2.role": "Product-менеджер",
    "home.testimonial.2.context": "B2B SaaS роли",
    "home.testimonial.3.quote":
      "Красные плейсхолдеры оказались полезными. Я точно понимала, куда добавить проверенные цифры вместо слабых обязанностей.",
    "home.testimonial.3.role": "Дата-аналитик",
    "home.testimonial.3.context": "Смена карьерного трека",
    "home.cta.eyebrow": "До отклика",
    "home.cta.title": "Загрузите резюме и увидьте, что именно его тормозит.",
    "home.cta.text":
      "Получите понятную оценку, приоритетные правки, улучшенное резюме и сопроводительное письмо в одном потоке.",
    "home.cta.google": "Начать через Google",
    "home.cta.secondary": "Проверить ключи",
    "home.tokens.eyebrow": "CV Credits",
    "home.tokens.title": "Пакеты токенов для сильных итераций резюме.",
    "home.tokens.text":
      "Используйте токены для AI-анализа, сравнения с вакансией, keyword-аудита и строгой проверки под целевую зарплатную вилку.",
    "home.tokens.perAnalysis": "1 токен = 1 полный анализ резюме",
    "home.tokens.popular": "Лучший спринт",
    "home.tokens.balance": "Баланс пакета",
    "home.tokens.units": "токенов",
    "home.tokens.mock": "Только превью",
    "home.tokens.starter.name": "5 токенов",
    "home.tokens.starter.description":
      "Для быстрой проверки резюме перед несколькими важными откликами.",
    "home.tokens.focused.name": "15 токенов",
    "home.tokens.focused.description":
      "Для адаптации под роли, экспериментов с ключевыми словами и нескольких версий резюме.",
    "home.tokens.career.name": "30 токенов",
    "home.tokens.career.description":
      "Для полного цикла поиска по ролям, зарплатным вилкам и повторным итерациям.",
    "preview.steps.upload": "Загрузка",
    "preview.steps.analyze": "Анализ",
    "preview.steps.improve": "Улучшение",
    "preview.title": "Анализ CVlift",
    "preview.subtitle": "Оценка, правки и улучшенный черновик",
    "preview.badge": "AI-проверка",
    "preview.fileTypes": "PDF, DOCX, TXT",
    "preview.upload": "Загрузите резюме",
    "preview.vacancyMode": "Режим вакансии",
    "appShell.eyebrow": "CVlift intelligence",
    "upload.title": "Загрузить резюме",
    "upload.subtitle":
      "Запустите общий аудит или сравните резюме с конкретной вакансией.",
    "resume.error.vacancyRequired": "Добавьте текст вакансии.",
    "resume.error.roleRequired": "Выберите целевую IT-должность.",
    "resume.error.salaryInvalid": "Введите корректную зарплатную вилку.",
    "resume.error.uploadFirst": "Сначала загрузите резюме.",
    "resume.error.noCredits": "Недостаточно CV Credits для проверки резюме.",
    "resume.error.sessionExpired":
      "Сессия истекла. Вернитесь на главную и войдите снова.",
    "resume.error.unavailable":
      "Анализ резюме временно недоступен. Попробуйте позже.",
    "resume.file.empty": "PDF, DOCX или TXT",
    "resume.upload.title": "Загрузить резюме",
    "resume.upload.subtitle":
      "Получите оценку, слабые места и конкретные правки.",
    "resume.upload.drop": "Перетащите резюме или выберите файл.",
    "resume.credits.available": "Доступно CV Credits: {count}",
    "resume.credits.cost": "Один анализ стоит {count} кредит.",
    "resume.credits.topUp": "Пакеты кредитов",
    "resume.mode.vacancy.title": "С вакансией",
    "resume.mode.vacancy.text": "Оценить резюме под целевую роль.",
    "resume.mode.general.title": "Без вакансии",
    "resume.mode.general.text": "Проверить качество и готовность резюме.",
    "resume.vacancyText": "Текст вакансии",
    "resume.vacancyPlaceholder": "Вставьте описание вакансии...",
    "resume.target.title": "Целевые условия",
    "resume.target.subtitle":
      "AI будет оценивать резюме под эту должность и зарплатную вилку.",
    "resume.target.role": "Целевая IT-должность",
    "resume.target.salaryFrom": "Зарплата от",
    "resume.target.salaryTo": "Зарплата до",
    "resume.target.currency": "Валюта",
    "resume.target.help":
      "Укажите вилку, которую хотите обосновать. Чем выше вилка, тем строже анализ.",
    "resume.whatYouGet": "Что вы получите",
    "resume.whatYouGetText":
      "Оценку, совпадение с вакансией, keyword-аудит, идеи для усиления, улучшенное резюме и сопроводительное письмо.",
    "resume.general.title": "Общий аудит резюме",
    "resume.general.text":
      "Оценка сфокусируется на ATS-качестве, ясности, достижениях, структуре, уровне и позиционировании.",
    "resume.progress.title": "Анализируем резюме",
    "resume.progress.text": "Собираем оценку, правки и улучшенную версию.",
    "resume.loading.upload.title": "Загружаем резюме",
    "resume.loading.upload.detail": "Готовим документ к аккуратной проверке.",
    "resume.loading.upload.short": "Загрузка",
    "resume.loading.read.title": "Читаем опыт",
    "resume.loading.read.detail":
      "Ищем роли, навыки, достижения и карьерные сигналы.",
    "resume.loading.read.short": "Чтение",
    "resume.loading.match.title": "Сравниваем с вакансией",
    "resume.loading.match.detail":
      "Сопоставляем резюме с требованиями роли и ключевыми словами.",
    "resume.loading.match.short": "Сравнение",
    "resume.loading.keywords.title": "Проверяем ключевые слова",
    "resume.loading.keywords.detail":
      "Оцениваем ATS/search-покрытие и недостающие термины под роль.",
    "resume.loading.keywords.short": "Keywords",
    "resume.loading.positioning.title": "Проверяем позиционирование",
    "resume.loading.positioning.detail":
      "Оцениваем ясность, уровень, структуру и фокус.",
    "resume.loading.positioning.short": "Позиция",
    "resume.loading.score.title": "Считаем готовность",
    "resume.loading.score.detail":
      "Проверяем ATS-качество, читаемость, структуру и влияние.",
    "resume.loading.score.short": "Оценка",
    "resume.loading.improve.title": "Усиливаем буллеты",
    "resume.loading.improve.detail":
      "Превращаем слабые места в более ясные достижения.",
    "resume.loading.improve.short": "Правки",
    "resume.loading.finish.title": "Собираем отчет",
    "resume.loading.finish.detail":
      "Готовим рекомендации, улучшенное резюме и сопроводительное письмо.",
    "resume.loading.finish.short": "Финиш",
    "credits.title": "Кредиты",
    "credits.subtitle":
      "Используйте CV Credits для анализа и сильных итераций резюме.",
    "credits.perAnalysis": "{count} кредит за один анализ резюме.",
    "credits.added": "Начислено кредитов: {count}",
    "credits.addedText": "Всего внутреннего баланса добавлено на аккаунт.",
    "credits.spent": "Потрачено кредитов: {count}",
    "credits.spentText": "Уже использовано на анализы резюме.",
    "credits.packagesEyebrow": "Пакеты",
    "credits.topUpTitle": "Превью пакетов кредитов",
    "credits.topUpText":
      "Карточки пакетов показаны как превью. Активация кредитов сейчас отключена.",
    "credits.mockBadge": "Превью",
    "credits.usage": "Использование кредитов",
    "credits.usageText":
      "Каждый завершенный анализ списывает один кредит. Пакеты кредитов сейчас отображаются только как превью.",
    "credits.packages.starter.name": "Старт",
    "credits.packages.starter.description":
      "Для быстрой проверки резюме перед несколькими откликами.",
    "credits.packages.focused.name": "Фокус",
    "credits.packages.focused.description":
      "Оптимально для активного поиска и адаптации под роли.",
    "credits.packages.focused.badge": "Популярно",
    "credits.packages.career.name": "Карьера",
    "credits.packages.career.description":
      "Для регулярных итераций по нескольким ролям и версиям резюме.",
    "history.title": "История",
    "history.subtitle": "Открывайте прошлые проверки и улучшенные черновики.",
    "history.empty.eyebrow": "Истории пока нет",
    "history.empty.title": "Запустите первый настоящий анализ",
    "history.empty.text":
      "История появится после загрузки резюме и получения первого анализа.",
    "analysis.title": "Результат анализа",
    "analysis.subtitle":
      "Оценка, слабые места, ATS-проблемы и улучшенная версия резюме.",
    "analysis.empty.title": "Анализ не найден",
    "analysis.empty.text": "Загрузите резюме, чтобы получить новый AI-анализ.",
    "analysis.empty.cta": "Начать анализ",
    "analysis.mode.general": "Общий аудит резюме",
    "analysis.mode.vacancy": "Анализ под вакансию",
    "analysis.score.ats.caption": "Структура для парсеров",
    "analysis.score.positioning": "Позиция",
    "analysis.score.positioning.caption": "Ясность целевой роли",
    "analysis.score.match": "Совпадение",
    "analysis.score.match.caption": "Соответствие вакансии",
    "analysis.score.keywords": "Keywords",
    "analysis.score.keywords.caption": "ATS/search-покрытие",
    "analysis.score.structure": "Структура",
    "analysis.score.structure.caption": "Сканирование и читаемость",
    "analysis.fixes.title": "Рекомендованные правки",
    "analysis.fixes.text": "Отсортированы по влиянию и готовы к применению.",
    "analysis.impact": "Влияние: {impact}",
    "analysis.match.title.general": "Готовность резюме",
    "analysis.match.title.vacancy": "Совпадение резюме",
    "analysis.match.text.general": "ATS, ясность, позиционирование.",
    "analysis.match.text.vacancy": "ATS, ключевые слова, структура.",
    "analysis.progress.ats": "ATS-совместимость",
    "analysis.progress.positioning": "Позиционирование роли",
    "analysis.progress.keywords": "Совпадение ключевых слов",
    "analysis.progress.structure": "Структура",
    "analysis.progress.readability": "Читаемость",
    "analysis.weakPoints": "Слабые места",
    "analysis.strengths": "Сильные стороны",
    "analysis.target.title": "Целевые условия",
    "analysis.target.role": "Должность",
    "analysis.target.salary": "Зарплатная вилка",
    "analysis.target.notSpecified": "Не указано",
    "analysis.keywords.title": "Keyword-аудит",
    "analysis.keywords.text":
      "Термины, которые влияют на ATS-парсинг и выдачу резюме под целевую роль.",
    "analysis.keywords.matched": "Найдены",
    "analysis.keywords.missing": "Не хватает",
    "analysis.keywords.recommended": "Рекомендованы",
    "analysis.keywords.actions": "Действия для выдачи",
    "analysis.keywords.empty":
      "Для этого старого анализа нет данных по keywords.",
    "analysis.ideas.title": "Идеи для усиления резюме",
    "analysis.ideas.text":
      "Что можно честно добавить, чтобы подтвердить должность и зарплатную вилку.",
    "analysis.ideas.empty":
      "Для этого старого анализа нет идей по усилению резюме.",
    "analysis.ideas.example": "Пример буллета",
    "analysis.ideas.why": "Почему это поможет",
    "analysis.priority.high": "Высокий",
    "analysis.priority.medium": "Средний",
    "analysis.priority.low": "Низкий",
    "analysis.fixCategory.experience": "Опыт",
    "analysis.fixCategory.stack": "Стек",
    "analysis.fixCategory.achievements": "Достижения",
    "analysis.fixCategory.ats": "ATS",
    "analysis.fixCategory.structure": "Структура",
    "analysis.fixCategory.vacancyMatch": "Совпадение с вакансией",
    "analysis.fixCategory.keywords": "Keywords",
    "analysis.fixCategory.compensation": "Компенсация",
    "analysis.fixCategory.positioning": "Позиционирование",
    "analysis.docs.title": "Сгенерированные документы",
    "analysis.docs.text":
      "Смотрите улучшенное резюме, исходный текст и сопроводительное письмо в одном рабочем пространстве.",
    "analysis.docs.improved": "Улучшенное",
    "analysis.docs.original": "Оригинал",
    "analysis.docs.cover": "Письмо",
    "analysis.docs.improvedTitle": "Улучшенное резюме",
    "analysis.docs.originalTitle": "Исходное резюме",
    "analysis.docs.coverTitle": "Сопроводительное письмо",
    "analysis.docs.fillIns":
      "Красные выделения показывают значения, которые нужно заменить проверенными цифрами или деталями.",
    "cookie.title": "Настройки cookie",
    "cookie.text":
      "CVlift использует обязательные cookie для входа и безопасности. Необязательные cookie помогают улучшать продукт.",
    "cookie.read": "Подробнее:",
    "cookie.policy": "Политика cookie",
    "cookie.necessary": "Только необходимые",
    "cookie.accept": "Принять все",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  values?: Record<string, string | number>,
) {
  const template = String(
    translations[locale][key] ?? translations[defaultLocale][key] ?? key,
  );

  if (!values) {
    return template;
  }

  let result = template;

  for (const [name, value] of Object.entries(values)) {
    result = result.replaceAll(`{${name}}`, String(value));
  }

  return result;
}
