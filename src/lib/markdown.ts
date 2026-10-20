/** Минимальный markdown → HTML для экспорта статей. Без внешних зависимостей. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function mdToHtmlBody(md: string): string {
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let inTable = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };
  const closeTable = () => {
    if (inTable) {
      out.push("</tbody></table>");
      inTable = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\|(.+)\|$/.test(line.trim())) {
      const cells = line.trim().slice(1, -1).split("|");
      if (cells.every((c) => /^\s*:?-{2,}:?\s*$/.test(c))) continue; // разделитель
      if (!inTable) {
        closeList();
        out.push("<table><tbody>");
        inTable = true;
      }
      out.push(`<tr>${cells.map((c) => `<td>${inline(c.trim())}</td>`).join("")}</tr>`);
      continue;
    }
    closeTable();

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    closeList();
    if (!line.trim()) continue;
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  closeTable();
  return out.join("\n");
}

export function mdToHtml(md: string, title?: string): string {
  const body = mdToHtmlBody(md);
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>${esc(title || "Статья")}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;line-height:1.65;color:#18181b}
h1,h2,h3{line-height:1.3}table{border-collapse:collapse;width:100%;margin:16px 0}
td,th{border:1px solid #e4e4e7;padding:8px 10px;text-align:left}code{background:#f4f4f5;padding:2px 5px;border-radius:4px}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
