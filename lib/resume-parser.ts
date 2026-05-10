const MAX_RESUME_CHARS = 40_000;
const MAX_VACANCY_CHARS = 24_000;
let isPdfWorkerConfigured = false;

export async function parseResumeFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "text/plain" || name.endsWith(".txt")) {
    return normalizeResumeText(buffer.toString("utf8")).slice(0, MAX_RESUME_CHARS);
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const text = await extractDocxText(buffer);
    return normalizeResumeText(text).slice(0, MAX_RESUME_CHARS);
  }

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const text = await extractPdfText(buffer);
    return normalizeResumeText(text).slice(0, MAX_RESUME_CHARS);
  }

  throw new Error("Неподдерживаемый тип файла. Загрузите PDF, DOCX или TXT.");
}

export async function resolveVacancyInput(vacancyText?: string) {
  const directText = normalizeText(vacancyText ?? "");

  if (directText.length > 20) {
    return directText.slice(0, MAX_VACANCY_CHARS);
  }

  throw new Error("Добавьте текст вакансии.");
}

async function extractDocxText(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });

  return result.value;
}

async function extractPdfText(buffer: Buffer) {
  const [{ PDFParse }, path, { pathToFileURL }] = await Promise.all([
    import("pdf-parse"),
    import("node:path"),
    import("node:url"),
  ]);

  if (!isPdfWorkerConfigured) {
    PDFParse.setWorker(
      pathToFileURL(
        path.join(
          process.cwd(),
          "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
        ),
      ).href,
    );
    isPdfWorkerConfigured = true;
  }

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeResumeText(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
