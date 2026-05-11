export const trainerGrades = ["junior", "middle", "senior"] as const;
export type TrainerGrade = (typeof trainerGrades)[number];

export const trainerSpecialties = ["frontend", "backend"] as const;
export type TrainerSpecialty = (typeof trainerSpecialties)[number];

export type TrainerQuestion = {
  question: string;
  answers: string[];
  correctAnswer: number;
};

export type TrainerTopic = {
  id: string;
  specialty: TrainerSpecialty;
  title: string;
};

export type TrainerQuestionResearchSource = {
  title: string;
  url: string;
  license: string;
  coverage: string;
};

type TrainerQuestionBank = {
  [Specialty in TrainerSpecialty]?: {
    [Grade in TrainerGrade]?: Record<string, readonly TrainerQuestion[]>;
  };
};

export const trainerQuestionResearchSources: TrainerQuestionResearchSource[] = [
  {
    title: "Front End Interview Handbook",
    url: "https://github.com/yangshun/front-end-interview-handbook",
    license: "MIT",
    coverage: "JavaScript, DOM, browser, frontend system design and frontend interview formats",
  },
  {
    title: "Lydia Hallie JavaScript Questions",
    url: "https://github.com/lydiahallie/javascript-questions",
    license: "MIT",
    coverage: "JavaScript edge cases, coercion, closures, promises and runtime behavior",
  },
  {
    title: "Sudheer Jonna ReactJS Interview Questions",
    url: "https://github.com/sudheerj/reactjs-interview-questions",
    license: "MIT",
    coverage: "React, hooks, state, rendering and performance interview topics",
  },
  {
    title: "Tech Interview Handbook",
    url: "https://github.com/yangshun/tech-interview-handbook",
    license: "MIT",
    coverage: "BigTech-style interview structure, seniority expectations and system design prep",
  },
  {
    title: "The System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    license: "CC BY 4.0",
    coverage: "Scalability, caching, queues, databases, availability and system design trade-offs",
  },
  {
    title: "Node.js Interview Questions",
    url: "https://github.com/aswanth6000/nodejs-interview-questions",
    license: "MIT",
    coverage: "Node.js runtime, event loop, streams, clustering, security and backend patterns",
  },
  {
    title: "Awesome Interviews",
    url: "https://github.com/DopplerHQ/awesome-interview-questions",
    license: "CC0",
    coverage: "Curated directory for Docker, Postgres, SQL, Redis, Node.js and frontend question banks",
  },
];

export const trainerTopics: Record<TrainerSpecialty, TrainerTopic[]> = {
  frontend: [
    { id: "javascript-basics", specialty: "frontend", title: "JavaScript Basics" },
    { id: "async-await-event-loop", specialty: "frontend", title: "Async/Await & Event Loop" },
    { id: "react-basics", specialty: "frontend", title: "React Basics" },
    { id: "react-hooks", specialty: "frontend", title: "React Hooks" },
    { id: "typescript", specialty: "frontend", title: "TypeScript" },
    { id: "state-management", specialty: "frontend", title: "State Management" },
    { id: "nextjs", specialty: "frontend", title: "Next.js" },
    { id: "browser-dom", specialty: "frontend", title: "Browser & DOM" },
    { id: "performance-optimization", specialty: "frontend", title: "Performance Optimization" },
    { id: "frontend-system-design", specialty: "frontend", title: "Frontend System Design" },
  ],
  backend: [
    { id: "nodejs-basics", specialty: "backend", title: "Node.js Basics" },
    { id: "express-nestjs", specialty: "backend", title: "Express / NestJS" },
    { id: "rest-api", specialty: "backend", title: "REST API" },
    { id: "authentication-jwt", specialty: "backend", title: "Authentication & JWT" },
    { id: "postgresql", specialty: "backend", title: "PostgreSQL" },
    { id: "redis-caching", specialty: "backend", title: "Redis & Caching" },
    { id: "kafka-rabbitmq", specialty: "backend", title: "Kafka / RabbitMQ" },
    { id: "docker-cicd", specialty: "backend", title: "Docker & CI/CD" },
    { id: "scalability-highload", specialty: "backend", title: "Scalability & Highload" },
    { id: "backend-system-design", specialty: "backend", title: "Backend System Design" },
  ],
};

const topicQuestionBank: TrainerQuestionBank = {
  frontend: {
    junior: {
      "javascript-basics": [
        {
          question: "Что такое JavaScript?",
          answers: [
            "Язык разметки",
            "Язык программирования",
            "База данных",
            "CSS-фреймворк",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какой тип данных является примитивом?",
          answers: ["Object", "Array", "String", "Function"],
          correctAnswer: 2,
        },
        {
          question: "Что вернёт typeof null?",
          answers: ['"null"', '"object"', '"undefined"', '"boolean"'],
          correctAnswer: 1,
        },
        {
          question: "Что такое NaN?",
          answers: ["Ошибка", "Null object", "Not a Number", "Empty value"],
          correctAnswer: 2,
        },
        {
          question: "Как объявить переменную с возможностью изменения значения?",
          answers: ["const", "define", "let", "static"],
          correctAnswer: 2,
        },
        {
          question: "Что делает === ?",
          answers: [
            "Сравнивает только значения",
            "Сравнивает значения и типы",
            "Присваивает значение",
            "Проверяет null",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что вернёт Boolean([])?",
          answers: ["false", "undefined", "true", "null"],
          correctAnswer: 2,
        },
        {
          question: 'Какой результат будет у:\n\n"5" + 2',
          answers: ["7", '"52"', "undefined", "NaN"],
          correctAnswer: 1,
        },
        {
          question: "Что такое undefined?",
          answers: [
            "Ошибка выполнения",
            "Значение отсутствующей переменной",
            "Пустой объект",
            "Null reference",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как проверить массив?",
          answers: [
            'typeof arr === "array"',
            "arr instanceof Object",
            "Array.isArray(arr)",
            "arr.isArray()",
          ],
          correctAnswer: 2,
        },
        {
          question: "Что делает map()?",
          answers: [
            "Изменяет объект",
            "Создаёт новый массив",
            "Удаляет элементы",
            "Сортирует массив",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какой метод добавляет элемент в конец массива?",
          answers: ["shift()", "pop()", "push()", "concat()"],
          correctAnswer: 2,
        },
        {
          question: "Что вернёт typeof undefined?",
          answers: ['"null"', '"object"', '"undefined"', '"boolean"'],
          correctAnswer: 2,
        },
        {
          question: "Что делает JSON.stringify()?",
          answers: [
            "Парсит JSON",
            "Преобразует объект в строку",
            "Клонирует объект",
            "Валидирует JSON",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какой цикл перебирает элементы массива?",
          answers: ["for...of", "switch", "while object", "define"],
          correctAnswer: 0,
        },
        {
          question: "Что такое callback function?",
          answers: [
            "Функция внутри массива",
            "Функция, переданная в другую функцию",
            "Асинхронный объект",
            "Promise",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает filter()?",
          answers: [
            "Возвращает первый элемент",
            "Фильтрует массив",
            "Удаляет объект",
            "Сортирует массив",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как получить длину массива?",
          answers: ["arr.size", "arr.count", "arr.length", "arr.len()"],
          correctAnswer: 2,
        },
        {
          question: "Что такое closure?",
          answers: [
            "Ошибка области видимости",
            "Функция с доступом к внешней области видимости",
            "Метод массива",
            "Тип данных",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает addEventListener?",
          answers: [
            "Удаляет событие",
            "Добавляет обработчик события",
            "Создаёт Promise",
            "Обновляет DOM",
          ],
          correctAnswer: 1,
        },
      ],
      "async-await-event-loop": [
        {
          question: "Что такое Event Loop?",
          answers: [
            "Механизм выполнения CSS-анимаций",
            "Механизм, который координирует call stack, task queue и microtask queue",
            "Метод для перебора массива",
            "Встроенный таймер браузера",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что вернёт async function всегда?",
          answers: ["Object", "Promise", "undefined", "Callback"],
          correctAnswer: 1,
        },
        {
          question: "Что делает await?",
          answers: [
            "Блокирует весь браузерный поток навсегда",
            "Ожидает выполнение Promise внутри async-функции",
            "Создаёт новый Promise без выполнения кода",
            "Переводит функцию в sync-режим",
          ],
          correctAnswer: 1,
        },
        {
          question: "В каком порядке выполняются microtasks относительно macrotasks?",
          answers: [
            "После каждой macrotask выполняются все microtasks",
            "Microtasks выполняются только после setTimeout",
            "Macrotasks всегда выполняются раньше callbacks Promise",
            "Microtasks выполняются только при перезагрузке страницы",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что относится к microtask queue?",
          answers: ["setTimeout", "setInterval", "Promise.then", "click event"],
          correctAnswer: 2,
        },
        {
          question: "Что относится к macrotask queue?",
          answers: [
            "Promise.then",
            "queueMicrotask",
            "MutationObserver",
            "setTimeout",
          ],
          correctAnswer: 3,
        },
        {
          question: 'Что выведется первым?\n\nsetTimeout(() => console.log("timeout"), 0);\nPromise.resolve().then(() => console.log("promise"));\nconsole.log("sync");',
          answers: ["timeout", "promise", "sync", "Ошибка"],
          correctAnswer: 2,
        },
        {
          question: 'Какой полный порядок вывода?\n\nsetTimeout(() => console.log("timeout"), 0);\nPromise.resolve().then(() => console.log("promise"));\nconsole.log("sync");',
          answers: [
            "sync → promise → timeout",
            "promise → sync → timeout",
            "timeout → promise → sync",
            "sync → timeout → promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что произойдёт при throw внутри async function?",
          answers: [
            "Ошибка исчезнет",
            "Вернётся rejected Promise",
            "Вернётся resolved Promise",
            "Код станет синхронным",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как правильно обработать ошибку в async/await?",
          answers: ["try/catch", "if/else", "switch", "forEach"],
          correctAnswer: 0,
        },
        {
          question: "Что делает Promise.all?",
          answers: [
            "Выполняет промисы строго по одному",
            "Ждёт выполнения всех Promise или падает при первом reject",
            "Игнорирует ошибки",
            "Возвращает только первый успешный результат",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает Promise.race?",
          answers: [
            "Ждёт самый долгий Promise",
            "Возвращает результат первого завершившегося Promise",
            "Выполняет только rejected Promise",
            "Запускает Promise заново",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает Promise.allSettled?",
          answers: [
            "Ждёт все Promise и возвращает статусы fulfilled/rejected",
            "Падает при первом reject",
            "Возвращает только fulfilled значения",
            "Отменяет все Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что будет, если await использовать вне async-функции в обычном скрипте?",
          answers: [
            "Всегда сработает",
            "Может быть SyntaxError, если это не module/top-level await окружение",
            "Автоматически создаст async function",
            "Превратится в Promise.then",
          ],
          correctAnswer: 1,
        },
        {
          question: "Почему await внутри цикла может быть проблемой?",
          answers: [
            "Он всегда ломает цикл",
            "Он может выполнять асинхронные операции последовательно вместо параллельного запуска",
            "Он удаляет элементы массива",
            "Он блокирует CSS",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как запустить несколько независимых async-операций параллельно?",
          answers: ["await внутри for", "Promise.all([...])", "setInterval", "JSON.parse"],
          correctAnswer: 1,
        },
        {
          question: "Что произойдёт с кодом после await?",
          answers: [
            "Он продолжится как microtask после завершения Promise",
            "Он выполнится до текущего синхронного кода",
            "Он попадёт в setTimeout",
            "Он никогда не выполнится",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое call stack?",
          answers: [
            "Очередь HTTP-запросов",
            "Стек вызовов синхронного кода",
            "Хранилище Promise",
            "Очередь DOM-событий",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что будет, если call stack занят долгим синхронным циклом?",
          answers: [
            "Event Loop продолжит обрабатывать клики и таймеры",
            "UI может зависнуть, а задачи из очередей будут ждать",
            "Promise.then выполнится параллельно",
            "setTimeout выполнится раньше синхронного кода",
          ],
          correctAnswer: 1,
        },
        {
          question: "Для чего нужен AbortController?",
          answers: [
            "Для отмены fetch-запроса и связанных async-операций",
            "Для запуска Promise.all",
            "Для очистки localStorage",
            "Для создания WebSocket",
          ],
          correctAnswer: 0,
        },
      ],
      "react-basics": [
        {
          question: "Что такое React?",
          answers: [
            "Backend-фреймворк",
            "Библиотека для создания UI",
            "База данных",
            "CSS-препроцессор",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое JSX?",
          answers: [
            "Парсер JSON",
            "Синтаксическое расширение JavaScript для описания UI",
            "CSS-фреймворк",
            "Компилятор TypeScript",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как React обновляет UI?",
          answers: [
            "Полностью перезагружает страницу",
            "Через Virtual DOM и reconciliation",
            "Через SQL-запросы",
            "Через WebSocket",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое component в React?",
          answers: [
            "SQL-модель",
            "Переиспользуемая часть интерфейса",
            "CSS-класс",
            "Обработчик события",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое props?",
          answers: [
            "Локальное состояние",
            "Данные, передаваемые компоненту",
            "Глобальный store",
            "DOM-события",
          ],
          correctAnswer: 1,
        },
        {
          question: "Можно ли изменять props внутри компонента?",
          answers: ["Да", "Нет", "Только в class components", "Только через useEffect"],
          correctAnswer: 1,
        },
        {
          question: "Что такое state?",
          answers: [
            "CSS-состояние",
            "Внутреннее состояние компонента",
            "Тип пропсов",
            "DOM-узел",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какой hook используется для локального state?",
          answers: ["useFetch", "useState", "useEffect", "useMemo"],
          correctAnswer: 1,
        },
        {
          question: "Что вызывает re-render компонента?",
          answers: [
            "Изменение state или props",
            "Любой console.log",
            "Изменение CSS",
            "JSON.stringify",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего нужен key при рендере списка?",
          answers: [
            "Для стилизации",
            "Для оптимального reconciliation элементов",
            "Для API-запросов",
            "Для управление состоянием",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что произойдёт при использовании index как key?",
          answers: [
            "Всегда безопасно",
            "Может приводить к багам при изменении порядка элементов",
            "Улучшает производительность",
            "Отключает re-render",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает useEffect?",
          answers: [
            "Создаёт state",
            "Выполняет side-effects",
            "Кэширует данные",
            "Создаёт context",
          ],
          correctAnswer: 1,
        },
        {
          question: "Когда выполняется useEffect без dependency array?",
          answers: [
            "Только при mount",
            "После каждого render",
            "Только при unmount",
            "Никогда",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает dependency array в useEffect?",
          answers: [
            "Управляет условиями выполнения эффекта",
            "Хранит state",
            "Создаёт reducer",
            "Управляет routing",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useMemo?",
          answers: [
            "Выполняет side-effects",
            "Кэширует вычисленное значение",
            "Создаёт ref",
            "Управляет формой",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает useCallback?",
          answers: [
            "Кэширует функцию",
            "Кэширует state",
            "Создаёт DOM-узел",
            "Удаляет render",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое controlled component?",
          answers: [
            "Компонент без state",
            "Компонент, где значение input управляется React state",
            "CSS-компонент",
            "Серверный компонент",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое lifting state up?",
          answers: [
            "Удаление state",
            "Поднятие state в родительский компонент",
            "Кэширование state",
            "SSR-рендеринг",
          ],
          correctAnswer: 1,
        },
        {
          question: "Почему direct mutation state — плохая практика?",
          answers: [
            "React может не заметить изменения",
            "Это ускоряет render",
            "Это обязательно вызывает crash",
            "React автоматически запрещает mutation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое reconciliation?",
          answers: [
            "Процесс сравнения нового Virtual DOM со старым",
            "Очистка localStorage",
            "Сборка проекта",
            "Работа WebSocket",
          ],
          correctAnswer: 0,
        },
      ],
      "react-hooks": [
        {
          question: "Что делает useState?",
          answers: [
            "Выполняет side-effects",
            "Создаёт локальное состояние компонента",
            "Создаёт context",
            "Кэширует данные",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как useState обновляет state?",
          answers: ["Через mutate", "Через setter function", "Через push", "Через assign"],
          correctAnswer: 1,
        },
        {
          question: "Что возвращает useState?",
          answers: ["Object", "Array: [state, setState]", "Promise", "Function"],
          correctAnswer: 1,
        },
        {
          question: "Что делает useEffect?",
          answers: [
            "Создаёт state",
            "Выполняет side-effects после render",
            "Создаёт reducer",
            "Управляет routing",
          ],
          correctAnswer: 1,
        },
        {
          question: "Когда выполнится useEffect с []?",
          answers: [
            "После каждого render",
            "Только при mount",
            "Только при unmount",
            "Никогда",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает cleanup function в useEffect?",
          answers: [
            "Создаёт state",
            "Очищает side-effects",
            "Обновляет props",
            "Кэширует данные",
          ],
          correctAnswer: 1,
        },
        {
          question: "Для чего нужен useRef?",
          answers: [
            "Для хранения mutable значения без re-render",
            "Для создания state",
            "Для API-запросов",
            "Для memoization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Изменение ref.current вызывает re-render?",
          answers: ["Да", "Нет", "Только в StrictMode", "Только в production"],
          correctAnswer: 1,
        },
        {
          question: "Что делает useMemo?",
          answers: [
            "Кэширует вычисленное значение",
            "Создаёт state",
            "Выполняет side-effects",
            "Создаёт context",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда useMemo может быть полезен?",
          answers: [
            "Для тяжёлых вычислений",
            "Для CSS",
            "Для localStorage",
            "Для fetch без Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useCallback?",
          answers: [
            "Кэширует функцию",
            "Создаёт reducer",
            "Обновляет DOM",
            "Создаёт Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему useCallback может быть полезен?",
          answers: [
            "Чтобы избегать лишних re-render дочерних компонентов",
            "Чтобы удалять state",
            "Чтобы ускорять CSS",
            "Чтобы отключать hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useContext?",
          answers: [
            "Передаёт данные без props drilling",
            "Создаёт routing",
            "Создаёт API",
            "Создаёт reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое props drilling?",
          answers: [
            "Передача props через множество компонентов",
            "SSR-рендеринг",
            "Работа useEffect",
            "Браузерный API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useReducer?",
          answers: [
            "Управляет сложным state",
            "Выполняет fetch",
            "Управляет DOM",
            "Создаёт WebSocket",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что обычно содержит reducer function?",
          answers: ["switch(action.type)", "HTML template", "CSS rules", "Очередь Promise"],
          correctAnswer: 0,
        },
        {
          question: "Что будет при условном вызове hook?",
          answers: [
            "Это нормальная практика",
            "React Hooks order может сломаться",
            "React автоматически исправит порядок",
            "Это работает только с useEffect",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какое правило hooks является основным?",
          answers: [
            "Hooks можно вызывать где угодно",
            "Hooks нужно вызывать только на верхнем уровне компонента",
            "Hooks работают только в class components",
            "Hooks нельзя комбинировать",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое custom hook?",
          answers: [
            "Hook внутри CSS",
            "Пользовательская функция с логикой hooks",
            "Встроенный React API",
            "SSR middleware",
          ],
          correctAnswer: 1,
        },
        {
          question: "Почему custom hooks полезны?",
          answers: [
            "Для переиспользования логики",
            "Для изменения Virtual DOM",
            "Для ускорения браузера",
            "Для удаления props",
          ],
          correctAnswer: 0,
        },
      ],
      "typescript": [
        {
          question: "Что такое TypeScript?",
          answers: [
            "CSS-фреймворк",
            "Надстройка над JavaScript с типизацией",
            "База данных",
            "Backend-runtime",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает Компилятор TypeScript?",
          answers: [
            "Запускает сервер",
            "Преобразует TypeScript в JavaScript",
            "Создаёт Docker-контейнер",
            "Работает как браузер",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как объявить тип string?",
          answers: ["let name: string", "let name => string", "string name", "let string name"],
          correctAnswer: 0,
        },
        {
          question: "Какой тип у true/false?",
          answers: ["string", "object", "boolean", "number"],
          correctAnswer: 2,
        },
        {
          question: "Что означает тип any?",
          answers: [
            "Переменная может иметь любой тип",
            "Только number",
            "Только object",
            "Только string",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему any считается опасным?",
          answers: [
            "Отключает проверку типов",
            "Удаляет переменные",
            "Ломает React",
            "Замедляет браузер",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое interface?",
          answers: [
            "SQL table",
            "Описание структуры объекта",
            "React-компонент",
            "API Promise",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает optional property?",
          answers: [
            "Делает поле readonly",
            "Делает поле необязательным",
            "Удаляет поле",
            "Делает поле number",
          ],
          correctAnswer: 1,
        },
        {
          question: "Как обозначается optional field?",
          answers: ["name!", "name*", "name?", "name$"],
          correctAnswer: 2,
        },
        {
          question: "Что такое union type?",
          answers: [
            "Тип с несколькими возможными значениями",
            "SQL join",
            "Promise chain",
            "React hook",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что означает:\n\nstring | number",
          answers: [
            "Одновременно string и number",
            "string или number",
            "Только string",
            "Только number",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает readonly?",
          answers: [
            "Поле нельзя изменять",
            "Поле становится private",
            "Поле удаляется",
            "Поле становится async",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое enum?",
          answers: [
            "Способ создания списка констант",
            "React state",
            "Браузерный API",
            "Схема базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает type?",
          answers: [
            "Создаёт alias для типа",
            "Создаёт API-endpoint",
            "Создаёт Promise",
            "Создаёт CSS class",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tuple?",
          answers: [
            "Массив фиксированной структуры",
            "Promise object",
            "React-компонент",
            "Обработчик события",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что означает unknown?",
          answers: [
            "Полностью отключённая типизация",
            "Безопасная альтернатива any",
            "Только string",
            "Null object",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает as?",
          answers: [
            "Приведение типа",
            "Создание state",
            "Создание reducer",
            "Удаление type",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое generic?",
          answers: [
            "Универсальный тип-параметр",
            "Браузерный API",
            "CSS-утилита",
            "Docker-конфиг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему TypeScript полезен в больших проектах?",
          answers: [
            "Улучшает читаемость и уменьшает количество ошибок",
            "Удаляет backend",
            "Ускоряет интернет",
            "Отключает runtime errors",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tsconfig.json?",
          answers: [
            "Конфигурация TypeScript проекта",
            "Конфиг React Router",
            "Docker-файл",
            "Манифест браузера",
          ],
          correctAnswer: 0,
        },
      ],
      "state-management": [
        {
          question: "Что такое управление состоянием?",
          answers: [
            "Управление состоянием приложения",
            "Управление CSS",
            "Управление Docker",
            "Управление API-шлюз",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое local state?",
          answers: [
            "State внутри конкретного компонента",
            "State сервера",
            "Состояние базы данных",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Какой hook обычно используется для local state?",
          answers: ["useEffect", "useMemo", "useState", "useContext"],
          correctAnswer: 2,
        },
        {
          question: "Что такое global state?",
          answers: [
            "State, доступный нескольким компонентам",
            "CSS-переменные",
            "Хранилище браузера",
            "HTML-состояние",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда global state действительно нужен?",
          answers: [
            "Когда данные используются в разных частях приложения",
            "Для любого input",
            "Для console.log",
            "Для CSS-анимация",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое props drilling?",
          answers: [
            "Передача props через множество уровней компонентов",
            "Оптимизация браузера",
            "SSR-рендеринг",
            "Цепочка Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Какой hook помогает уменьшить props drilling?",
          answers: ["useContext", "useEffect", "useRef", "useMemo"],
          correctAnswer: 0,
        },
        {
          question: "Что делает Context API?",
          answers: [
            "Позволяет делиться данными между компонентами",
            "Управляет CSS",
            "Создаёт backend API",
            "Управляет DOM напрямую",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое Redux?",
          answers: [
            "Библиотека для управления состоянием",
            "CSS-фреймворк",
            "Движок браузера",
            "HTTP-клиент",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое store в Redux?",
          answers: [
            "Центральное хранилище state",
            "SQL-база данных",
            "Хранилище браузера",
            "Docker-контейнер",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое action в Redux?",
          answers: [
            "Объект, описывающий изменение state",
            "HTML-элемент",
            "Событие браузера",
            "API-ответ",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает reducer?",
          answers: [
            "Изменяет state на основе action",
            "Делает fetch",
            "Управляет DOM",
            "Кэширует данные",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему mutation state в Redux — плохая практика?",
          answers: [
            "Это может ломать predictable updates",
            "Это ускоряет render",
            "Это обязательно вызывает crash",
            "Это отключает hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое Zustand?",
          answers: [
            "Лёгкая библиотека управление состоянием",
            "CSS-препроцессор",
            "React Router",
            "ORM для базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое React Query / TanStack Query?",
          answers: [
            "Библиотека для server управление состоянием",
            "CSS-фреймворк",
            "Браузерный API",
            "Middleware Redux",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем server state отличается от client state?",
          answers: [
            "Server state приходит с backend/API",
            "Ничем",
            "Server state хранится только в DOM",
            "Client state всегда в database",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает invalidateQueries в React Query?",
          answers: [
            "Помечает данные устаревшими и запускает refetch",
            "Удаляет React-компонент",
            "Очищает DOM",
            "Создаёт reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему нельзя хранить весь state глобально?",
          answers: [
            "Это усложняет приложение и вызывает лишние re-renders",
            "React запрещает это",
            "Это ломает браузер",
            "Это отключает SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое derived state?",
          answers: [
            "State, вычисляемый из других данных",
            "Схема базы данных",
            "Кэш браузера",
            "API-endpoint",
          ],
          correctAnswer: 0,
        },
        {
          question: "Какой подход считается хорошей практикой?",
          answers: [
            "Хранить state максимально близко к месту использования",
            "Делать весь state global",
            "Использовать только Redux",
            "Хранить state в localStorage всегда",
          ],
          correctAnswer: 0,
        },
      ],
      "nextjs": [
        {
          question: "Что такое Next.js?",
          answers: [
            "Backend-база данных",
            "React-фреймворк",
            "CSS-фреймворк",
            "Движок браузера",
          ],
          correctAnswer: 1,
        },
        {
          question: "Главное преимущество Next.js?",
          answers: [
            "Поддержка SSR и routing из коробки",
            "Замена JavaScript",
            "Работа без React",
            "Встроенная база данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое SSR?",
          answers: [
            "Server Side Rendering",
            "Статический серверный роутер",
            "Безопасный рендер состояния",
            "Styled System для React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое CSR?",
          answers: [
            "Client Side Rendering",
            "Серверный рендер компонента",
            "Runtime для CSS-стилей",
            "Кэшированный серверный ответ",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает file-based routing в Next.js?",
          answers: [
            "Создаёт роуты на основе файловой структуры",
            "Создаёт database schema",
            "Управляет CSS",
            "Создаёт API-шлюз",
          ],
          correctAnswer: 0,
        },
        {
          question: "Какая папка обычно содержит страницы в App Router?",
          answers: ["src", "app", "public", "assets"],
          correctAnswer: 1,
        },
        {
          question: "Для чего нужна папка public?",
          answers: [
            "Для хранения статических файлов",
            "Для хранения React Hooks",
            "Для миграции базы данныхs",
            "Для reducers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое API Routes в Next.js?",
          answers: [
            "Backend-endpoint’ы внутри Next.js",
            "CSS-модули",
            "React Hooks",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Link из next/link?",
          answers: [
            "Делает клиентская навигация",
            "Делает fetch",
            "Управляет state",
            "Создаёт SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему Link лучше обычного <a>?",
          answers: [
            "Из-за клиентская навигация без полной перезагрузки",
            "Потому что это CSS-компонент",
            "Потому что он быстрее JavaScript",
            "Потому что он создаёт API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое hydration?",
          answers: [
            "Связывание SSR HTML с React на клиенте",
            "Очистка памяти",
            "Сжатие CSS",
            "Кэширование fetch",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое getServerSideProps?",
          answers: [
            "Функция для SSR данных",
            "React hook",
            "Браузерный API",
            "CSS-утилита",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое getStaticProps?",
          answers: [
            "Генерация страницы во время build",
            "Runtime-рендеринг",
            "WebSocket API",
            "Браузерный рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое SSG?",
          answers: [
            "Static Site Generation",
            "Шлюз серверного состояния",
            "Генератор Styled System",
            "Безопасный статический граф",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое middleware в Next.js?",
          answers: [
            "Код, выполняющийся до обработки запроса",
            "React-компонент",
            "CSS-процессор",
            "Браузерный плагин",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего используется next/image?",
          answers: [
            "Для оптимизации изображений",
            "Для управление состоянием",
            "Для SSR-роутинг",
            "Для reducers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает next/head?",
          answers: [
            "Управляет meta-тегами и title страницы",
            "Управляет Redux",
            "Создаёт API",
            "Делает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое динамический роут?",
          answers: [
            "Роут с параметрами",
            "CSS-анимация",
            "Runtime-reducer",
            "Таблица базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Пример динамический роут:",
          answers: ["/about", "/products/[id]", "/styles.css", "/public/logo.png"],
          correctAnswer: 1,
        },
        {
          question: "Почему Next.js популярен?",
          answers: [
            "Даёт SSR, routing, optimization и хорошую DX из коробки",
            "Полностью заменяет backend",
            "Работает без JavaScript",
            "Удаляет необходимость API",
          ],
          correctAnswer: 0,
        },
      ],
      "browser-dom": [
        {
          question: "Что такое DOM?",
          answers: [
            "Модель объектов базы данных",
            "Document Object Model",
            "Динамический менеджер объектов",
            "Модуль порядка документа",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что представляет DOM?",
          answers: [
            "Дерево HTML-элементов",
            "SQL-база данных",
            "CSS-фреймворк",
            "Backend-сервер",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как получить элемент по id?",
          answers: [
            "querySelectorAll()",
            "getElementById()",
            "getElementsByClass()",
            "findElement()",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что делает querySelector()?",
          answers: [
            "Возвращает первый подходящий элемент",
            "Возвращает массив всех элементов",
            "Создаёт DOM-узел",
            "Удаляет элемент",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как добавить обработчик события?",
          answers: [
            "appendEvent()",
            "addEventListener()",
            "createEvent()",
            "setEvent()",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое event?",
          answers: [
            "CSS-анимация",
            "Событие в браузере",
            "React hook",
            "Database update",
          ],
          correctAnswer: 1,
        },
        {
          question: "Что такое event bubbling?",
          answers: [
            "Всплытие события от дочернего элемента к родителям",
            "Удаление события",
            "Браузерный рендеринг",
            "Очередь Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает event.preventDefault()?",
          answers: [
            "Останавливает действие браузера по умолчанию",
            "Удаляет DOM",
            "Останавливает JavaScript",
            "Удаляет event listener",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает event.stopPropagation()?",
          answers: [
            "Останавливает всплытие события",
            "Удаляет event",
            "Блокирует fetch",
            "Перезагружает страницу",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как изменить текст элемента?",
          answers: ["innerText", "setText()", "textValue", "innerStyle"],
          correctAnswer: 0,
        },
        {
          question: "Что делает classList.add()?",
          answers: [
            "Добавляет CSS-класс",
            "Удаляет DOM-узел",
            "Создаёт event",
            "Добавляет HTML страницу",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое localStorage?",
          answers: [
            "Хранилище данных в браузере",
            "Database server",
            "React state",
            "CSS cache",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем localStorage отличается от sessionStorage?",
          answers: [
            "localStorage сохраняется после закрытия вкладки",
            "Ничем",
            "sessionStorage быстрее",
            "localStorage работает только в React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое cookie?",
          answers: [
            "Небольшие данные, хранящиеся в браузере",
            "React-компонент",
            "Движок браузера",
            "HTML tag",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает fetch()?",
          answers: [
            "Выполняет HTTP-запрос",
            "Создаёт DOM",
            "Управляет CSS",
            "Создаёт reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое JSON?",
          answers: [
            "Формат обмена данными",
            "CSS-библиотека",
            "Браузерный API",
            "HTML parser",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает JSON.parse()?",
          answers: [
            "Преобразует JSON string в object",
            "Преобразует object в string",
            "Делает fetch",
            "Создаёт Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает JSON.stringify()?",
          answers: [
            "Преобразует object в JSON string",
            "Создаёт DOM",
            "Создаёт API",
            "Парсит HTML",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое debounce?",
          answers: [
            "Ограничение частоты вызова функции",
            "Падение браузера",
            "CSS-оптимизация",
            "SQL-запрос",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему direct DOM manipulation редко используется в React?",
          answers: [
            "React сам управляет DOM через Virtual DOM",
            "React запрещает DOM API",
            "DOM API не работает в браузере",
            "Это удаляет state",
          ],
          correctAnswer: 0,
        },
      ],
      "performance-optimization": [
        {
          question: "Что такое performance optimization?",
          answers: [
            "Оптимизация производительности приложения",
            "Оптимизация CSS цветов",
            "Работа с database",
            "Настройка Docker",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызывать медленный render в React?",
          answers: [
            "Частые лишние re-render",
            "CSS-комментарии",
            "HTML-title",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего используется React.memo?",
          answers: [
            "Для предотвращения лишних re-render",
            "Для fetch запросов",
            "Для routing",
            "Для SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда React.memo может быть полезен?",
          answers: [
            "Когда компонент часто рендерится с одинаковыми props",
            "Для CSS-анимация",
            "Для миграции базы данных",
            "Для WebSocket",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useMemo?",
          answers: [
            "Кэширует вычисления",
            "Делает API request",
            "Создаёт reducer",
            "Управляет DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useCallback?",
          answers: [
            "Кэширует функцию",
            "Создаёт Promise",
            "Создаёт state",
            "Делает SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему inline object/function могут быть проблемой?",
          answers: [
            "Они создают новые ссылки при каждом render",
            "Они ломают браузер",
            "Они удаляют state",
            "Они отключают hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое lazy loading?",
          answers: [
            "Загрузка кода или ресурсов только при необходимости",
            "Медленный render",
            "Удаление JavaScript",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает React.lazy?",
          answers: [
            "Позволяет лениво загружать компоненты",
            "Удаляет component",
            "Создаёт reducer",
            "Делает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего нужен Suspense?",
          answers: [
            "Для отображения fallback во время lazy loading",
            "Для управление состоянием",
            "Для CSS",
            "Для API routes",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое bundle size?",
          answers: [
            "Размер JavaScript-бандла приложения",
            "Размер CSS class",
            "Размер DOM",
            "Размер database",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большой bundle size — проблема?",
          answers: [
            "Увеличивает время загрузки приложения",
            "Ускоряет render",
            "Улучшает SEO",
            "Уменьшает сеть использования",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое code splitting?",
          answers: [
            "Разделение кода на части",
            "Удаление JavaScript",
            "Разделение CSS",
            "Браузерный рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое debounce?",
          answers: [
            "Ограничение частоты вызова функции",
            "Удаление event",
            "SSR optimization",
            "Сброс состояния",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда debounce особенно полезен?",
          answers: [
            "Для input search и resize events",
            "Для static HTML",
            "Для CSS-переменные",
            "Для reducers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое throttle?",
          answers: [
            "Ограничение количества вызовов функции за промежуток времени",
            "Удаление Promise",
            "React rendering",
            "DOM-парсер",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему key важен в списках React?",
          answers: [
            "Помогает React эффективно обновлять элементы",
            "Удаляет re-render",
            "Управляет CSS",
            "Создаёт state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может ухудшать производительность списка?",
          answers: [
            "Рендер большого количества элементов одновременно",
            "useState",
            "HTML div",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое virtualization list?",
          answers: [
            "Рендер только видимых элементов списка",
            "SSR-рендеринг",
            "CSS-оптимизация",
            "Кэширование базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему оптимизация важна?",
          answers: [
            "Улучшает UX и скорость работы приложения",
            "Только для SEO",
            "Только для backend",
            "Только для CSS",
          ],
          correctAnswer: 0,
        },
      ],
      "frontend-system-design": [
        {
          question: "Что такое frontend-архитектура?",
          answers: [
            "Структура frontend-приложения",
            "Схема базы данных",
            "CSS-анимация",
            "Движок браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему важно разделять приложение на компоненты?",
          answers: [
            "Для переиспользования и поддержки кода",
            "Для уменьшения HTML",
            "Для удаления state",
            "Для ускорения CSS",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое reusable component?",
          answers: [
            "Компонент, который можно использовать в разных местах",
            "Таблица базы данных",
            "Браузерный API",
            "CSS variable",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему важно разделять бизнес-логику и UI?",
          answers: [
            "Для упрощения поддержки и тестирования",
            "Для SSR",
            "Для hydration",
            "Для localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое container/presentation pattern?",
          answers: [
            "Разделение логики и отображения",
            "CSS-оптимизация",
            "Браузерный рендеринг",
            "Паттерн базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое design system?",
          answers: [
            "Набор общих UI-компонентов и правил",
            "Движок базы данных",
            "Backend-фреймворк",
            "Расширение браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему design system полезен?",
          answers: [
            "Даёт консистентность интерфейсов",
            "Удаляет JavaScript",
            "Заменяет backend",
            "Ускоряет SQL",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое layout component?",
          answers: [
            "Компонент общей структуры страницы",
            "API-endpoint",
            "Кэш браузера",
            "Reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему важно минимизировать props drilling?",
          answers: [
            "Чтобы уменьшить сложность приложения",
            "Чтобы ускорить CSS",
            "Чтобы отключить hooks",
            "Чтобы удалить state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое feature-based structure?",
          answers: [
            "Организация проекта по фичам",
            "Организация CSS",
            "Индексация базы данных",
            "Браузерный рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое shared components?",
          answers: [
            "Общие переиспользуемые компоненты",
            "API routes",
            "Браузерный плагинs",
            "Обработчик событияs",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему naming компонентов важен?",
          answers: [
            "Улучшает читаемость проекта",
            "Ускоряет browser rendering",
            "Удаляет bugs",
            "Управляет SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое scalability frontend-приложения?",
          answers: [
            "Способность проекта расти без хаоса",
            "Размер CSS",
            "Хранилище браузера",
            "Размер HTML",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое code duplication?",
          answers: [
            "Дублирование одинакового кода",
            "SSR-рендеринг",
            "Браузерный API",
            "Парсинг JSON",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему code duplication — проблема?",
          answers: [
            "Код сложнее поддерживать",
            "React запрещает duplication",
            "CSS перестаёт работать",
            "Browser падает",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое API layer?",
          answers: [
            "Слой работы с backend API",
            "CSS layer",
            "Движок браузера",
            "HTML renderer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему важно централизовать API requests?",
          answers: [
            "Упрощает поддержку и обработку ошибок",
            "Удаляет необходимость backend",
            "Улучшает CSS",
            "Удаляет hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое loading state?",
          answers: [
            "Состояние загрузки данных",
            "Падение браузера",
            "CSS-режим",
            "Блокировка базы данных",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему важно обрабатывать error state?",
          answers: [
            "Для хорошего UX",
            "Только для SEO",
            "Только для backend",
            "Для CSS-анимация",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей frontend архитектурой?",
          answers: [
            "Масштабируемая, читаемая и поддерживаемая структура",
            "Один файл на всё приложение",
            "Только global state",
            "Только inline styles",
          ],
          correctAnswer: 0,
        },
      ],
    },
    middle: {
      "javascript-basics": [
        {
          question: "Что такое hoisting?",
          answers: [
            "Поднятие объявлений переменных и функций во время компиляции",
            "Удаление переменных",
            "Асинхронный рендеринг",
            "Работа event loop",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем let отличается от var?",
          answers: [
            "let имеет block scope",
            "let быстрее",
            "let immutable",
            "let работает только в React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему использование var считается плохой практикой?",
          answers: [
            "Из-за function scope и hoisting-related багов",
            "Потому что React запрещает var",
            "Потому что var async",
            "Потому что var immutable",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое closure?",
          answers: [
            "Функция с доступом к внешнему lexical scope",
            "DOM event",
            "Promise callback",
            "Браузерный API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему closures полезны?",
          answers: [
            "Позволяют сохранять состояние между вызовами",
            "Удаляют memory leaks",
            "Заменяют classes",
            "Ускоряют DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое lexical scope?",
          answers: [
            "Область видимости определяется местом объявления",
            "Runtime scope",
            "Браузерный рендеринг",
            "Очередь Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое prototype в JavaScript?",
          answers: [
            "Механизм наследования объектов",
            "CSS-архитектура",
            "React lifecycle",
            "HTTP protocol",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает bind()?",
          answers: [
            "Создаёт новую функцию с фиксированным this",
            "Выполняет Promise",
            "Создаёт reducer",
            "Управляет DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем arrow function отличается от обычной function?",
          answers: [
            "У arrow function нет собственного this",
            "Arrow function async по умолчанию",
            "Arrow function быстрее всегда",
            "Arrow function immutable",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое this в JavaScript?",
          answers: [
            "Контекст вызова функции",
            "Текущий DOM-узел",
            "Browser window всегда",
            "Promise object",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что выведет:\n\n[] == false",
          answers: ["true", "false", "undefined", "Error"],
          correctAnswer: 0,
        },
        {
          question: "Почему == считается опасным?",
          answers: [
            "Из-за implicit type coercion",
            "Потому что он медленный",
            "Потому что React запрещает ==",
            "Потому что он async",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое type coercion?",
          answers: [
            "Автоматическое преобразование типов",
            "Браузерный рендеринг",
            "SSR hydration",
            "DOM optimization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое shallow copy?",
          answers: [
            "Копирование только верхнего уровня объекта",
            "Полная deep clone",
            "Копирование DOM",
            "Promise clone",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может быть проблемой shallow copy?",
          answers: [
            "Вложенные объекты остаются по ссылке",
            "Удаляются поля",
            "Теряется типизация",
            "Ломается JSON",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает destructuring?",
          answers: [
            "Распаковка значений из объектов/массивов",
            "Удаление объекта",
            "Создание Promise",
            "Парсинг браузером",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему Object.freeze не является полной immutable защитой?",
          answers: [
            "Freeze поверхностный",
            "Freeze не работает в browser",
            "Freeze async",
            "Freeze удаляет prototype",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое debounce?",
          answers: [
            "Ограничение частоты вызова функции",
            "Promise retry",
            "SSR optimization",
            "Парсинг DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое throttle?",
          answers: [
            "Ограничение количества вызовов за интервал времени",
            "Очередь браузера",
            "Планировщик React",
            "Менеджер состояния",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему mutation объектов может быть проблемой в React?",
          answers: [
            "React опирается на сравнение ссылок",
            "Mutation быстрее render",
            "React удаляет мутированные объекты",
            "Mutation запрещён в JavaScript",
          ],
          correctAnswer: 0,
        },
      ],
      "async-await-event-loop": [
        {
          question: "Что произойдёт с microtasks после завершения macrotask?",
          answers: [
            "Выполнятся все microtasks перед следующей macrotask",
            "Будет выполнена только одна microtask",
            "Event Loop остановится",
            "Выполнится render браузера раньше microtasks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что относится к microtask queue?",
          answers: ["setTimeout", "setInterval", "Promise.then", "click event"],
          correctAnswer: 2,
        },
        {
          question: "Почему callbacks Promise выполняются раньше setTimeout?",
          answers: [
            "Потому что callbacks Promise находятся в microtask queue",
            "Потому что Promise синхронные",
            "Потому что setTimeout async",
            "Потому что browser optimization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может блокировать Event Loop?",
          answers: [
            "Долгий синхронный код",
            "Promise.resolve",
            "useEffect",
            "queueMicrotask",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему heavy computation опасен на frontend?",
          answers: [
            "Может freeze UI и блокировать обработку событий",
            "Ускоряет render",
            "Улучшает hydration",
            "Удаляет memory leaks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает queueMicrotask?",
          answers: [
            "Добавляет задачу в microtask queue",
            "Создаёт macrotask",
            "Делает requestAnimationFrame",
            "Создаёт Promise.all",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что выведет код?\n\nconsole.log(1);\nsetTimeout(() => console.log(2));\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
          answers: ["1 4 3 2", "1 3 4 2", "1 2 3 4", "4 3 2 1"],
          correctAnswer: 0,
        },
        {
          question: "Что произойдёт при throw внутри async function?",
          answers: [
            "Вернётся rejected Promise",
            "Браузер crash",
            "Код станет sync",
            "Promise автоматически retry",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему await внутри for-loop может быть проблемой?",
          answers: [
            "Операции выполняются последовательно",
            "await ломает цикл",
            "Promise становятся sync",
            "Event Loop останавливается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как правильно запускать независимые async операции?",
          answers: ["Promise.all", "nested await", "setInterval", "while loop"],
          correctAnswer: 0,
        },
        {
          question: "Что делает Promise.all при reject одного Promise?",
          answers: [
            "Сразу reject всего Promise.all",
            "Игнорирует ошибку",
            "Возвращает partial results",
            "Выполняет retry автоматически",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Promise.allSettled?",
          answers: [
            "Возвращает результаты fulfilled/rejected всех Promise",
            "Останавливается на первой ошибке",
            "Выполняет только successful Promise",
            "Делает Promise sync",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Promise.race?",
          answers: [
            "Возвращает результат первого завершившегося Promise",
            "Ждёт самый медленный Promise",
            "Игнорирует rejected Promise",
            "Выполняет Promise sequentially",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему unhandled Promise rejection опасен?",
          answers: [
            "Ошибки могут остаться незамеченными",
            "Browser автоматически reload",
            "Promise удаляется из памяти",
            "React перестаёт работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое call stack?",
          answers: [
            "Стек выполнения синхронного кода",
            "Очередь Promise",
            "Кэш браузера",
            "DOM tree",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое macrotask?",
          answers: [
            "Задача из task queue",
            "Promise callback",
            "React render",
            "JSON parse",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает AbortController?",
          answers: [
            "Позволяет отменять async-операции/fetch",
            "Останавливает Event Loop",
            "Делает retry Promise",
            "Управляет SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему setTimeout(fn, 0) не выполняется мгновенно?",
          answers: [
            "Callback ждёт освобождения call stack",
            "Потому что setTimeout synchronous",
            "Browser всегда ждёт 1 секунду",
            "Promise имеют приоритет только в React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать memory leak в async-коде?",
          answers: [
            "Неочищенные subscriptions/timers/listeners",
            "Promise.resolve",
            "queueMicrotask",
            "JSON.stringify",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой при async-программировании?",
          answers: [
            "Обрабатывать ошибки и избегать блокировки main thread",
            "Использовать вложенные callbacks везде",
            "Хранить Promise без await",
            "Делать тяжёлые синхронные циклы",
          ],
          correctAnswer: 0,
        },
      ],
      "react-basics": [
        {
          question: "Что такое reconciliation в React?",
          answers: [
            "Процесс сравнения Virtual DOM",
            "CSS-оптимизация",
            "Браузерный рендеринг",
            "Разрешение Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему React использует Virtual DOM?",
          answers: [
            "Для минимизации прямых DOM-операций",
            "Для удаления HTML",
            "Для SSR only",
            "Для работы без browser",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызывать лишние re-render?",
          answers: [
            "Изменение ссылочных props",
            "CSS-модули",
            "HTML-атрибуты",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему key важен в списках?",
          answers: [
            "Помогает React корректно сопоставлять элементы",
            "Удаляет re-render",
            "Управляет hooks",
            "Улучшает CSS",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему index как key может быть проблемой?",
          answers: [
            "Может приводить к некорректному reconciliation",
            "Ломает JSX",
            "Отключает state",
            "Удаляет props",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое controlled component?",
          answers: [
            "Компонент, где input управляется state",
            "DOM element",
            "Событие браузера",
            "CSS pattern",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда uncontrolled components могут быть полезны?",
          answers: [
            "При интеграции с non-React libraries/forms",
            "Для SSR only",
            "Для Redux",
            "Для Suspense",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое lifting state up?",
          answers: [
            "Поднятие общего state в родительский компонент",
            "Удаление state",
            "SSR hydration",
            "Браузерный рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive lifting state может быть проблемой?",
          answers: [
            "Может вызывать лишние re-render",
            "React запрещает lifting",
            "Падение браузера",
            "Hooks перестают работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает React.memo?",
          answers: [
            "Мемоизирует component render",
            "Делает fetch",
            "Управляет routing",
            "Создаёт context",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что важно помнить про React.memo?",
          answers: [
            "Он делает shallow comparison props",
            "Он deep compare всегда",
            "Он предотвращает все renders",
            "Он работает только с hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое prop drilling?",
          answers: [
            "Передача props через множество компонентов",
            "DOM-рендеринг",
            "CSS-наследование",
            "Цепочка Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как обычно решают prop drilling?",
          answers: [
            "Context/управление состоянием",
            "setTimeout",
            "JSON.parse",
            "Браузерный API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое composition в React?",
          answers: [
            "Комбинирование компонентов через children/props",
            "CSS-архитектура",
            "Связь в базе данных",
            "Event loop",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему composition предпочтительнее inheritance в React?",
          answers: [
            "Даёт более гибкую архитектуру",
            "inheritance запрещён JavaScript",
            "composition быстрее DOM",
            "inheritance не работает в browser",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое hydration mismatch?",
          answers: [
            "Несовпадение SSR HTML и client render",
            "Кэш браузера issue",
            "Ошибка Redux",
            "CSS problem",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать hydration mismatch?",
          answers: [
            "Разный render на сервере и клиенте",
            "useState",
            "React.memo",
            "Suspense",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое render props pattern?",
          answers: [
            "Передача функции для рендера UI",
            "CSS-рендеринг",
            "Браузерный рендеринг",
            "Promise rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему direct mutation state — проблема?",
          answers: [
            "React relies on immutable updates",
            "React crash",
            "DOM stops working",
            "Hooks delete state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей React архитектурой?",
          answers: [
            "Предсказуемые, переиспользуемые и масштабируемые компоненты",
            "Один большой компонент",
            "Global state для всего",
            "Business logic прямо в UI повсюду",
          ],
          correctAnswer: 0,
        },
      ],
      "react-hooks": [
        {
          question: "Почему условный вызов hooks — проблема?",
          answers: [
            "React Hooks order должен быть одинаковым между render",
            "React не поддерживает if",
            "useEffect ломает state",
            "Потому что hooks асинхронные",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что произойдёт при изменении dependency в useEffect?",
          answers: [
            "React выполнит cleanup и затем повторно выполнит effect",
            "React перезагрузит страницу",
            "useEffect удалится",
            "State очистится",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда useMemo бесполезен?",
          answers: [
            "Для дешёвых вычислений",
            "Для expensive calculations",
            "Для memoized selectors",
            "Для derived state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему чрезмерное использование useMemo/useCallback может быть вредным?",
          answers: [
            "Из-за overhead memoization",
            "React запрещает memoization",
            "Это ломает SSR",
            "Это вызывает hydration errors",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать infinite re-render в useEffect?",
          answers: [
            "Изменение state внутри effect без корректных dependencies",
            "useRef",
            "React.memo",
            "Suspense",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает cleanup function в useEffect?",
          answers: [
            "Очищает subscriptions/timers/listeners перед следующим effect или unmount",
            "Удаляет state",
            "Перезапускает компонент",
            "Удаляет props",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему stale closure может быть проблемой?",
          answers: [
            "Callback может использовать устаревшие значения state/props",
            "React ломает DOM",
            "useRef перестаёт работать",
            "Promise становится rejected",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как обычно решают проблема stale closure?",
          answers: [
            "Functional updates/useRef/correct dependencies",
            "setTimeout",
            "JSON.stringify",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда useRef лучше useState?",
          answers: [
            "Когда значение не должно вызывать re-render",
            "Для UI updates",
            "Для derived JSX",
            "Для conditional rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что важно помнить про useContext?",
          answers: [
            "Изменение value вызывает re-render всех consumers",
            "Он работает как Redux selector",
            "Он предотвращает re-render автоматически",
            "Он async",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большой Context может быть проблемой?",
          answers: [
            "Может вызывать массовые re-render",
            "React запрещает большой Context",
            "Переполнение памяти браузера",
            "SSR crashes",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает useReducer лучше useState в сложной логике?",
          answers: [
            "Централизует transitions state",
            "Ускоряет DOM",
            "Делает automatic memoization",
            "Заменяет useEffect",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое custom hook?",
          answers: [
            "Переиспользуемая hook-based логика",
            "Браузерный API",
            "Reducer middleware",
            "SSR renderer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему custom hooks полезны?",
          answers: [
            "Позволяют переиспользовать stateful logic",
            "Удаляют re-render",
            "Заменяют components",
            "Удаляют Context API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что произойдёт при отсутствии dependency в useEffect?",
          answers: [
            "Effect будет выполняться после каждого render",
            "Effect никогда не выполнится",
            "Component unmount",
            "React crash",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое referential equality?",
          answers: [
            "Сравнение ссылок объектов/функций",
            "Сравнение DOM-узелs",
            "SSR optimization",
            "Equality CSS classes",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему referential equality важен в React?",
          answers: [
            "React использует её для optimization/memoization",
            "Она нужна только Redux",
            "Она влияет только CSS",
            "Она нужна только TypeScript",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда useCallback действительно полезен?",
          answers: [
            "При memoized child components",
            "Всегда",
            "Только в forms",
            "Только в SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать memory leak в useEffect?",
          answers: [
            "Неочищенные subscriptions/timers/listeners",
            "useMemo",
            "React.lazy",
            "key prop",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой при работе с hooks?",
          answers: [
            "Минимизировать side-effects и держать hooks предсказуемыми",
            "Вызывать hooks условно",
            "Хранить всё в Context",
            "Использовать useEffect для всего",
          ],
          correctAnswer: 0,
        },
      ],
      "typescript": [
        {
          question: "Почему any считается плохой практикой?",
          answers: [
            "Отключает type safety",
            "Ломает JavaScript",
            "Не работает в React",
            "Удаляет runtime",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем unknown лучше any?",
          answers: [
            "Требует явной проверки типов перед использованием",
            "Быстрее runtime",
            "Работает только в React",
            "Автоматически валидирует API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое generic?",
          answers: [
            "Параметризованный тип",
            "Браузерный API",
            "React lifecycle",
            "CSS-утилита",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему generics полезны?",
          answers: [
            "Позволяют писать переиспользуемый type-safe код",
            "Ускоряют DOM",
            "Заменяют interface",
            "Удаляют runtime errors",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое union type?",
          answers: [
            "Тип с несколькими возможными значениями",
            "Тип для Promise",
            "Браузерный рендеринг",
            "CSS-наследование",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое intersection type?",
          answers: [
            "Комбинация нескольких типов",
            "Runtime-объединение",
            "DOM-операция",
            "API request",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает extends в generic?",
          answers: [
            "Ограничивает generic type",
            "Создаёт inheritance DOM",
            "Делает async type",
            "Создаёт reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое keyof?",
          answers: [
            "Union ключей объекта",
            "Тип DOM-узел",
            "Promise helper",
            "Хранилище браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Partial<T>?",
          answers: [
            "Делает все поля optional",
            "Делает поля readonly",
            "Удаляет null",
            "Делает deep clone",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Pick<T, K>?",
          answers: [
            "Выбирает subset полей типа",
            "Удаляет типизацию",
            "Делает async object",
            "Создаёт reducer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Omit<T, K>?",
          answers: [
            "Исключает поля из типа",
            "Удаляет runtime object",
            "Делает readonly",
            "Создаёт Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое discriminated union?",
          answers: [
            "Union с общим discriminant field",
            "CSS-архитектура",
            "Браузерный API",
            "React hook",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему discriminated unions полезны?",
          answers: [
            "Упрощают type narrowing",
            "Ускоряют DOM",
            "Делают SSR",
            "Удаляют interface",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое type narrowing?",
          answers: [
            "Уточнение типа через проверки",
            "Удаление типов",
            "Runtime optimization",
            "Парсинг браузером",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает readonly?",
          answers: [
            "Запрещает изменение свойства",
            "Делает field optional",
            "Удаляет property",
            "Делает property async",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему TypeScript не заменяет runtime-валидация?",
          answers: [
            "Типы существуют только во время compile-time",
            "TS не работает с API",
            "Runtime-валидация встроен в browser",
            "TS автоматически валидирует JSON",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое enum downside?",
          answers: [
            "Может увеличивать bundle size/runtime code",
            "Не работает с React",
            "Не поддерживает string",
            "Удаляет type safety",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое structural typing?",
          answers: [
            "Совместимость типов по структуре",
            "Проверка runtime object",
            "Типизация браузера",
            "Валидация DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive type complexity может быть проблемой?",
          answers: [
            "Ухудшает readability/supportability",
            "Удаляет type safety",
            "Ломает React",
            "Ускоряет compile",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой в TypeScript?",
          answers: [
            "Максимально strict и предсказуемую типизацию",
            "Использовать any везде",
            "Не использовать interface",
            "Хранить типы в только в components",
          ],
          correctAnswer: 0,
        },
      ],
      "state-management": [
        {
          question: "Когда Context API становится плохим решением?",
          answers: [
            "При часто изменяемом глобальном state",
            "Для theme provider",
            "Для auth user",
            "Для static config",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большой Context может вызывать performance проблемы?",
          answers: [
            "Все consumers re-render при изменении value",
            "Context async",
            "Browser не оптимизирует Context",
            "Context ломает SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое normalized state?",
          answers: [
            "State без дублирования данных",
            "CSS-файл нормализации",
            "SSR state",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему normalized state полезен?",
          answers: [
            "Упрощает updates и уменьшает duplication",
            "Удаляет re-render",
            "Делает state immutable автоматически",
            "Ускоряет DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему mutation state опасен?",
          answers: [
            "Может ломать predictable updates и memoization",
            "Падение браузера",
            "React удаляет component",
            "useEffect перестаёт работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает Middleware Redux?",
          answers: [
            "Добавляет side-effects/interceptors между dispatch и reducer",
            "Управляет DOM",
            "Создаёт SSR",
            "Делает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему reducers должны быть pure functions?",
          answers: [
            "Для predictable state updates",
            "Для browser optimization",
            "Для CSS-рендеринг",
            "Для DOM-события",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается side-effect в reducer?",
          answers: [
            "API request",
            "Возврат нового state",
            "switch(action.type)",
            "Spread operator",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему server state лучше хранить отдельно от client state?",
          answers: [
            "У них разные lifecycle/update patterns",
            "React запрещает хранить вместе",
            "Кэш браузера ломается",
            "useState работает только для client state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает React Query/TanStack Query?",
          answers: [
            "Управляет server state/caching/sync",
            "Управляет CSS",
            "Создаёт reducers",
            "Делает SSR-роутинг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое optimistic update?",
          answers: [
            "UI обновляется до ответа сервера",
            "SSR-рендеринг",
            "Кэш браузера invalidation",
            "DOM batching",
          ],
          correctAnswer: 0,
        },
        {
          question: "Какой риск у optimistic updates?",
          answers: [
            "Нужно корректно rollback при ошибке",
            "Они ломают hydration",
            "Они запрещены React",
            "Они удаляют cache",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое selector в управление состоянием?",
          answers: [
            "Функция получения части state",
            "DOM-запрос",
            "Браузерный API",
            "CSS selector only",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему selectors полезны?",
          answers: [
            "Уменьшают coupling и лишние re-render",
            "Удаляют reducers",
            "Ускоряют сеть",
            "Заменяют Context",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему хранить derived state может быть плохой практикой?",
          answers: [
            "Может приводить к inconsistent data",
            "Падение браузера",
            "React запрещает derived state",
            "Suspense ломается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое single source of truth?",
          answers: [
            "Один источник актуальных данных",
            "Хранилище браузера",
            "CSS config",
            "SSR renderer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему чрезмерный global state — проблема?",
          answers: [
            "Усложняет приложение и debugging",
            "Улучшает performance",
            "Удаляет props drilling всегда",
            "Делает React faster",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что важно при проектировании управление состоянием?",
          answers: [
            "Минимизировать unnecessary shared state",
            "Делать всё global",
            "Использовать только Redux",
            "Хранить всё в localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда Zustand может быть удобнее Redux?",
          answers: [
            "Для simpler/lightweight управление состоянием",
            "Для SSR only",
            "Для browser rendering",
            "Для CSS-архитектура",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой в управление состоянием?",
          answers: [
            "Держать state предсказуемым, нормализованным и масштабируемым",
            "Mutation повсюду",
            "Global state для всех inputs",
            "API-запросы внутри reducers",
          ],
          correctAnswer: 0,
        },
      ],
      "nextjs": [
        {
          question: "Когда SSR предпочтительнее CSR?",
          answers: [
            "Для SEO и dynamic server-side data",
            "Для static icons only",
            "Для CSS-анимацияs",
            "Для localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда SSG предпочтительнее SSR?",
          answers: [
            "Для редко изменяемых страниц",
            "Для realtime dashboards",
            "Для WebSocket-приложений",
            "Для browser events",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое hydration mismatch?",
          answers: [
            "Несовпадение HTML между сервером и клиентом",
            "Кэш браузера issue",
            "Проблема CSS-рендеринга",
            "Ошибка Redux",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать hydration mismatch?",
          answers: [
            "Использование browser-only API во время SSR",
            "useMemo",
            "React.memo",
            "Suspense",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему нельзя использовать window/document во время SSR?",
          answers: [
            "Их нет на сервере",
            "Они async",
            "Они только для React",
            "Они доступны только в useMemo",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает dynamic import в Next.js?",
          answers: [
            "Позволяет code splitting/lazy loading",
            "Удаляет SSR",
            "Создаёт reducer",
            "Управляет routing",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда dynamic import особенно полезен?",
          answers: [
            "Для тяжёлых client-only библиотек",
            "Для static HTML",
            "Для CSS-reset",
            "Для localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое ISR?",
          answers: [
            "Incremental Static Regeneration",
            "Internal State Rendering",
            "Interactive Server Router",
            "Indexed Static Resolver",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что даёт ISR?",
          answers: [
            "Обновление static pages без полного rebuild",
            "Удаление hydration",
            "SSR only rendering",
            "Оптимизация браузера only",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает middleware в Next.js?",
          answers: [
            "Выполняет код до обработки request",
            "Управляет React Hooks",
            "Управляет DOM",
            "Делает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему middleware полезен?",
          answers: [
            "Для auth/redirects/headers",
            "Для CSS-модули",
            "Для useState",
            "Для React.memo",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое App Router?",
          answers: [
            "Новый routing system в Next.js",
            "Только браузерный роутер",
            "Роутер Redux",
            "CSS-роутер",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое Server Components?",
          answers: [
            "Компоненты, рендерящиеся только на сервере",
            "Components без JSX",
            "Browser-only components",
            "Components без props",
          ],
          correctAnswer: 0,
        },
        {
          question: "Главное преимущество Server Components?",
          answers: [
            "Меньше JavaScript на клиенте",
            "Быстрее CSS",
            "Удаляют hydration",
            "Заменяют API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда нужен \"use client\"?",
          answers: [
            "Для client-side hooks/browser APIs",
            "Для SSR-страниц",
            "Для middleware",
            "Для API routes",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive client components — проблема?",
          answers: [
            "Увеличивают bundle size",
            "Ломают routing",
            "Удаляют SEO",
            "Падение браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает next/image?",
          answers: [
            "Оптимизирует изображения",
            "Делает SSR-роутинг",
            "Управляет reducers",
            "Создаёт context",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое edge runtime?",
          answers: [
            "Выполнение ближе к пользователю на edge servers",
            "Браузерный рендеринг",
            "CSS-оптимизация",
            "DOM runtime",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему caching важен в Next.js?",
          answers: [
            "Улучшает performance и уменьшает server load",
            "Удаляет hydration",
            "Делает React faster always",
            "Заменяет database",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой в Next.js-архитектурой?",
          answers: [
            "Правильно комбинировать SSR/SSG/CSR в зависимости от сценария",
            "Делать всё через CSR",
            "Делать всё через SSR",
            "Хранить всю логику в page.tsx",
          ],
          correctAnswer: 0,
        },
      ],
      "browser-dom": [
        {
          question: "Что такое event delegation?",
          answers: [
            "Обработка событий через общего родителя",
            "Удаление event listeners",
            "CSS-наследование",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему event delegation полезен?",
          answers: [
            "Уменьшает количество event listeners",
            "Удаляет DOM",
            "Ускоряет сеть",
            "Заменяет React state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое event bubbling?",
          answers: [
            "Всплытие события от target к родителям",
            "Погружение события от document к target",
            "Браузерный рендеринг",
            "Очередь Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое event capturing?",
          answers: [
            "Проход события от document к target",
            "Всплытие события к document",
            "DOM-мутация",
            "Жизненный цикл fetch",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает stopPropagation?",
          answers: [
            "Останавливает дальнейшее распространение события",
            "Останавливает default browser action",
            "Удаляет listener",
            "Очищает event queue",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает preventDefault?",
          answers: [
            "Отменяет действие браузера по умолчанию",
            "Останавливает bubbling всегда",
            "Удаляет DOM-узел",
            "Блокирует JavaScript",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое reflow/layout?",
          answers: [
            "Пересчёт геометрии элементов",
            "Перерисовка цветов",
            "HTTP request",
            "Только парсинг DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое repaint?",
          answers: [
            "Перерисовка визуальных стилей без пересчёта layout",
            "Пересчёт DOM tree",
            "JavaScript parsing",
            "Обновление cookie",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать forced reflow?",
          answers: [
            "Чтение layout-свойств после DOM changes",
            "JSON.parse",
            "fetch",
            "localStorage.setItem",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое DOMContentLoaded?",
          answers: [
            "Событие готовности HTML DOM без ожидания всех ресурсов",
            "Событие полной загрузки images/fonts",
            "Кэш браузера clear",
            "React hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Чем load отличается от DOMContentLoaded?",
          answers: [
            "load ждёт загрузки ресурсов страницы",
            "load срабатывает раньше DOMContentLoaded",
            "DOMContentLoaded ждёт images",
            "Разницы нет",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое MutationObserver?",
          answers: [
            "API для отслеживания изменений DOM",
            "API для HTTP requests",
            "React hook",
            "CSS-оптимизатор",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое IntersectionObserver?",
          answers: [
            "API для отслеживания видимости элемента во viewport",
            "API для отслеживания cookies",
            "Event loop queue",
            "Storage API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего часто используют IntersectionObserver?",
          answers: [
            "Lazy loading и infinite scroll",
            "SSR-роутинг",
            "Redux reducers",
            "CSS-reset",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое passive event listener?",
          answers: [
            "Listener, который обещает не вызывать preventDefault",
            "Listener, который работает только один раз",
            "Listener без callback",
            "Listener для Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему passive listeners полезны для scroll/touch events?",
          answers: [
            "Браузер может не ждать listener перед scroll",
            "Они отключают bubbling",
            "Они удаляют memory leaks автоматически",
            "Они делают событие sync",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое CORS?",
          answers: [
            "Механизм браузерной безопасности для cross-origin requests",
            "CSS-рендеринг mode",
            "Кэш браузера strategy",
            "Фаза DOM-события",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему direct доступ к localStorage может быть проблемой?",
          answers: [
            "Он синхронный и может блокировать main thread",
            "Он async",
            "Он работает только в React",
            "Он удаляет cookies",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое memory leak в DOM-контексте?",
          answers: [
            "Объекты остаются в памяти из-за ссылок/listeners/timers",
            "CSS перестаёт применяться",
            "DOM автоматически удаляется",
            "Browser не грузит HTML",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой при работе с DOM?",
          answers: [
            "Минимизировать layout thrashing и очищать listeners",
            "Читать offsetHeight после каждого style change",
            "Хранить весь state в DOM attributes",
            "Использовать DOM-мутация вместо React state",
          ],
          correctAnswer: 0,
        },
      ],
      "performance-optimization": [
        {
          question: "Что чаще всего вызывает лишние re-render в React?",
          answers: [
            "Новые ссылки на objects/functions",
            "CSS-модули",
            "HTML-атрибуты",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему inline object/function props могут быть проблемой?",
          answers: [
            "Создают новые references на каждом render",
            "Ломают JSX",
            "Падение браузера",
            "Удаляют memoization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда React.memo действительно полезен?",
          answers: [
            "Для expensive components с одинаковыми props",
            "Для всех components",
            "Только для SSR",
            "Только для forms",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive memoization может быть вредной?",
          answers: [
            "Из-за overhead comparison/cache",
            "React запрещает memoization",
            "Она ломает hydration",
            "Она отключает hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое code splitting?",
          answers: [
            "Разделение bundle на chunks",
            "Разделение CSS",
            "Разделение DOM tree",
            "Разделение reducers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему code splitting полезен?",
          answers: [
            "Уменьшает начальный bundle size",
            "Удаляет SSR",
            "Ускоряет database",
            "Отключает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tree shaking?",
          answers: [
            "Удаление неиспользуемого кода из bundle",
            "Удаление DOM-узелs",
            "Очистка browser cache",
            "React optimization hook",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое layout thrashing?",
          answers: [
            "Частые forced reflow/layout recalculations",
            "Browser caching",
            "CSS-reset",
            "React reconciliation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему layout thrashing — проблема?",
          answers: [
            "Сильно нагружает rendering pipeline",
            "Ломает hydration",
            "Удаляет state",
            "Отключает GPU",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что чаще всего вызывает expensive paint/reflow?",
          answers: [
            "Частые DOM/layout changes",
            "JSON.parse",
            "localStorage",
            "useMemo",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему virtualization полезен для больших списков?",
          answers: [
            "Рендерятся только видимые элементы",
            "Удаляются hooks",
            "Browser перестаёт делать layout",
            "React не использует DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое debounce?",
          answers: [
            "Отложенный вызов после прекращения событий",
            "Browser repaint",
            "Батчинг Promise",
            "SSR optimization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое throttle?",
          answers: [
            "Ограничение частоты вызова функции",
            "Очистка cache",
            "DOM batching",
            "Event bubbling",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда throttle особенно полезен?",
          answers: [
            "Scroll/resize handlers",
            "Static pages",
            "CSS transitions",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое memory leak на frontend?",
          answers: [
            "Неосвобождённые ссылки/listeners/timers",
            "CSS duplication",
            "Кэш браузера",
            "SSR mismatch",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать memory leak в React?",
          answers: [
            "Неочищенные subscriptions/effects",
            "useMemo",
            "React.lazy",
            "JSX fragments",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему bundle size важен?",
          answers: [
            "Влияет на loading/performance metrics",
            "Важен только backend",
            "Не влияет при SSR",
            "Влияет только на CSS",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое lazy loading?",
          answers: [
            "Загрузка ресурсов только при необходимости",
            "Медленный render",
            "Deferred CSS",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается плохой практикой для performance?",
          answers: [
            "Heavy computations inside render",
            "React.memo",
            "Virtualization",
            "Code splitting",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей performance strategy?",
          answers: [
            "Минимизировать re-render, bundle size и expensive DOM-операцияs",
            "Memoize всё подряд",
            "Хранить всё в global state",
            "Делать всё через useEffect",
          ],
          correctAnswer: 0,
        },
      ],
      "frontend-system-design": [
        {
          question: "Что такое feature-sliced architecture?",
          answers: [
            "Разделение проекта по бизнес-фичам",
            "CSS-методология",
            "Браузерный рендеринг",
            "Database normalization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему feature-based architecture масштабируется лучше?",
          answers: [
            "Уменьшает coupling между частями приложения",
            "Удаляет re-render",
            "React работает быстрее",
            "Не требует управление состоянием",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое shared layer?",
          answers: [
            "Общие reusable modules/components/utils",
            "Кэш браузера",
            "DOM renderer",
            "API-шлюз",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive shared code может быть проблемой?",
          answers: [
            "Повышает coupling между feature modules",
            "Удаляет SSR",
            "Ломает hooks",
            "Удаляет type safety",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое smart/container component?",
          answers: [
            "Компонент с business logic/data fetching",
            "Pure CSS-компонент",
            "DOM-обёртка",
            "Браузерный API",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое dumb/presentational component?",
          answers: [
            "UI-focused component без сложной логики",
            "Redux-store",
            "API-сервис",
            "Слой middleware",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему separation of concerns важен?",
          answers: [
            "Улучшает supportability и scalability",
            "Удаляет bugs",
            "Делает React faster always",
            "Отключает re-render",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое API layer?",
          answers: [
            "Централизованный слой работы с backend",
            "Браузерный рендеринг layer",
            "CSS-абстракция",
            "DOM-планировщик",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему централизованный API layer полезен?",
          answers: [
            "Упрощает retry/error handling/interceptors",
            "Удаляет необходимость backend",
            "Делает SSR automatic",
            "Заменяет React Query",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое domain-driven frontend-архитектура?",
          answers: [
            "Архитектура вокруг бизнес-доменов",
            "CSS-архитектура",
            "Browser routing",
            "Оптимизация HTML",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему чрезмерный global state опасен?",
          answers: [
            "Усложняет data flow/debugging",
            "Улучшает performance всегда",
            "Удаляет prop drilling полностью",
            "React требует global state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое composition over inheritance?",
          answers: [
            "Предпочтение composition вместо class inheritance",
            "Браузерный рендеринг strategy",
            "CSS-наследование optimization",
            "Композиция Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое microfrontend?",
          answers: [
            "Разделение frontend на независимые приложения",
            "Маленький React-компонент",
            "CSS module",
            "Браузерный плагин",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда microfrontend может быть полезен?",
          answers: [
            "Для больших команд/large-scale системах",
            "Для landing page",
            "Для static HTML",
            "Для small SPA always",
          ],
          correctAnswer: 0,
        },
        {
          question: "Главный downside microfrontend-архитектура?",
          answers: [
            "Complexity/integration overhead",
            "Browser не поддерживает microfrontends",
            "Нельзя использовать React",
            "Нельзя использовать routing",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему design system важен в больших проектах?",
          answers: [
            "Даёт consistency/reusability",
            "Удаляет управление состоянием",
            "Заменяет business logic",
            "Делает SSR unnecessary",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое scalable frontend-архитектура?",
          answers: [
            "Архитектура, которую легко расширять без хаоса",
            "Большой bundle size",
            "Только global state",
            "Только SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в frontend-архитектура?",
          answers: [
            "Tight coupling между feature modules",
            "Shared UI kit",
            "API abstraction",
            "Reusable components",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему centralized error handling полезен?",
          answers: [
            "Упрощает поддержку/debugging",
            "Удаляет need for logging",
            "Делает browser faster",
            "Удаляет exceptions",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей frontend-архитектура?",
          answers: [
            "Предсказуемая, модульная, масштабируемая и поддерживаемая структура",
            "Один global store для всего",
            "Business logic прямо в UI повсюду",
            "Один файл на всё приложение",
          ],
          correctAnswer: 0,
        },
      ],
    },
    senior: {
      "javascript-basics": [
        {
          question: "Почему event loop может стать bottleneck в frontend приложении?",
          answers: [
            "JavaScript выполняется в одном потоке",
            "Потому что Promise синхронные",
            "Потому что DOM асинхронный",
            "Потому что browser не использует threads",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое hidden class в V8?",
          answers: [
            "Внутренняя оптимизация структуры объектов",
            "React private component",
            "Кэш браузера layer",
            "CSS-оптимизация",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему изменение shape объекта может ухудшать performance?",
          answers: [
            "Ломает оптимизации JIT",
            "Удаляет prototype",
            "Отключает garbage collector",
            "Делает objects immutable",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое inline cache в V8?",
          answers: [
            "Оптимизация доступа к свойствам объектов",
            "Browser HTTP cache",
            "React memoization",
            "DOM cache",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать deoptimization в V8?",
          answers: [
            "Нестабильные типы и shape объектов",
            "const-переменные",
            "Arrow functions",
            "Promise.all",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему polymorphic objects могут быть проблемой?",
          answers: [
            "Усложняют оптимизацию JIT",
            "React запрещает полиморфизм",
            "Ломают DOM",
            "Удаляют closures",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое garbage collection?",
          answers: [
            "Автоматическое освобождение памяти",
            "Очистка DOM tree",
            "SSR optimization",
            "React reconciliation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что чаще всего вызывает memory leak в JavaScript?",
          answers: [
            "Висящие references/listeners/timers",
            "const-переменные",
            "Promise.resolve",
            "Object.freeze",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему closures могут вызывать memory leaks?",
          answers: [
            "Могут удерживать ссылки на объекты в памяти",
            "Closure отключает GC",
            "Browser не поддерживает closures",
            "React запрещает closures",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое weak reference?",
          answers: [
            "Ссылка, не препятствующая garbage collection",
            "Слабая типизация",
            "DOM reference",
            "Browser pointer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего используется WeakMap?",
          answers: [
            "Для хранения данных без удержания объекта в памяти",
            "Для immutable state",
            "Для SSR cache",
            "Для Цепочка Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему deep clone может быть expensive?",
          answers: [
            "Из-за рекурсивного копирования вложенных структур",
            "Browser запрещает clone",
            "Promise становятся sync",
            "DOM полностью перерисовывается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое call-by-sharing в JavaScript?",
          answers: [
            "Объекты передаются по ссылкоподобной модели",
            "Передача по ссылке",
            "Глубокое клонирование",
            "Иммутабельное обновление",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему mutation shared objects опасен?",
          answers: [
            "Может вызывать непредсказуемые side-effects",
            "Улучшает performance всегда",
            "React автоматически rollback mutation",
            "Браузер предотвращает mutation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое temporal dead zone?",
          answers: [
            "Период до инициализации let/const",
            "Зависание event loop",
            "Promise rejection",
            "Фаза repaint в браузере",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему synchronous доступ к localStorage может быть проблемой?",
          answers: [
            "Блокирует main thread",
            "localStorage async",
            "Ломает hydration",
            "Удаляет cache",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое backpressure в async-системах?",
          answers: [
            "Ситуация, когда producer быстрее consumer",
            "Browser repaint",
            "DOM batching",
            "React hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему large JSON.parse может freeze UI?",
          answers: [
            "JSON.parse synchronous",
            "JSON.parse async",
            "Browser не поддерживает JSON",
            "Очередь Promise overflow",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в large-scale JavaScript apps?",
          answers: [
            "Shared mutable state",
            "Pure functions",
            "Иммутабельное обновлениеs",
            "Lazy loading",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой для large-scale JavaScript?",
          answers: [
            "Predictable immutable architecture с минимизацией side-effects",
            "Mutation повсюду",
            "Global variables",
            "Heavy sync computations on main thread",
          ],
          correctAnswer: 0,
        },
      ],
      "async-await-event-loop": [
        {
          question: "Почему тяжёлый синхронный код опасен для frontend?",
          answers: [
            "Блокирует main thread и UI responsiveness",
            "Удаляет microtasks",
            "Ломает Promise",
            "Отключает browser rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое starvation в Event Loop?",
          answers: [
            "Когда microtasks/macrotasks мешают выполнению других задач",
            "Кэш браузера overflow",
            "Очистка DOM",
            "CSS repaint issue",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему бесконечная цепочка microtasks опасна?",
          answers: [
            "Может блокировать render/macrotasks",
            "Promise становятся sync",
            "Browser удаляет queue",
            "useEffect перестаёт работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое приоритизация задач в runtime браузера?",
          answers: [
            "Разные типы задач имеют разный приоритет",
            "Все задачи одинаковы",
            "Только Promise имеют приоритет",
            "Только render имеет приоритет",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему render может не происходить между microtasks?",
          answers: [
            "Browser обычно рендерит после завершения текущего цикла задач",
            "Promise блокируют GPU",
            "React отключает rendering",
            "Браузер ждёт localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое кооперативное планирование?",
          answers: [
            "Разбиение long tasks на маленькие части",
            "Автоматическая оптимизация браузера",
            "Батчинг Promise",
            "CSS-рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему long tasks ухудшают UX?",
          answers: [
            "Блокируют отзывчивость input, scroll и click",
            "Улучшают FPS",
            "Ускоряют hydration",
            "Удаляют re-render",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает requestIdleCallback?",
          answers: [
            "Позволяет выполнять низкоприоритетные задачи в idle time",
            "Делает fetch retry",
            "Удаляет memory leaks",
            "Делает synchronous rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда requestIdleCallback может быть полезен?",
          answers: [
            "Для фоновых и некритичных задач",
            "Для animations",
            "Для синхронного парсинга",
            "Для SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое race condition в async-коде?",
          answers: [
            "Непредсказуемый порядок завершения async-операции",
            "Проблема repaint в браузере",
            "DOM synchronization",
            "CSS race",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему race conditions опасны?",
          answers: [
            "Могут приводить к неконсистентному состоянию",
            "Ускоряют rendering",
            "Удаляют Promise",
            "React автоматически исправляет race conditions",
          ],
          correctAnswer: 0,
        },
        {
          question: "Как обычно предотвращают race conditions?",
          answers: [
            "AbortController, отмена запросов и проверки версий",
            "setTimeout",
            "localStorage",
            "JSON.stringify",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое backpressure?",
          answers: [
            "Producer генерирует данные быстрее consumer обрабатывает",
            "Очередь repaint в браузере",
            "DOM-мутация",
            "React hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему неконтролируемый async-параллелизм опасен?",
          answers: [
            "Может перегружать сеть/CPU/memory",
            "Удаляет Event Loop",
            "Ломает closures",
            "Promise перестают работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое async leak?",
          answers: [
            "Висящие async-операции после unmount/disconnect",
            "Кэш браузера issue",
            "Потребление памяти CSS",
            "Баг repaint в DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему unhandled Promise rejection — production-риск?",
          answers: [
            "Ошибки могут незаметно ломать сценарии",
            "Browser всегда reload page",
            "Очередь Promise очищается",
            "React crash guaranteed",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое паттерн отмены в async-системах?",
          answers: [
            "Возможность отменять async-операции",
            "Promise retry",
            "Очистка DOM",
            "SSR hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему AbortController важен в React apps?",
          answers: [
            "Позволяет отменять запросы при unmount/navigation",
            "Удаляет re-render",
            "Ускоряет DOM",
            "Делает requests synchronous",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в async-программировании?",
          answers: [
            "Heavy sync work на main thread",
            "Error handling",
            "Request cancellation",
            "Promise.all batching",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей async-архитектурой?",
          answers: [
            "Предсказуемые async-flows с cancellation, error handling и контролем backpressure",
            "Вложенные callbacks повсюду",
            "Игнорирование Promise rejection",
            "Бесконечные цепочки microtasks",
          ],
          correctAnswer: 0,
        },
      ],
      "react-basics": [
        {
          question: "Почему reconciliation может становиться bottleneck?",
          answers: [
            "Большие операции diff для subtree",
            "CSS-модули",
            "Кэш браузера",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что чаще всего вызывает expensive re-render tree?",
          answers: [
            "Shared state высоко в дереве компонентов",
            "useMemo",
            "Suspense",
            "React.lazy",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему нестабильность ссылок опасна?",
          answers: [
            "Ломает memoization и shallow comparison",
            "Удаляет state",
            "Ломает JSX",
            "Отключает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему React relies on immutability?",
          answers: [
            "Для efficient обнаружения изменений",
            "Browser требует immutable objects",
            "Promise работают только с immutable",
            "React запрещает mutation runtime",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать hydration mismatch?",
          answers: [
            "Разный вывод server/client render",
            "useCallback",
            "React.memo",
            "CSS-модули",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему browser-only API опасны в SSR?",
          answers: [
            "Они отсутствуют на сервере",
            "Браузерный APIs synchronous",
            "React отключает SSR",
            "Очередь Promise ломается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tearing в concurrent rendering?",
          answers: [
            "Несогласованное состояние UI между renders",
            "Browser repaint bug",
            "DOM deletion",
            "CSS issue",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему stale props/state опасны?",
          answers: [
            "UI может использовать устаревшие данные",
            "React automatically retries stale data",
            "Browser ignores stale state",
            "Suspense removes stale state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое render waterfall?",
          answers: [
            "Последовательная цепочка render и data fetching",
            "Очередь repaint в браузере",
            "CSS loading order",
            "Парсинг DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему render waterfall — проблема?",
          answers: [
            "Увеличивает TTFB и задержку загрузки",
            "Ускоряет hydration",
            "Удаляет async-операции",
            "Уменьшает bundle size",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое Suspense boundary?",
          answers: [
            "Граница fallback/loading state",
            "Кэш браузера boundary",
            "DOM renderer",
            "Promise cancellation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему крупные Context providers опасны?",
          answers: [
            "Вызывают каскадные re-render",
            "Удаляют memoization",
            "Падение браузера guaranteed",
            "Ломают hooks order",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое side-effect во время render phase?",
          answers: [
            "Side-effect во время render",
            "useEffect cleanup",
            "Promise rejection",
            "SSR hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему side-effect во время render phases считаются anti-pattern?",
          answers: [
            "Render должен быть pure",
            "Browser запрещает effects",
            "Hooks перестают работать",
            "React удаляет state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое state colocation?",
          answers: [
            "Хранение state максимально близко к использования",
            "Global state everywhere",
            "SSR-only state",
            "DOM state storage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему state colocation полезен?",
          answers: [
            "Уменьшает лишние re-render",
            "Удаляет need for Context",
            "Делает React synchronous",
            "Ускоряет browser rendering always",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое concurrent rendering?",
          answers: [
            "Возможность React прерывать/приоритизировать работу render",
            "Browser parallel DOM",
            "SSR-рендеринг only",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему стабильность key важна?",
          answers: [
            "React использует keys для reconciliation идентичности",
            "Keys ускоряют сеть",
            "Keys управляют hooks",
            "Keys уменьшают bundle size",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в React-архитектуре?",
          answers: [
            "Shared mutable state + uncontrolled renders",
            "Component composition",
            "Иммутабельное обновлениеs",
            "Lazy loading",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей React-архитектуре?",
          answers: [
            "Предсказуемый render, изолированный state и масштабируемые границы компонентов",
            "Global Context для всего",
            "Heavy business logic inside render",
            "Анонимные inline-функции и объекты повсюду",
          ],
          correctAnswer: 0,
        },
      ],
      "react-hooks": [
        {
          question: "Почему excessive useEffect использования считается smell?",
          answers: [
            "Часто указывает на неправильную архитектуру state/data flow",
            "useEffect deprecated",
            "Browser не оптимизирует useEffect",
            "Hooks async only",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое проблема stale closure?",
          answers: [
            "Callback использует устаревшие значения state/props",
            "Closure удаляется GC",
            "React ломает hooks order",
            "Очередь Promise corruption",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему stale closures особенно опасны в async callbacks?",
          answers: [
            "Async logic может работать с устаревшим state",
            "Browser блокирует async callbacks",
            "React удаляет callbacks",
            "Suspense ломает async",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern для useEffect dependencies?",
          answers: [
            "Игнорирование exhaustive-deps без причины",
            "Cleanup function",
            "useRef использования",
            "Functional updates",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большие dependency array могут быть smell?",
          answers: [
            "useEffect делает слишком много ответственности",
            "Browser limit exceeded",
            "React не поддерживает большие arrays",
            "Promise cancellation ломается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое нестабильность ссылок?",
          answers: [
            "Постоянное создание новых ссылок на объекты и функции",
            "Кэш браузера invalidation",
            "DOM reconciliation",
            "SSR mismatch",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему нестабильность ссылок опасна?",
          answers: [
            "Ломает memoization/render-оптимизацию",
            "Удаляет state",
            "Отключает hooks",
            "Ломает JSX",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему крупные Context providers опасны?",
          answers: [
            "Вызывают каскадные re-render",
            "Падение браузераes",
            "Hooks перестают работать",
            "Suspense ломается",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tearing в concurrent rendering?",
          answers: [
            "Несогласованное состояние UI между renders",
            "CSS-tearing",
            "Повреждение DOM",
            "Гонка Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда useRef предпочтительнее useState?",
          answers: [
            "Когда изменения не должны вызывать re-render",
            "Для UI-rendering",
            "Для derived JSX",
            "Для hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое side-effect во время render phase?",
          answers: [
            "Side-effect во время render",
            "Cleanup effect",
            "Browser repaint",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему side-effect во время render phases опасны?",
          answers: [
            "Render должен быть pure и deterministic",
            "Browser запрещает side-effects",
            "useEffect не работает",
            "React удаляет component",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое state colocation?",
          answers: [
            "Хранение state рядом с местом использования",
            "Один global store",
            "DOM-based state",
            "SSR state layer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему state colocation полезен?",
          answers: [
            "Уменьшает лишние re-render/общую сложность",
            "Удаляет Context",
            "Делает React synchronous",
            "Ускоряет hydration always",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему over-memoization считается problem?",
          answers: [
            "Memoization тоже имеет runtime-стоимость",
            "React запрещает memoization",
            "Browser ломает cache",
            "Suspense incompatible with memoization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое граница custom hook?",
          answers: [
            "Изолированная переиспользуемая stateful-логика",
            "Браузерный рендеринг layer",
            "DOM abstraction",
            "Promise isolation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему глубоко вложенная логика hooks опасен?",
          answers: [
            "Усложняет понимание и debugging",
            "React перестаёт оптимизировать hooks",
            "Переполнение памяти браузера",
            "Hooks становятся sync",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что может вызвать memory leak в hooks?",
          answers: [
            "Неочищенные subscriptions, listeners и async tasks",
            "useMemo",
            "useCallback",
            "JSX fragments",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в hooks architecture?",
          answers: [
            "Business logic размазана по множеству effects",
            "Custom hooks",
            "Functional updates",
            "Cleanup functions",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей hooks architecture?",
          answers: [
            "Предсказуемые изолированные effects и переиспользуемые stateful-абстракции",
            "useEffect для всей логики приложения",
            "Global Context для всего state",
            "Conditional hooks everywhere",
          ],
          correctAnswer: 0,
        },
      ],
      "typescript": [
        {
          question: "Почему any считается dangerous в large-scale системах?",
          answers: [
            "Разрушает гарантии типов и масштабируемую архитектуру типизации",
            "Падение браузера",
            "Удаляет runtime-валидация",
            "Ломает JSX",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему unknown безопаснее any?",
          answers: [
            "Требует явного type narrowing",
            "Automatically validates API",
            "Работает быстрее compile-time",
            "Удаляет runtime errors",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое distributive conditional types?",
          answers: [
            "Conditional types, применяющиеся к элементам union отдельно",
            "Browser runtime typing",
            "DOM conditional rendering",
            "React условный вызов hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое infer в TypeScript?",
          answers: [
            "Извлечение типа внутри conditional types",
            "Runtime inference",
            "Парсинг браузером",
            "JSX optimizer",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему глубоко вложенные generics могут быть problem?",
          answers: [
            "Усложняют поддержку и читаемость типов",
            "React не поддерживает generics",
            "Browser не оптимизирует generics",
            "JSX incompatible with generics",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое structural typing?",
          answers: [
            "Совместимость типов по структуре",
            "Runtime-проверка типов",
            "DOM reconciliation",
            "Валидация типов браузером",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему structural typing иногда dangerous?",
          answers: [
            "Несовместимые бизнес-сущности могут совпасть по shape",
            "Падение браузера",
            "Удаляет narrowing",
            "Ломает inference",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое branded type?",
          answers: [
            "Искусственно уникализированный type",
            "Браузерный тип",
            "DOM abstraction",
            "React internal type",
          ],
          correctAnswer: 0,
        },
        {
          question: "Для чего используют branded types?",
          answers: [
            "Для предотвращения случайного смешивания типов",
            "Для SSR-рендеринг",
            "Для Promise typing",
            "Для JSX rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему runtime-валидация всё ещё нужен с TypeScript?",
          answers: [
            "TypeScript существует только compile-time",
            "TypeScript автоматически валидирует API",
            "Browser удаляет invalid data",
            "JSON.parse автоматически типизирован",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое type narrowing?",
          answers: [
            "Уточнение union type через проверки",
            "Runtime-преобразование типа",
            "DOM optimization",
            "Browser inference",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в TypeScript?",
          answers: [
            "Excessive any/type assertions everywhere",
            "Strict typing",
            "Generics",
            "Utility types",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему type assertions могут быть dangerous?",
          answers: [
            "Можно обмануть type system",
            "Browser rejects assertions",
            "Assertions remove runtime",
            "React breaks with assertions",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое проблема covariance/contravariance?",
          answers: [
            "Особенности совместимости generic function types",
            "DOM-рендеринг issue",
            "Кэш браузера invalidation",
            "Promise synchronization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое exhaustive checking?",
          answers: [
            "Проверка покрытия всех union cases",
            "Runtime-валидация",
            "Проверка совместимости браузера",
            "JSX reconciliation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему exhaustive checking полезен?",
          answers: [
            "Помогает избегать необработанных состояний",
            "Ускоряет compile",
            "Удаляет runtime checks",
            "Заменяет tests",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое utility types?",
          answers: [
            "Встроенные helper types TypeScript",
            "Runtime-утилиты",
            "Браузерный APIs",
            "React middleware",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему excessive сложная типизация может быть problem?",
          answers: [
            "Type system становится сложной в поддержке",
            "Browser перестаёт оптимизировать JS",
            "React Hooks ломаются",
            "JSX becomes invalid",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей TypeScript architecture?",
          answers: [
            "Строгие предсказуемые типы и поддерживаемые абстракции",
            "any-first подход",
            "Type assertions повсюду",
            "Доверие API без runtime-проверок",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей практикой в enterprise TypeScript-приложениях?",
          answers: [
            "Максимально explicit scalable typing с runtime-валидация границами",
            "Использовать any для скорости",
            "Хранить типы внутри только в components",
            "Избегать generics completely",
          ],
          correctAnswer: 0,
        },
      ],
      "state-management": [
        {
          question: "Почему чрезмерный global state считается anti-pattern?",
          answers: [
            "Увеличивает coupling и лишние re-render",
            "React требует localStorage",
            "Падение браузера",
            "Удаляет memoization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое normalized state?",
          answers: [
            "Хранение данных без дублирования и неконсистентности вложенных данных",
            "CSS normalization",
            "DOM optimization",
            "Кэш браузера",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему normalized state важен в large-scale приложениях?",
          answers: [
            "Упрощает updates, selectors и консистентность кэша",
            "Удаляет reducers",
            "Делает React synchronous",
            "Ускоряет SSR automatically",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему shared mutable state опасен?",
          answers: [
            "Может вызывать непредсказуемые side-effects",
            "Улучшает debugging",
            "React автоматически sync state",
            "Браузер предотвращает mutation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое memoization selectors?",
          answers: [
            "Кэширование вычислений derived state",
            "DOM memoization",
            "Browser repaint caching",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему memoization selectors полезен?",
          answers: [
            "Уменьшает лишние пересчёты и re-render",
            "Удаляет state",
            "Делает reducers асинхронными",
            "Ускоряет сеть",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в reducers?",
          answers: [
            "Side-effects внутри reducer",
            "Иммутабельное обновлениеs",
            "Pure functions",
            "Обновления через actions",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему reducers должны быть pure?",
          answers: [
            "Для предсказуемых переходов state",
            "Browser требует pure reducers",
            "React Hooks иначе ломаются",
            "Очередь Promise corruption",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое optimistic update?",
          answers: [
            "UI update до подтверждения сервера",
            "Browser repaint optimization",
            "DOM-мутация strategy",
            "SSR hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Главный риск optimistic updates?",
          answers: [
            "Сложность rollback при ошибках",
            "React запрещает optimistic UI",
            "Кэш браузера corruption",
            "Hooks instability",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему server state отличается от client state?",
          answers: [
            "Имеет другой lifecycle и sync strategy",
            "Browser хранит отдельно",
            "React Hooks incompatible",
            "Server state immutable always",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает React Query/TanStack Query?",
          answers: [
            "Синхронизация server state и управление кэшем",
            "DOM-рендеринг",
            "CSS-оптимизация",
            "Reducer generation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое проблема stale cache?",
          answers: [
            "UI использует устаревшие server data",
            "Проблема repaint в браузере",
            "DOM reconciliation",
            "Promise cancellation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему cache invalidation считается сложной задачей?",
          answers: [
            "Нужно поддерживать консистентность между UI и сервером",
            "Кэш браузера automatic",
            "React removes stale cache",
            "Redux solves automatically",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое single source of truth?",
          answers: [
            "Один авторитетный источник state",
            "Один reducer",
            "Один component",
            "Один API request",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему дублированный state dangerous?",
          answers: [
            "Может приводить к неконсистентному UI",
            "Улучшает performance",
            "Browser оптимизирует дублированный state",
            "React требует дублированный state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое event-driven state architecture?",
          answers: [
            "Изменения state через events/actions",
            "Событие браузера bubbling",
            "DOM-рендеринг",
            "CSS transition system",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в enterprise управление состоянием?",
          answers: [
            "Бизнес-критичная логика размазана по случайным компонентам",
            "Централизованный API layer",
            "Нормализованные entities",
            "Предсказуемые reducers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему colocated state preferred when possible?",
          answers: [
            "Уменьшает общую сложность/re-render propagation",
            "Делает SSR faster always",
            "Удаляет Context API",
            "Browser требует local state",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей управление состоянием architecture?",
          answers: [
            "Predictable isolated scalable state границами",
            "Один огромный global store для всего",
            "Shared mutable state повсюду",
            "Side-effects прямо внутри reducers",
          ],
          correctAnswer: 0,
        },
      ],
      "nextjs": [
        {
          question: "Почему полный SSR может быть expensive?",
          answers: [
            "Высокая нагрузка на сервер и задержка TTFB",
            "Browser не поддерживает SSR",
            "React не оптимизирован для SSR",
            "CSS перестаёт работать",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда SSG предпочтительнее SSR?",
          answers: [
            "Для почти статичного контента",
            "Для realtime dashboards",
            "Для live trading systems",
            "Для WebSocket-приложений",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое ISR?",
          answers: [
            "Incremental Static Regeneration",
            "Internal State Rendering",
            "Indexed Server Routing",
            "Incremental Suspense Rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Главное преимущество ISR?",
          answers: [
            "Обновление static pages без полного rebuild",
            "Полное удаление SSR",
            "Только browser-side rendering",
            "Автоматическая memoization React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему hydration mismatch опасен?",
          answers: [
            "Может приводить к сломанному интерактивному UI",
            "Browser reloads automatically",
            "React игнорирует mismatch",
            "CSS-модули ломаются",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что чаще всего вызывает hydration mismatch?",
          answers: [
            "Разный server/client output",
            "useMemo",
            "React.lazy",
            "CSS-переменные",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему browser APIs опасны в Server Components?",
          answers: [
            "Они недоступны на сервере",
            "Браузерный APIs async only",
            "React блокирует browser APIs",
            "Server Components работают в DOM",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое главное преимущество React Server Components?",
          answers: [
            "Меньше client-side JavaScript",
            "Более быстрый DOM repaint",
            "Удаление сеть requests",
            "Только browser-side rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему избыточные client components — проблема?",
          answers: [
            "Увеличивают hydration и bundle size",
            "React запрещает client components",
            "SSR перестаёт работать",
            "Падение браузераes immediately",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что делает \"use client\"?",
          answers: [
            "Помечает component как client-side interactive",
            "Включает SSR",
            "Делает статическим компонентом",
            "Удаляет hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое streaming SSR?",
          answers: [
            "Постепенная отправка HTML chunks клиенту",
            "Только browser-side streaming",
            "DOM streaming API",
            "Оптимизация CSS streaming",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему streaming SSR полезен?",
          answers: [
            "Улучшает воспринимаемую скорость загрузки",
            "Удаляет необходимость Suspense",
            "Кэш браузера automatic",
            "Удаляет hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое edge runtime?",
          answers: [
            "Выполнение логику ближе к пользователю на edge nodes",
            "Browser runtime",
            "Движок выполнения DOM",
            "Слой обработки CSS",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда edge runtime особенно полезен?",
          answers: [
            "Low-latency middleware и personalization",
            "Тяжёлый CPU-rendering",
            "доступ к localStorage",
            "Браузерный рендеринг",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему неконтролируемые fetch waterfalls — проблема?",
          answers: [
            "Увеличивают цепочку задержек",
            "Browser blocks сеть",
            "React removes requests",
            "CSS loading breaks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое cache revalidation?",
          answers: [
            "Обновление устаревшего кэшированного контента",
            "DOM reconciliation",
            "Browser repaint",
            "React hydration retry",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему стратегия кэширования критически важна в Next.js?",
          answers: [
            "Влияет на performance, cost и scalability",
            "Кэш браузера всё решает автоматически",
            "React не использует caching",
            "SSR не требует caching",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в Next.js-приложениях?",
          answers: [
            "Рендер всего на клиенте по умолчанию",
            "ISR использования",
            "Streaming SSR",
            "Code splitting на уровне роутов",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему route-level code splitting полезен?",
          answers: [
            "Уменьшает начальный bundle size",
            "Удаляет hydration",
            "Браузерный рендеринг becomes sync",
            "React останавливает reconciliation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей Next.js-архитектурой?",
          answers: [
            "Сбалансированные SSR/SSG/RSC/client границами под конкретный сценарий",
            "Full CSR для всего",
            "Full SSR для всего",
            "Всё приложение внутри одного client component",
          ],
          correctAnswer: 0,
        },
      ],
      "browser-dom": [
        {
          question: "Почему forced synchronous layout считается expensive?",
          answers: [
            "Browser вынужден немедленно пересчитывать layout",
            "React отключает batching",
            "DOM перестаёт обновляться",
            "CSS-модули ломаются",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что чаще всего вызывает layout thrashing?",
          answers: [
            "Чередование DOM writes и layout reads",
            "JSON.parse",
            "localStorage",
            "Promise.resolve",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большие DOM-деревья problematic?",
          answers: [
            "Увеличивают стоимость layout, paint и reconciliation",
            "Browser запрещает large DOM",
            "React удаляет nodes автоматически",
            "CSS-рендеринг stops",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое compositing layer?",
          answers: [
            "Отдельный GPU-rendered слой",
            "Кэш DOM-subtree",
            "Пул памяти браузера",
            "Render tree React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему анимации transform/opacity предпочтительнее?",
          answers: [
            "Обычно избегают стоимости layout/repaint",
            "Browser не поддерживает другие animations",
            "React требует GPU animations",
            "Они synchronous",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое paint bottleneck?",
          answers: [
            "Дорогие операции визуального repaint",
            "Проблема render через Promise",
            "SSR hydration mismatch",
            "Кэш браузера overflow",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему анимации box-shadow/filter дорогие?",
          answers: [
            "Требуют тяжёлых расчётов repaint",
            "Браузер отключает GPU",
            "Перестроение DOM tree",
            "Синхронный localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое event delegation?",
          answers: [
            "Один listener на parent вместо множества child listeners",
            "Browser repaint delegation",
            "DOM batching",
            "React scheduling",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему event delegation масштабируется?",
          answers: [
            "Уменьшает overhead listeners и памяти",
            "Удаляет bubbling",
            "Делает events synchronous",
            "React автоматически memoize handlers",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое passive event listener?",
          answers: [
            "Listener без блокировки preventDefault",
            "Только async-listener",
            "DOM observer",
            "Внутреннее событие React",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему passive listeners важны для scroll performance?",
          answers: [
            "Browser не ждёт preventDefault перед scrolling",
            "Scroll становится синхронным",
            "DOM batching улучшается",
            "Кэш браузера ускоряется",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое преимущество IntersectionObserver?",
          answers: [
            "Оптимизированное браузером отслеживание видимости",
            "Полная DOM-virtualization",
            "Планирование Promise",
            "CSS-reconciliation",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему polling хуже observers в большинстве cases?",
          answers: [
            "Создаёт лишнюю работу CPU",
            "Browser запрещает polling",
            "Observers синхронные",
            "Polling ломает hydration",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое memory leak в DOM-системах?",
          answers: [
            "Detached nodes/listeners удерживаются ссылками",
            "Переполнение repaint в браузере",
            "Повреждение памяти CSS",
            "Promise cancellation issue",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему неудалённые event listeners опасны?",
          answers: [
            "Удерживают ссылки в памяти после unmount",
            "Браузер автоматически очищает listeners",
            "React игнорирует listeners",
            "Перестроение DOM trees",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое reflow cascade?",
          answers: [
            "Пересчёт layout, затрагивающий большой subtree",
            "Очередь repaint в браузере",
            "Парсинг DOM chain",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему синхронный localStorage проблематичен?",
          answers: [
            "Блокирует main thread",
            "localStorage async",
            "Браузер удаляет localStorage в production",
            "React hydration автоматически падает",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern при работе с DOM?",
          answers: [
            "Частые forced layout recalculations",
            "Event delegation",
            "Passive listeners",
            "IntersectionObserver",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему virtualization важен для огромных списков?",
          answers: [
            "Уменьшает стоимость DOM/rendering",
            "Удаляет reconciliation полностью",
            "Браузер отключает layout",
            "CSS-рендеринг stops",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей DOM/performance strategy?",
          answers: [
            "Минимизировать layout thrashing, repaint и удержание памяти",
            "Direct DOM-мутацияs everywhere",
            "Огромные DOM-деревья",
            "Частые синхронные измерения",
          ],
          correctAnswer: 0,
        },
      ],
      "performance-optimization": [
        {
          question: "Что чаще всего становится bottleneck в больших React-приложениях?",
          answers: [
            "Excessive лишние re-render",
            "CSS-переменные",
            "HTML-атрибуты",
            "localStorage",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему нестабильность ссылок ломает optimization?",
          answers: [
            "Memoization и shallow comparison перестают работать",
            "Browser удаляет cache",
            "React отключает reconciliation",
            "DOM-узелs становятся immutable",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое render waterfall?",
          answers: [
            "Последовательная цепочка render и data dependencies",
            "Очередь repaint в браузере",
            "CSS-анимация chain",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему render waterfalls dangerous?",
          answers: [
            "Увеличивают latency и воспринимаемое время загрузки",
            "Ускоряют hydration",
            "Удаляют Suspense границами",
            "Кэш браузера overflow",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое layout thrashing?",
          answers: [
            "Частые forced layout recalculations",
            "Батчинг repaint в браузере",
            "DOM virtualization",
            "Парсинг CSS",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему layout thrashing expensive?",
          answers: [
            "Браузер многократно синхронно пересчитывает layout",
            "React перестаёт memoize components",
            "localStorage blocks rendering",
            "Очередь Promise overflows",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое long task?",
          answers: [
            "Задача main thread дольше 50 мс",
            "Длинная цепочка Promise",
            "Большой CSS-файл",
            "DOM subtree",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему long tasks — проблема?",
          answers: [
            "Блокируют отзывчивость input и UI",
            "Browser автоматически parallelize tasks",
            "React игнорирует long tasks",
            "Hydration становится быстрее",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое code splitting?",
          answers: [
            "Разделение bundle на меньшие chunks",
            "Разделение DOM",
            "CSS normalization",
            "Разделение Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему route-level code splitting полезен?",
          answers: [
            "Уменьшает начальный JS payload",
            "Удаляет hydration",
            "Browser repaint optimization",
            "React пропускает rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое tree shaking?",
          answers: [
            "Удаление неиспользуемых exports/code",
            "Очистка DOM",
            "Кэш браузера invalidation",
            "Планировщик React optimization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему большой bundle size опасен?",
          answers: [
            "Увеличивает стоимость download, parse и compile",
            "Browser automatically optimizes large bundles",
            "React игнорирует bundle size",
            "CSS stops rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое virtualization?",
          answers: [
            "Рендер только видимых элементов списка",
            "Virtual Очистка DOM",
            "Browser GPU rendering",
            "Батчинг Promise",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему virtualization критична для огромных наборов данных?",
          answers: [
            "Сильно снижает стоимость DOM/render",
            "Removes reconciliation полностью",
            "Browser skips layout forever",
            "Hydration becomes unnecessary",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое over-memoization?",
          answers: [
            "Excessive memoization with more overhead выше пользы",
            "Memory leak в браузере",
            "Внутренняя оптимизация React",
            "DOM scheduling issue",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему over-memoization harmful?",
          answers: [
            "Memoization тоже имеет runtime/comparison cost",
            "React crashes with memoization",
            "Browser blocks cached renders",
            "Suspense incompatible with memoization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое CPU-bound проблема render?",
          answers: [
            "Перегрузка render/вычислений на main thread",
            "Browser сеть bottleneck",
            "CSS repaint issue",
            "Promise rejection chain",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему тяжёлые синхронные вычисления опасны?",
          answers: [
            "Блокируют отзывчивость main thread",
            "Browser parallelizes automatically",
            "React переносит вычисления на GPU",
            "DOM-рендеринг unaffected",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в performance optimization?",
          answers: [
            "Преждевременная оптимизация повсюду",
            "Virtualization",
            "Lazy loading",
            "Code splitting",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей frontend performance strategy?",
          answers: [
            "Minimize rendering/layout/сеть/memory overhead based on profiling",
            "Слепо memoize всё подряд",
            "Всегда рендерить весь набор данных",
            "Тяжёлая синхронная работа во время render",
          ],
          correctAnswer: 0,
        },
      ],
      "frontend-system-design": [
        {
          question: "Что считается главным признаком плохой frontend-архитектура?",
          answers: [
            "Tight coupling между feature modules",
            "CSS-модули",
            "Разделение на уровне роутов",
            "Lazy loading",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему feature-based architecture масштабируется?",
          answers: [
            "Изолирует бизнес-домены и уменьшает coupling",
            "Удаляет необходимость routing",
            "Браузер быстрее рендерит features",
            "React автоматически memoize features",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое bounded context во frontend-архитектура?",
          answers: [
            "Изолированная бизнес-область с собственными границами",
            "Браузерный рендеринг context",
            "DOM subtree",
            "CSS-namespace",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему shared mutable modules опасны?",
          answers: [
            "Создают непредсказуемые side-effects между features",
            "Браузер запрещает shared modules",
            "React автоматически удаляет shared state",
            "CSS stops working",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое microfrontend-архитектура?",
          answers: [
            "Независимые frontend applications/modules",
            "Маленькие React-компонентs",
            "CSS isolation",
            "DOM virtualization",
          ],
          correctAnswer: 0,
        },
        {
          question: "Главный недостаток microfrontends?",
          answers: [
            "Сложность, интеграция и runtime-дублирование",
            "Несовместимость браузера",
            "Несовместимость React",
            "Нет поддержки SSR",
          ],
          correctAnswer: 0,
        },
        {
          question: "Когда microfrontends оправданы?",
          answers: [
            "Большие команды и независимое владение доменами",
            "Небольшие landing pages",
            "Простые dashboards",
            "Только static websites",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему централизованный API layer важен?",
          answers: [
            "Упрощает caching, retries и error handling",
            "Удаляет необходимость backend",
            "Делает React synchronous",
            "Заменяет routing",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern для API architecture?",
          answers: [
            "API logic размазана по случайным UI-компонентам",
            "Общий API client",
            "Query abstraction",
            "Error границами",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему colocated state предпочтителен, когда возможно?",
          answers: [
            "Уменьшает render propagation/общую сложность",
            "Browser требует local state",
            "Удаляет hydration",
            "Makes React synchronous",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое render boundary?",
          answers: [
            "Изолированная часть UI с независимым render lifecycle",
            "Зона repaint в браузере",
            "CSS-boundary",
            "Только DOM root",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему изоляция render важен?",
          answers: [
            "Ограничивает каскадные re-render",
            "Удаляет reconciliation",
            "Browser skips layout",
            "React removes hooks",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое design system?",
          answers: [
            "Централизованная переиспользуемая UI-основа",
            "Браузерный рендеринг engine",
            "DOM-планировщик",
            "CSS compiler",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему неконтролируемые design systems опасны?",
          answers: [
            "Неконсистентность UI и проблемы масштабирования",
            "Падение браузераes",
            "React hydration падает",
            "DOM stops rendering",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое domain-driven frontend-архитектура?",
          answers: [
            "Архитектура, выровненная по бизнес-доменам",
            "Модель браузерного routing",
            "CSS-методология",
            "DOM partitioning",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему дублированная business logic опасна?",
          answers: [
            "Неконсистентное поведение и сложность поддержки",
            "React ignores duplicated logic",
            "Кэш браузера corruption",
            "Hooks stop working",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается anti-pattern в enterprise frontend-системах?",
          answers: [
            "Business logic tightly coupled to UI",
            "API abstraction",
            "Component composition",
            "Feature границами",
          ],
          correctAnswer: 0,
        },
        {
          question: "Почему observability важен во frontend-системах?",
          answers: [
            "Помогает debugging, performance и анализу инцидентов",
            "Браузер уже автоматически отслеживает всё",
            "React DevTools достаточно для production",
            "Observability касается только backend",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что такое scalable frontend-архитектура?",
          answers: [
            "Предсказуемая модульная поддерживаемая система, которую можно безопасно развивать",
            "Одно огромное глобальное приложение",
            "Единый global state для всего",
            "Вся логика внутри pages/components",
          ],
          correctAnswer: 0,
        },
        {
          question: "Что считается хорошей enterprise frontend-архитектура?",
          answers: [
            "Clear границами + isolated domains + predictable data/render flows",
            "Shared mutable state повсюду",
            "UI tightly coupled with сетьing/business logic",
            "Одно монолитное дерево компонентов",
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
};

export function getTrainerTopic(
  specialty: TrainerSpecialty,
  topicId: string,
) {
  return trainerTopics[specialty].find((topic) => topic.id === topicId) ?? null;
}

export function getTrainerQuestionSet(
  specialty: TrainerSpecialty,
  grade: TrainerGrade,
  topicId: string,
): TrainerQuestion[] {
  const topic = getTrainerTopic(specialty, topicId);

  if (!topic) {
    return [];
  }

  return [...(topicQuestionBank[specialty]?.[grade]?.[topicId] ?? [])];
}

export function getTrainerQuestionPool() {
  return trainerSpecialties.flatMap((specialty) =>
    trainerGrades.flatMap((grade) =>
      trainerTopics[specialty].flatMap((topic) =>
        getTrainerQuestionSet(specialty, grade, topic.id),
      ),
    ),
  );
}

export function getTrainerQuestionCount() {
  return getTrainerQuestionPool().length;
}
