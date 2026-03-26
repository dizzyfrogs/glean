import { NextResponse } from "next/server";
import { MOCK_WASTE_LOGS } from "@/lib/mock-data";

const TODAY = "2026-03-25";

function daysAgo(n: number): string {
  const d = new Date(TODAY + "T12:00:00");
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}


export async function GET() {
  const thirtyDaysAgo = daysAgo(30);
  const recentLogs = MOCK_WASTE_LOGS.filter((l) => l.date >= thirtyDaysAgo);

  const categoryTotals: Record<string, number> = {};
  for (const log of recentLogs) {
    categoryTotals[log.category] = (categoryTotals[log.category] || 0) + log.qty_lbs;
  }

  const dowTotals: Record<number, { total: number; count: number }> = {};
  for (const log of recentLogs) {
    const dow = new Date(log.date + "T12:00:00").getDay();
    if (!dowTotals[dow]) dowTotals[dow] = { total: 0, count: 0 };
    dowTotals[dow].total += log.qty_lbs;
    dowTotals[dow].count += 1;
  }
  const dowAverages: Record<number, number> = {};
  for (const [dow, { total, count }] of Object.entries(dowTotals)) {
    dowAverages[Number(dow)] = total / count;
  }

  const itemTotals: Record<string, number> = {};
  for (const log of recentLogs) {
    itemTotals[log.item] = (itemTotals[log.item] || 0) + log.qty_lbs;
  }
  const top5 = Object.entries(itemTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key configured." }, { status: 503 });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const systemPrompt = `You are a food sustainability advisor for a university campus kitchen. \
Analyze the waste data and return exactly 3 suggestions for the kitchen manager on how to reduce waste. \
Be specific — name the actual items and days from the data. Write plainly, like you are talking to a chef, not writing a report. \
Each suggestion must have:
- type: one of "portion" or "menu"
- title: a short phrase, 6 to 10 words
- text: 2 to 3 sentences, specific and practical

Respond ONLY with valid JSON in this exact shape: {"recommendations":[{"type":"...","title":"...","text":"..."}]}`;

    const userPrompt = `Here is the last 30 days of waste data for this kitchen:

Category totals (lbs): ${Object.entries(categoryTotals).map(([c, v]) => `${c}: ${v.toFixed(1)}`).join(", ")}
Day-of-week averages (lbs): ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => `${d}: ${(dowAverages[i] || 0).toFixed(1)}`).join(", ")}
Top 5 wasted items: ${top5.map(([item, lbs]) => `${item} (${lbs.toFixed(1)} lbs)`).join("; ")}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });

    const content = response.choices[0].message.content ?? "";
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
