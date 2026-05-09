type ResumeFillInTextProps = {
  text: string;
  highlight?: boolean;
};

const fillInPattern =
  /(\[[^\]\n]{1,96}\]|\$X(?:\s+(?:revenue|ARR|MRR|pipeline|budget|savings|costs?))?|\bX%|\b(?:X|Y|N)[ -]?(?:users|customers|clients|accounts|requests|tickets|projects|features|markets|teams?|people|engineers|hours\/week|hours|weeks|months|days|ms|seconds|minutes|revenue|ARR|MRR|conversion|retention|churn|costs?|budget|savings|growth|reduction|increase|decrease)\b)/gi;

export function ResumeFillInText({ text, highlight = true }: ResumeFillInTextProps) {
  if (!highlight) {
    return <>{text}</>;
  }

  return <>{renderFillInHighlights(text)}</>;
}

function renderFillInHighlights(text: string) {
  const nodes: React.ReactNode[] = [];
  const regex = new RegExp(fillInPattern.source, "gi");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    const start = match.index;
    const value = match[0];

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <span
        key={`${value}-${start}`}
        className="rounded-md bg-[#EF4444]/10 px-1 py-0.5 font-bold text-[#B91C1C] ring-1 ring-[#EF4444]/20"
      >
        {value}
      </span>,
    );

    lastIndex = start + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
