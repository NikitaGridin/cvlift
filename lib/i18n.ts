export const locales = ["ru"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedValue<T> = Record<Locale, T> & { en?: T };

export const defaultLocale: Locale = "ru";

export function localized<T>(en: T, ru: T): LocalizedValue<T> {
  return { en, ru };
}

export const translations = {
  ru: {
    "common.appName": "OfferLyra",
    "common.balance": "Баланс",
    "common.credits": "Токены",
    "common.profile": "Профиль",
    "common.signedIn": "Вы вошли",
    "common.signIn": "Войти",
    "common.signOut": "Выйти",
    "common.exit": "Выйти",
    "common.dashboard": "Дашборд",
    "common.openDashboard": "В дашборд",
    "common.analysis": "Анализ",
    "common.agent": "Создать резюме",
    "common.upload": "Анализ",
    "common.uploadResume": "Анализ резюме",
    "common.history": "История",
    "common.creditsPage": "Токены",
    "common.faq": "FAQ",
    "common.readFaq": "Читать FAQ",
    "common.startAnalysis": "Начать подготовку",
    "common.analyzeResume": "Проверить резюме",
    "common.copy": "Копировать",
    "common.ready": "Готово",
    "common.unavailable": "Недоступно",
    "common.free": "Бесплатно",
    "common.freeMode": "Бесплатный режим",
    "common.language": "Язык",
    "marketing.nav.ats": "Тренажёр",
    "marketing.nav.resumeScore": "AI-интервью",
    "marketing.header.upload": "Дашборд",
    "marketing.header.signIn": "Войти",
    "marketing.footer.description":
      "AI-платформа подготовки к собеседованию: резюме, тренажёр вопросов, HR-скрининг, техническое интервью и перевод.",
    "marketing.footer.product": "Продукт",
    "marketing.footer.legal": "Документы",
    "marketing.footer.useCases": "Сценарии",
    "marketing.footer.privacy": "Политика приватности",
    "marketing.footer.terms": "Условия сервиса",
    "marketing.footer.cookies": "Политика cookie",
    "marketing.footer.requisites": "Реквизиты",
    "home.badge": "AI-платформа подготовки к собеседованию",
    "home.title": "Пройдите путь от резюме до интервью",
    "home.description":
      "OfferLyra помогает подготовиться к найму целиком: собрать резюме, проверить слабые места, потренировать вопросы, пройти HR-скрининг и техническое интервью с AI-агентом.",
    "home.primarySignedIn": "В дашборд",
    "home.primarySignedOut": "В дашборд",
    "home.outcome.ats": "AI-тренажёр вопросов",
    "home.outcome.fixes": "HR-скрининг с агентом",
    "home.outcome.match": "Техническое интервью",
    "home.outcome.draft": "Резюме и перевод",
    "home.segment.title": "Для подготовки к каждому этапу",
    "home.segment.subtitle":
      "Кандидаты используют OfferLyra перед откликом, HR-звонком, техническим этапом и финальным интервью.",
    "home.segment.engineers": "Разработчики",
    "home.segment.pm": "Product-менеджеры",
    "home.segment.data": "Дата-аналитики",
    "home.segment.design": "Дизайнеры",
    "home.segment.marketing": "Маркетологи",
    "home.segment.switchers": "Смена карьеры",
    "home.stats.vacancies.label": "вакансий разобрано",
    "home.stats.vacancies.text":
      "Описания ролей проверены по навыкам, ключевым словам, уровню и ожиданиям нанимающих команд.",
    "home.stats.resumes.label": "резюме подготовлено",
    "home.stats.resumes.text":
      "Резюме оценены по ATS-качеству, структуре, достижениям и соответствию роли.",
    "home.stats.interviews.label": "интервью натренировано",
    "home.stats.interviews.text":
      "Пользователи превращали более ясное позиционирование в разговоры с рекрутерами.",
    "home.stats.offers.label": "этапов пройдено",
    "home.stats.offers.text":
      "Кандидаты превращали подготовку в более уверенные HR-звонки, технические интервью и финальные этапы.",
    "home.signals.eyebrow": "Готовность к интервью",
    "home.signals.title":
      "Сигналы, которые помогают пройти путь от отклика к офферу.",
    "home.signals.text":
      "OfferLyra фокусируется на проблемах, которые чаще всего мешают на собеседовании: неясная история опыта, слабые примеры, технические пробелы и неготовность к уточняющим вопросам.",
    "home.signals.positioning.title": "Самопрезентация под роль",
    "home.signals.positioning.text":
      "Соберите разрозненный опыт в понятную историю целевой роли, которую рекрутер быстро считывает.",
    "home.signals.achievements.title": "Ответы с фактами",
    "home.signals.achievements.text":
      "Найдите размытые буллеты и замените их более сильным влиянием, масштабом и метриками.",
    "home.signals.fit.title": "Подготовка под вакансию",
    "home.signals.fit.text":
      "Сравните резюме с ролью до отклика и сначала закройте пробелы.",
    "home.signals.keywords.title": "Техническая глубина",
    "home.signals.keywords.text":
      "Отрабатывайте вопросы по стеку, архитектуре, проектам и решениям, чтобы отвечать глубже и увереннее.",
    "home.useCases.eyebrow": "Сценарии",
    "home.useCases.title": "Выберите сценарий подготовки к интервью.",
    "home.useCases.text":
      "Откройте нужный этап: тренажёр вопросов, AI-собеседование, HR-скрининг, техническое интервью, резюме или перевод.",
    "home.useCases.openPage": "Открыть",
    "home.feedback.eyebrow": "Отзывы кандидатов",
    "home.feedback.title":
      "Подготовка, которую можно сразу использовать на интервью.",
    "home.feedback.badge": "Для важных этапов найма",
    "home.testimonial.1.quote":
      "OfferLyra помог собрать историю опыта и потренировать ответы так, чтобы на HR-звонке не теряться в деталях.",
    "home.testimonial.1.role": "Frontend-разработчик",
    "home.testimonial.1.context": "Подготовка к HR-скринингу",
    "home.testimonial.2.quote":
      "AI-интервьюер задавал уточняющие вопросы по проектам. После пары сессий стало понятно, где не хватает технической глубины.",
    "home.testimonial.2.role": "Product-менеджер",
    "home.testimonial.2.context": "Техническое интервью",
    "home.testimonial.3.quote":
      "Сначала собрала резюме, потом перевела его и потренировала ответы на английском под международную вакансию.",
    "home.testimonial.3.role": "Дата-аналитик",
    "home.testimonial.3.context": "Международный отклик",
    "home.cta.eyebrow": "Перед интервью",
    "home.cta.title": "Подготовьтесь к вопросам, которые зададут именно вам.",
    "home.cta.text":
      "Загрузите резюме или соберите его с AI, добавьте вакансию и потренируйте HR-скрининг, техническое интервью и ответы по опыту.",
    "home.cta.google": "В дашборд через Google",
    "home.cta.secondary": "Тренировать вопросы",
    "home.tokens.eyebrow": "Токены",
    "home.tokens.title": "Пакеты токенов для подготовки к интервью.",
    "home.tokens.text":
      "Используйте токены для анализа резюме, AI-собеседований, HR-скрининга, технических вопросов и подготовки под вакансию.",
    "home.tokens.perAnalysis": "1 токен = 1 полный AI-сценарий подготовки",
    "home.tokens.popular": "Лучший спринт",
    "home.tokens.balance": "Баланс пакета",
    "home.tokens.units": "токенов",
    "home.tokens.mock": "Только превью",
    "home.tokens.starter.name": "1 токен",
    "home.tokens.starter.description":
      "Для одного анализа или пробного сценария перед важным этапом.",
    "home.tokens.focused.name": "5 токенов",
    "home.tokens.focused.description":
      "Для нескольких тренировок: резюме, HR-скрининг, технические вопросы и повторные ответы.",
    "home.tokens.career.name": "10 токенов",
    "home.tokens.career.description":
      "Для полного цикла поиска: резюме, перевод, тренажёр, HR и техническое интервью.",
    "preview.steps.upload": "Загрузка",
    "preview.steps.analyze": "Анализ",
    "preview.steps.improve": "Подготовка",
    "preview.title": "Подготовка OfferLyra",
    "preview.subtitle": "Резюме, вопросы и AI-интервью",
    "preview.badge": "AI-подготовка",
    "preview.fileTypes": "PDF, DOCX, TXT",
    "preview.upload": "Загрузите резюме",
    "preview.vacancyMode": "Режим вакансии",
    "appShell.eyebrow": "Центр подготовки",
    "agent.title": "Создание резюме",
    "agent.subtitle":
      "Ответьте на вопросы голосом или текстом, а OfferLyra соберет структурированное резюме.",
    "agent.intro":
      "Привет. Я буду задавать вопросы по порядку: цель поиска, компании, затем личные данные. Первый вопрос: где вы ищете работу, на какую вакансию и какой уровень дохода хотите?",
    "agent.panel.title": "Голосовая сессия",
    "agent.brief.title": "Черновик резюме",
    "agent.brief.text":
      "Помощник соберет роль, опыт, достижения, стек, образование, проекты и ссылки перед составлением резюме.",
    "agent.voice.disclosure": "AI-сгенерированный голос",
    "agent.voice.title": "Создание резюме",
    "agent.voice.mode": "Голосовой режим",
    "agent.voice.current": "Текущий вопрос",
    "agent.voice.answer": "Ваш ответ",
    "agent.voice.empty": "Голосовой ответ появится здесь.",
    "agent.chat.title": "Диалог",
    "agent.chat.aiAgent": "Помощник по резюме",
    "agent.chat.you": "Вы",
    "agent.status.ready": "Готов",
    "agent.status.online": "Онлайн",
    "agent.status.listening": "Слушаю",
    "agent.status.waiting": "Дослушиваю фразу",
    "agent.status.thinking": "Думаю",
    "agent.status.speaking": "Озвучиваю",
    "agent.status.voiceUnsupported":
      "Голосовой ввод недоступен в этом браузере.",
    "agent.action.listen": "Начать голосом",
    "agent.action.stop": "Остановить",
    "agent.action.sendVoice": "Отправить ответ",
    "agent.action.openChat": "Открыть чат",
    "agent.action.closeChat": "Закрыть чат",
    "agent.action.openFullscreen": "Открыть на весь экран",
    "agent.action.closeFullscreen": "Закрыть весь экран",
    "agent.action.send": "Отправить",
    "agent.action.speakLast": "Озвучить последний ответ",
    "agent.action.stopSpeaking": "Остановить голос",
    "agent.call.listeningToYou": "Слушаю вас",
    "agent.call.mute": "Выключить микрофон",
    "agent.call.end": "Завершить",
    "agent.call.start": "Начать",
    "agent.call.pause": "Пауза",
    "agent.call.speaker": "Динамик",
    "agent.input.placeholder": "Напишите здесь...",
    "agent.finalVoiceSummary":
      "Готово. Я подготовил резюме и скачал его текстовым файлом.",
    "agent.finalDownload.title": "TXT-файл резюме готов",
    "agent.finalDownload.text":
      "Финальное резюме структурировано как читаемый .txt файл с разделами, абзацами и списками.",
    "agent.finalDownload.button": "Скачать .txt",
    "agent.leave.title": "Выйти из разговора?",
    "agent.leave.text":
      "Если уйти сейчас, текущая голосовая сессия остановится, а несохраненные ответы могут потеряться.",
    "agent.leave.stay": "Остаться",
    "agent.leave.confirm": "Выйти",
    "agent.leave.browserWarning":
      "Текущая голосовая сессия остановится, если вы покинете страницу.",
    "agent.error.unavailable": "Сервис создания резюме временно недоступен.",
    "agent.error.voiceUnsupported":
      "Этот браузер не поддерживает голосовой ввод.",
    "agent.error.voiceInput": "Не удалось распознать голос.",
    "upload.title": "Анализ",
    "upload.subtitle":
      "Запустите общий аудит или сравните резюме с конкретной вакансией.",
    "resume.error.vacancyRequired": "Добавьте текст вакансии.",
    "resume.error.roleRequired": "Выберите целевую IT-должность.",
    "resume.error.salaryInvalid": "Введите корректную зарплатную вилку.",
    "resume.error.uploadFirst": "Сначала загрузите резюме.",
    "resume.error.noCredits": "Недостаточно токенов для проверки резюме.",
    "resume.error.sessionExpired":
      "Сессия истекла. Вернитесь на главную и войдите снова.",
    "resume.error.unavailable":
      "Анализ резюме временно недоступен. Попробуйте позже.",
    "resume.file.empty": "PDF, DOCX или TXT",
    "resume.upload.title": "Загрузить резюме",
    "resume.upload.subtitle":
      "Получите оценку, слабые места и конкретные правки.",
    "resume.upload.drop": "Перетащите резюме или выберите файл.",
    "resume.credits.available": "Доступно токенов: {count}",
    "resume.credits.cost": "Один анализ стоит {count} токен.",
    "resume.credits.freeAvailable": "Анализ резюме сейчас бесплатный.",
    "resume.credits.freeCost": "Токены не будут списаны за эту загрузку.",
    "resume.credits.topUp": "Пакеты токенов",
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
      "Оценку, совпадение с вакансией, keyword-аудит, идеи для усиления, улучшенное резюме и план вопросов для интервью.",
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
      "Готовим рекомендации, улучшенное резюме и план ответов для интервью.",
    "resume.loading.finish.short": "Финиш",
    "credits.title": "Токены",
    "credits.subtitle":
      "Используйте токены для анализа резюме, AI-скрининга и подготовки к интервью.",
    "credits.perAnalysis": "{count} токен за один сценарий подготовки.",
    "credits.freeLabel": "Бесплатно",
    "credits.freeMode": "Анализ резюме сейчас бесплатный.",
    "credits.added": "Начислено токенов: {count}",
    "credits.addedText": "Всего внутреннего баланса токенов добавлено на аккаунт.",
    "credits.spent": "Потрачено токенов: {count}",
    "credits.spentText": "Уже использовано на анализы резюме.",
    "credits.packagesEyebrow": "Пакеты",
    "credits.topUpTitle": "Превью пакетов токенов",
    "credits.topUpText":
      "Карточки пакетов показаны как превью. Активация токенов сейчас отключена.",
    "credits.mockBadge": "Превью",
    "credits.usage": "Использование токенов",
    "credits.usageText":
      "Каждый завершенный анализ списывает один токен. Пакеты токенов сейчас отображаются только как превью.",
    "credits.usageTextFree":
      "Пока бесплатный режим включен, завершенные анализы не списывают токены.",
    "credits.packages.starter.name": "1 токен",
    "credits.packages.starter.description":
      "Для одного анализа резюме или пробного сценария интервью.",
    "credits.packages.focused.name": "5 токенов",
    "credits.packages.focused.description":
      "Оптимально для резюме, HR-скрининга и нескольких тренировок вопросов.",
    "credits.packages.focused.badge": "Популярно",
    "credits.packages.career.name": "10 токенов",
    "credits.packages.career.description":
      "Для полного цикла поиска: резюме, перевод, HR и техническое интервью.",
    "history.title": "История",
    "history.subtitle": "Открывайте прошлые проверки, сценарии подготовки и черновики.",
    "history.empty.eyebrow": "Истории пока нет",
    "history.empty.title": "Запустите первый настоящий анализ",
    "history.empty.text":
      "История появится после загрузки резюме и получения первого анализа.",
    "analysis.title": "Результат подготовки",
    "analysis.subtitle":
      "Оценка резюме, слабые места, ATS-проблемы и темы для интервью.",
    "analysis.empty.title": "Анализ не найден",
    "analysis.empty.text": "Загрузите резюме, чтобы получить новый AI-анализ.",
    "analysis.empty.cta": "Начать подготовку",
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
      "Смотрите улучшенное резюме, исходный текст и план ответов для интервью в одном рабочем пространстве.",
    "analysis.docs.improved": "Улучшенное",
    "analysis.docs.original": "Оригинал",
    "analysis.docs.cover": "Ответы",
    "analysis.docs.improvedTitle": "Улучшенное резюме",
    "analysis.docs.originalTitle": "Исходное резюме",
    "analysis.docs.coverTitle": "План ответов для интервью",
    "analysis.docs.fillIns":
      "Красные выделения показывают значения, которые нужно заменить проверенными цифрами или деталями.",
    "cookie.title": "Уведомление о cookie",
    "cookie.text":
      "OfferLyra использует cookie для входа, безопасности, настроек и улучшения продукта. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie.",
    "cookie.read": "Подробнее:",
    "cookie.policy": "Политика cookie",
    "cookie.dismiss": "Понятно",
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  values?: Record<string, string | number>,
) {
  const template = String(
    translations[locale][key] ?? translations.ru[key] ?? key,
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
