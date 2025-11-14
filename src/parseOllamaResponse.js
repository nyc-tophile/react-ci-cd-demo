export function parseOllamaResponse(rawText) {
  if (!rawText) return null;

  const summaryMatch = rawText.match(/\*\*Summary:\*\*([\s\S]*?)\*\*SQL Query:\*\*/);
  const queryMatch = rawText.match(/\*\*SQL Query:\*\*([\s\S]*?)\*\*Formatted Table:\*\*/);
  const tableMatch = rawText.match(/\*\*Formatted Table:\*\*([\s\S]*?)✅ Data formatted successfully/);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    query: queryMatch ? queryMatch[1].trim() : "",
    table: tableMatch ? tableMatch[1].trim() : "",
  };
}
