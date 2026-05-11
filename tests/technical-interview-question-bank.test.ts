import { describe, expect, test } from "vitest";
import {
  getTrainerQuestionCount,
  getTrainerQuestionPool,
  getTrainerQuestionSet,
  trainerQuestionResearchSources,
  trainerGrades,
  trainerSpecialties,
  trainerTopics,
} from "@/lib/technical-interview-question-bank";

describe("technical interview question bank", () => {
  test("contains the requested Frontend Junior question sets", () => {
    const questions = getTrainerQuestionSet("frontend", "junior", "javascript-basics");
    const asyncQuestions = getTrainerQuestionSet("frontend", "junior", "async-await-event-loop");
    const reactQuestions = getTrainerQuestionSet("frontend", "junior", "react-basics");
    const hooksQuestions = getTrainerQuestionSet("frontend", "junior", "react-hooks");
    const typescriptQuestions = getTrainerQuestionSet("frontend", "junior", "typescript");
    const stateQuestions = getTrainerQuestionSet("frontend", "junior", "state-management");
    const nextjsQuestions = getTrainerQuestionSet("frontend", "junior", "nextjs");
    const browserQuestions = getTrainerQuestionSet("frontend", "junior", "browser-dom");
    const performanceQuestions = getTrainerQuestionSet("frontend", "junior", "performance-optimization");
    const systemDesignQuestions = getTrainerQuestionSet(
      "frontend",
      "junior",
      "frontend-system-design",
    );

    expect(getTrainerQuestionCount()).toBe(600);
    expect(questions).toHaveLength(20);
    expect(asyncQuestions).toHaveLength(20);
    expect(reactQuestions).toHaveLength(20);
    expect(hooksQuestions).toHaveLength(20);
    expect(typescriptQuestions).toHaveLength(20);
    expect(stateQuestions).toHaveLength(20);
    expect(nextjsQuestions).toHaveLength(20);
    expect(browserQuestions).toHaveLength(20);
    expect(performanceQuestions).toHaveLength(20);
    expect(systemDesignQuestions).toHaveLength(20);
    expect(questions[0]).toEqual({
      question: "Что такое JavaScript?",
      answers: [
        "Язык разметки",
        "Язык программирования",
        "База данных",
        "CSS-фреймворк",
      ],
      correctAnswer: 1,
    });
    expect(questions[19]).toEqual({
      question: "Что делает addEventListener?",
      answers: [
        "Удаляет событие",
        "Добавляет обработчик события",
        "Создаёт Promise",
        "Обновляет DOM",
      ],
      correctAnswer: 1,
    });
    expect(asyncQuestions[0]).toEqual({
      question: "Что такое Event Loop?",
      answers: [
        "Механизм выполнения CSS-анимаций",
        "Механизм, который координирует call stack, task queue и microtask queue",
        "Метод для перебора массива",
        "Встроенный таймер браузера",
      ],
      correctAnswer: 1,
    });
    expect(asyncQuestions[19]).toEqual({
      question: "Для чего нужен AbortController?",
      answers: [
        "Для отмены fetch-запроса и связанных async-операций",
        "Для запуска Promise.all",
        "Для очистки localStorage",
        "Для создания WebSocket",
      ],
      correctAnswer: 0,
    });
    expect(reactQuestions[0]).toEqual({
      question: "Что такое React?",
      answers: [
        "Backend-фреймворк",
        "Библиотека для создания UI",
        "База данных",
        "CSS-препроцессор",
      ],
      correctAnswer: 1,
    });
    expect(reactQuestions[19]).toEqual({
      question: "Что такое reconciliation?",
      answers: [
        "Процесс сравнения нового Virtual DOM со старым",
        "Очистка localStorage",
        "Сборка проекта",
        "Работа WebSocket",
      ],
      correctAnswer: 0,
    });
    expect(hooksQuestions[0]).toEqual({
      question: "Что делает useState?",
      answers: [
        "Выполняет side-effects",
        "Создаёт локальное состояние компонента",
        "Создаёт context",
        "Кэширует данные",
      ],
      correctAnswer: 1,
    });
    expect(hooksQuestions[19]).toEqual({
      question: "Почему custom hooks полезны?",
      answers: [
        "Для переиспользования логики",
        "Для изменения Virtual DOM",
        "Для ускорения браузера",
        "Для удаления props",
      ],
      correctAnswer: 0,
    });
    expect(typescriptQuestions[0]).toEqual({
      question: "Что такое TypeScript?",
      answers: [
        "CSS-фреймворк",
        "Надстройка над JavaScript с типизацией",
        "База данных",
        "Backend-runtime",
      ],
      correctAnswer: 1,
    });
    expect(typescriptQuestions[19]).toEqual({
      question: "Что такое tsconfig.json?",
      answers: [
        "Конфигурация TypeScript проекта",
        "Конфиг React Router",
        "Docker-файл",
        "Манифест браузера",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[0]).toEqual({
      question: "Что такое управление состоянием?",
      answers: [
        "Управление состоянием приложения",
        "Управление CSS",
        "Управление Docker",
        "Управление API-шлюз",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[19]).toEqual({
      question: "Какой подход считается хорошей практикой?",
      answers: [
        "Хранить state максимально близко к месту использования",
        "Делать весь state global",
        "Использовать только Redux",
        "Хранить state в localStorage всегда",
      ],
      correctAnswer: 0,
    });
    expect(nextjsQuestions[0]).toEqual({
      question: "Что такое Next.js?",
      answers: [
        "Backend-база данных",
        "React-фреймворк",
        "CSS-фреймворк",
        "Движок браузера",
      ],
      correctAnswer: 1,
    });
    expect(nextjsQuestions[19]).toEqual({
      question: "Почему Next.js популярен?",
      answers: [
        "Даёт SSR, routing, optimization и хорошую DX из коробки",
        "Полностью заменяет backend",
        "Работает без JavaScript",
        "Удаляет необходимость API",
      ],
      correctAnswer: 0,
    });
    expect(browserQuestions[0]).toEqual({
      question: "Что такое DOM?",
      answers: [
        "Модель объектов базы данных",
        "Document Object Model",
        "Динамический менеджер объектов",
        "Модуль порядка документа",
      ],
      correctAnswer: 1,
    });
    expect(browserQuestions[19]).toEqual({
      question: "Почему direct DOM manipulation редко используется в React?",
      answers: [
        "React сам управляет DOM через Virtual DOM",
        "React запрещает DOM API",
        "DOM API не работает в браузере",
        "Это удаляет state",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[0]).toEqual({
      question: "Что такое performance optimization?",
      answers: [
        "Оптимизация производительности приложения",
        "Оптимизация CSS цветов",
        "Работа с database",
        "Настройка Docker",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[19]).toEqual({
      question: "Почему оптимизация важна?",
      answers: [
        "Улучшает UX и скорость работы приложения",
        "Только для SEO",
        "Только для backend",
        "Только для CSS",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[0]).toEqual({
      question: "Что такое frontend-архитектура?",
      answers: [
        "Структура frontend-приложения",
        "Схема базы данных",
        "CSS-анимация",
        "Движок браузера",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[19]).toEqual({
      question: "Что считается хорошей frontend архитектурой?",
      answers: [
        "Масштабируемая, читаемая и поддерживаемая структура",
        "Один файл на всё приложение",
        "Только global state",
        "Только inline styles",
      ],
      correctAnswer: 0,
    });
  });

  test("contains the requested Frontend Middle question sets", () => {
    const javascriptQuestions = getTrainerQuestionSet("frontend", "middle", "javascript-basics");
    const asyncQuestions = getTrainerQuestionSet("frontend", "middle", "async-await-event-loop");
    const reactQuestions = getTrainerQuestionSet("frontend", "middle", "react-basics");
    const hooksQuestions = getTrainerQuestionSet("frontend", "middle", "react-hooks");
    const typescriptQuestions = getTrainerQuestionSet("frontend", "middle", "typescript");
    const stateQuestions = getTrainerQuestionSet("frontend", "middle", "state-management");
    const nextjsQuestions = getTrainerQuestionSet("frontend", "middle", "nextjs");
    const browserQuestions = getTrainerQuestionSet("frontend", "middle", "browser-dom");
    const performanceQuestions = getTrainerQuestionSet("frontend", "middle", "performance-optimization");
    const systemDesignQuestions = getTrainerQuestionSet(
      "frontend",
      "middle",
      "frontend-system-design",
    );

    expect(javascriptQuestions).toHaveLength(20);
    expect(asyncQuestions).toHaveLength(20);
    expect(reactQuestions).toHaveLength(20);
    expect(hooksQuestions).toHaveLength(20);
    expect(typescriptQuestions).toHaveLength(20);
    expect(stateQuestions).toHaveLength(20);
    expect(nextjsQuestions).toHaveLength(20);
    expect(browserQuestions).toHaveLength(20);
    expect(performanceQuestions).toHaveLength(20);
    expect(systemDesignQuestions).toHaveLength(20);
    expect(javascriptQuestions[0]).toEqual({
      question: "Что такое hoisting?",
      answers: [
        "Поднятие объявлений переменных и функций во время компиляции",
        "Удаление переменных",
        "Асинхронный рендеринг",
        "Работа event loop",
      ],
      correctAnswer: 0,
    });
    expect(javascriptQuestions[19]).toEqual({
      question: "Почему mutation объектов может быть проблемой в React?",
      answers: [
        "React опирается на сравнение ссылок",
        "Mutation быстрее render",
        "React удаляет мутированные объекты",
        "Mutation запрещён в JavaScript",
      ],
      correctAnswer: 0,
    });
    expect(asyncQuestions[0]).toEqual({
      question: "Что произойдёт с microtasks после завершения macrotask?",
      answers: [
        "Выполнятся все microtasks перед следующей macrotask",
        "Будет выполнена только одна microtask",
        "Event Loop остановится",
        "Выполнится render браузера раньше microtasks",
      ],
      correctAnswer: 0,
    });
    expect(asyncQuestions[19]).toEqual({
      question: "Что считается хорошей практикой при async-программировании?",
      answers: [
        "Обрабатывать ошибки и избегать блокировки main thread",
        "Использовать вложенные callbacks везде",
        "Хранить Promise без await",
        "Делать тяжёлые синхронные циклы",
      ],
      correctAnswer: 0,
    });
    expect(reactQuestions[0]).toEqual({
      question: "Что такое reconciliation в React?",
      answers: [
        "Процесс сравнения Virtual DOM",
        "CSS-оптимизация",
        "Браузерный рендеринг",
        "Разрешение Promise",
      ],
      correctAnswer: 0,
    });
    expect(reactQuestions[19]).toEqual({
      question: "Что считается хорошей React архитектурой?",
      answers: [
        "Предсказуемые, переиспользуемые и масштабируемые компоненты",
        "Один большой компонент",
        "Global state для всего",
        "Business logic прямо в UI повсюду",
      ],
      correctAnswer: 0,
    });
    expect(hooksQuestions[0]).toEqual({
      question: "Почему условный вызов hooks — проблема?",
      answers: [
        "React Hooks order должен быть одинаковым между render",
        "React не поддерживает if",
        "useEffect ломает state",
        "Потому что hooks асинхронные",
      ],
      correctAnswer: 0,
    });
    expect(hooksQuestions[19]).toEqual({
      question: "Что считается хорошей практикой при работе с hooks?",
      answers: [
        "Минимизировать side-effects и держать hooks предсказуемыми",
        "Вызывать hooks условно",
        "Хранить всё в Context",
        "Использовать useEffect для всего",
      ],
      correctAnswer: 0,
    });
    expect(typescriptQuestions[0]).toEqual({
      question: "Почему any считается плохой практикой?",
      answers: [
        "Отключает type safety",
        "Ломает JavaScript",
        "Не работает в React",
        "Удаляет runtime",
      ],
      correctAnswer: 0,
    });
    expect(typescriptQuestions[19]).toEqual({
      question: "Что считается хорошей практикой в TypeScript?",
      answers: [
        "Максимально strict и предсказуемую типизацию",
        "Использовать any везде",
        "Не использовать interface",
        "Хранить типы в только в components",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[0]).toEqual({
      question: "Когда Context API становится плохим решением?",
      answers: [
        "При часто изменяемом глобальном state",
        "Для theme provider",
        "Для auth user",
        "Для static config",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[19]).toEqual({
      question: "Что считается хорошей практикой в управление состоянием?",
      answers: [
        "Держать state предсказуемым, нормализованным и масштабируемым",
        "Mutation повсюду",
        "Global state для всех inputs",
        "API-запросы внутри reducers",
      ],
      correctAnswer: 0,
    });
    expect(nextjsQuestions[0]).toEqual({
      question: "Когда SSR предпочтительнее CSR?",
      answers: [
        "Для SEO и dynamic server-side data",
        "Для static icons only",
        "Для CSS-анимацияs",
        "Для localStorage",
      ],
      correctAnswer: 0,
    });
    expect(nextjsQuestions[19]).toEqual({
      question: "Что считается хорошей практикой в Next.js-архитектурой?",
      answers: [
        "Правильно комбинировать SSR/SSG/CSR в зависимости от сценария",
        "Делать всё через CSR",
        "Делать всё через SSR",
        "Хранить всю логику в page.tsx",
      ],
      correctAnswer: 0,
    });
    expect(browserQuestions[0]).toEqual({
      question: "Что такое event delegation?",
      answers: [
        "Обработка событий через общего родителя",
        "Удаление event listeners",
        "CSS-наследование",
        "Кэш браузера",
      ],
      correctAnswer: 0,
    });
    expect(browserQuestions[19]).toEqual({
      question: "Что считается хорошей практикой при работе с DOM?",
      answers: [
        "Минимизировать layout thrashing и очищать listeners",
        "Читать offsetHeight после каждого style change",
        "Хранить весь state в DOM attributes",
        "Использовать DOM-мутация вместо React state",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[0]).toEqual({
      question: "Что чаще всего вызывает лишние re-render в React?",
      answers: [
        "Новые ссылки на objects/functions",
        "CSS-модули",
        "HTML-атрибуты",
        "localStorage",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[19]).toEqual({
      question: "Что считается хорошей performance strategy?",
      answers: [
        "Минимизировать re-render, bundle size и expensive DOM-операцияs",
        "Memoize всё подряд",
        "Хранить всё в global state",
        "Делать всё через useEffect",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[0]).toEqual({
      question: "Что такое feature-sliced architecture?",
      answers: [
        "Разделение проекта по бизнес-фичам",
        "CSS-методология",
        "Браузерный рендеринг",
        "Database normalization",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[19]).toEqual({
      question: "Что считается хорошей frontend-архитектура?",
      answers: [
        "Предсказуемая, модульная, масштабируемая и поддерживаемая структура",
        "Один global store для всего",
        "Business logic прямо в UI повсюду",
        "Один файл на всё приложение",
      ],
      correctAnswer: 0,
    });
  });

  test("contains the requested Frontend Senior question sets", () => {
    const javascriptQuestions = getTrainerQuestionSet("frontend", "senior", "javascript-basics");
    const asyncQuestions = getTrainerQuestionSet("frontend", "senior", "async-await-event-loop");
    const reactQuestions = getTrainerQuestionSet("frontend", "senior", "react-basics");
    const hooksQuestions = getTrainerQuestionSet("frontend", "senior", "react-hooks");
    const typescriptQuestions = getTrainerQuestionSet("frontend", "senior", "typescript");
    const stateQuestions = getTrainerQuestionSet("frontend", "senior", "state-management");
    const nextjsQuestions = getTrainerQuestionSet("frontend", "senior", "nextjs");
    const browserQuestions = getTrainerQuestionSet("frontend", "senior", "browser-dom");
    const performanceQuestions = getTrainerQuestionSet(
      "frontend",
      "senior",
      "performance-optimization",
    );
    const systemDesignQuestions = getTrainerQuestionSet(
      "frontend",
      "senior",
      "frontend-system-design",
    );

    expect(javascriptQuestions).toHaveLength(20);
    expect(asyncQuestions).toHaveLength(20);
    expect(reactQuestions).toHaveLength(20);
    expect(hooksQuestions).toHaveLength(20);
    expect(typescriptQuestions).toHaveLength(20);
    expect(stateQuestions).toHaveLength(20);
    expect(nextjsQuestions).toHaveLength(20);
    expect(browserQuestions).toHaveLength(20);
    expect(performanceQuestions).toHaveLength(20);
    expect(systemDesignQuestions).toHaveLength(20);
    expect(javascriptQuestions[0]).toEqual({
      question: "Почему event loop может стать bottleneck в frontend приложении?",
      answers: [
        "JavaScript выполняется в одном потоке",
        "Потому что Promise синхронные",
        "Потому что DOM асинхронный",
        "Потому что browser не использует threads",
      ],
      correctAnswer: 0,
    });
    expect(javascriptQuestions[19]).toEqual({
      question: "Что считается хорошей практикой для large-scale JavaScript?",
      answers: [
        "Predictable immutable architecture с минимизацией side-effects",
        "Mutation повсюду",
        "Global variables",
        "Heavy sync computations on main thread",
      ],
      correctAnswer: 0,
    });
    expect(asyncQuestions[0]).toEqual({
      question: "Почему тяжёлый синхронный код опасен для frontend?",
      answers: [
        "Блокирует main thread и UI responsiveness",
        "Удаляет microtasks",
        "Ломает Promise",
        "Отключает browser rendering",
      ],
      correctAnswer: 0,
    });
    expect(asyncQuestions[19]).toEqual({
      question: "Что считается хорошей async-архитектурой?",
      answers: [
        "Предсказуемые async-flows с cancellation, error handling и контролем backpressure",
        "Вложенные callbacks повсюду",
        "Игнорирование Promise rejection",
        "Бесконечные цепочки microtasks",
      ],
      correctAnswer: 0,
    });
    expect(reactQuestions[0]).toEqual({
      question: "Почему reconciliation может становиться bottleneck?",
      answers: [
        "Большие операции diff для subtree",
        "CSS-модули",
        "Кэш браузера",
        "localStorage",
      ],
      correctAnswer: 0,
    });
    expect(reactQuestions[19]).toEqual({
      question: "Что считается хорошей React-архитектуре?",
      answers: [
        "Предсказуемый render, изолированный state и масштабируемые границы компонентов",
        "Global Context для всего",
        "Heavy business logic inside render",
        "Анонимные inline-функции и объекты повсюду",
      ],
      correctAnswer: 0,
    });
    expect(hooksQuestions[0]).toEqual({
      question: "Почему excessive useEffect использования считается smell?",
      answers: [
        "Часто указывает на неправильную архитектуру state/data flow",
        "useEffect deprecated",
        "Browser не оптимизирует useEffect",
        "Hooks async only",
      ],
      correctAnswer: 0,
    });
    expect(hooksQuestions[19]).toEqual({
      question: "Что считается хорошей hooks architecture?",
      answers: [
        "Предсказуемые изолированные effects и переиспользуемые stateful-абстракции",
        "useEffect для всей логики приложения",
        "Global Context для всего state",
        "Conditional hooks everywhere",
      ],
      correctAnswer: 0,
    });
    expect(typescriptQuestions[0]).toEqual({
      question: "Почему any считается dangerous в large-scale системах?",
      answers: [
        "Разрушает гарантии типов и масштабируемую архитектуру типизации",
        "Падение браузера",
        "Удаляет runtime-валидация",
        "Ломает JSX",
      ],
      correctAnswer: 0,
    });
    expect(typescriptQuestions[19]).toEqual({
      question: "Что считается хорошей практикой в enterprise TypeScript-приложениях?",
      answers: [
        "Максимально explicit scalable typing с runtime-валидация границами",
        "Использовать any для скорости",
        "Хранить типы внутри только в components",
        "Избегать generics completely",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[0]).toEqual({
      question: "Почему чрезмерный global state считается anti-pattern?",
      answers: [
        "Увеличивает coupling и лишние re-render",
        "React требует localStorage",
        "Падение браузера",
        "Удаляет memoization",
      ],
      correctAnswer: 0,
    });
    expect(stateQuestions[19]).toEqual({
      question: "Что считается хорошей управление состоянием architecture?",
      answers: [
        "Predictable isolated scalable state границами",
        "Один огромный global store для всего",
        "Shared mutable state повсюду",
        "Side-effects прямо внутри reducers",
      ],
      correctAnswer: 0,
    });
    expect(nextjsQuestions[0]).toEqual({
      question: "Почему полный SSR может быть expensive?",
      answers: [
        "Высокая нагрузка на сервер и задержка TTFB",
        "Browser не поддерживает SSR",
        "React не оптимизирован для SSR",
        "CSS перестаёт работать",
      ],
      correctAnswer: 0,
    });
    expect(nextjsQuestions[19]).toEqual({
      question: "Что считается хорошей Next.js-архитектурой?",
      answers: [
        "Сбалансированные SSR/SSG/RSC/client границами под конкретный сценарий",
        "Full CSR для всего",
        "Full SSR для всего",
        "Всё приложение внутри одного client component",
      ],
      correctAnswer: 0,
    });
    expect(browserQuestions[0]).toEqual({
      question: "Почему forced synchronous layout считается expensive?",
      answers: [
        "Browser вынужден немедленно пересчитывать layout",
        "React отключает batching",
        "DOM перестаёт обновляться",
        "CSS-модули ломаются",
      ],
      correctAnswer: 0,
    });
    expect(browserQuestions[19]).toEqual({
      question: "Что считается хорошей DOM/performance strategy?",
      answers: [
        "Минимизировать layout thrashing, repaint и удержание памяти",
        "Direct DOM-мутацияs everywhere",
        "Огромные DOM-деревья",
        "Частые синхронные измерения",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[0]).toEqual({
      question: "Что чаще всего становится bottleneck в больших React-приложениях?",
      answers: [
        "Excessive лишние re-render",
        "CSS-переменные",
        "HTML-атрибуты",
        "localStorage",
      ],
      correctAnswer: 0,
    });
    expect(performanceQuestions[19]).toEqual({
      question: "Что считается хорошей frontend performance strategy?",
      answers: [
        "Minimize rendering/layout/сеть/memory overhead based on profiling",
        "Слепо memoize всё подряд",
        "Всегда рендерить весь набор данных",
        "Тяжёлая синхронная работа во время render",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[0]).toEqual({
      question: "Что считается главным признаком плохой frontend-архитектура?",
      answers: [
        "Tight coupling между feature modules",
        "CSS-модули",
        "Разделение на уровне роутов",
        "Lazy loading",
      ],
      correctAnswer: 0,
    });
    expect(systemDesignQuestions[19]).toEqual({
      question: "Что считается хорошей enterprise frontend-архитектура?",
      answers: [
        "Clear границами + isolated domains + predictable data/render flows",
        "Shared mutable state повсюду",
        "UI tightly coupled with сетьing/business logic",
        "Одно монолитное дерево компонентов",
      ],
      correctAnswer: 0,
    });
  });

  test("keeps researched source metadata for future refill", () => {
    expect(trainerQuestionResearchSources.length).toBeGreaterThanOrEqual(7);
    expect(
      trainerQuestionResearchSources.every(
        (source) =>
          source.title.length > 0 &&
          source.url.startsWith("https://") &&
          source.license.length > 0 &&
          source.coverage.length > 0,
      ),
    ).toBe(true);
  });

  test("builds an all-questions pool for generated self-check tests", () => {
    const questions = getTrainerQuestionPool();

    expect(questions).toHaveLength(600);
    expect(questions).toHaveLength(getTrainerQuestionCount());
    expect(questions[0]).toEqual(getTrainerQuestionSet("frontend", "junior", "javascript-basics")[0]);
    expect(questions[questions.length - 1]).toEqual(
      getTrainerQuestionSet("frontend", "senior", "frontend-system-design")[19],
    );
  });

  test("keeps 10 topics per specialty and only fills requested topic-grade pair", () => {
    for (const specialty of trainerSpecialties) {
      expect(trainerTopics[specialty]).toHaveLength(10);

      for (const topic of trainerTopics[specialty]) {
        for (const grade of trainerGrades) {
          const questions = getTrainerQuestionSet(specialty, grade, topic.id);

          if (isFilledTopicGrade(specialty, grade, topic.id)) {
            expect(questions).toHaveLength(20);
          } else {
            expect(questions).toHaveLength(0);
          }
        }
      }
    }
  });

  test("has four answers and valid correct answer indexes", () => {
    const questions = trainerSpecialties.flatMap((specialty) =>
      trainerGrades.flatMap((grade) =>
        trainerTopics[specialty].flatMap((topic) =>
          getTrainerQuestionSet(specialty, grade, topic.id),
        ),
      ),
    );

    expect(questions.every((question) => question.answers.length === 4)).toBe(true);
    expect(
      questions.every(
        (question) =>
          Number.isInteger(question.correctAnswer) &&
          question.correctAnswer >= 0 &&
          question.correctAnswer < question.answers.length,
      ),
    ).toBe(true);
  });
});

function isFilledTopicGrade(
  specialty: string,
  grade: string,
  topicId: string,
) {
  if (specialty === "frontend" && grade === "junior") {
    return [
      "javascript-basics",
      "async-await-event-loop",
      "react-basics",
      "react-hooks",
      "typescript",
      "state-management",
      "nextjs",
      "browser-dom",
      "performance-optimization",
      "frontend-system-design",
    ].includes(topicId);
  }

  if (specialty === "frontend" && grade === "middle") {
    return [
      "javascript-basics",
      "async-await-event-loop",
      "react-basics",
      "react-hooks",
      "typescript",
      "state-management",
      "nextjs",
      "browser-dom",
      "performance-optimization",
      "frontend-system-design",
    ].includes(topicId);
  }

  if (specialty === "frontend" && grade === "senior") {
    return [
      "javascript-basics",
      "async-await-event-loop",
      "react-basics",
      "react-hooks",
      "typescript",
      "state-management",
      "nextjs",
      "browser-dom",
      "performance-optimization",
      "frontend-system-design",
    ].includes(topicId);
  }

  return false;
}
