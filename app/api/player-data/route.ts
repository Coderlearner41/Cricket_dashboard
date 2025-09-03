// app/api/player-data/route.ts
import { NextResponse } from "next/server";

const DEFAULT_PLAYER = "Virat Kohli";

function makeDummyData(player: string) {
  // Generate a simple seed based on the player's name
  const seed = player.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 7;

  const baseRuns = 9500 + seed * 120;
  const baseWickets = 10 + (seed % 3) * 5;
  const baseSR = 90 + (seed % 5) * 2;
  const baseAvg = 52 + (seed % 4);

  const performanceTrend = Array.from({ length: 10 }, (_, i) => ({
    match: i + 1,
    runs: Math.max(0, Math.round(30 + ((i * 11 + seed * 3) % 80))),
    wickets: (i + seed) % 5 === 0 ? 2 : (i + seed) % 7 === 0 ? 3 : 0,
  }));

  const careerProgression = [
    { year: 2016, runs: baseRuns - 1200, wickets: baseWickets - 2 },
    { year: 2018, runs: baseRuns - 800, wickets: baseWickets },
    { year: 2020, runs: baseRuns - 300, wickets: baseWickets + 1 },
    { year: 2022, runs: baseRuns - 100, wickets: baseWickets + 2 },
    { year: 2024, runs: baseRuns, wickets: baseWickets + 2 },
  ];

  const summary = {
    matches: 265 + seed * 3,
    runs: baseRuns,
    strikeRate: baseSR,
    average: baseAvg,
    wickets: baseWickets,
    economy: 5.1 + (seed % 3) * 0.2,
  };

  const comparisons = {
    labels: ["Runs", "Strike Rate", "Average", "Wickets"],
    self: [summary.runs / 100, summary.strikeRate, summary.average, summary.wickets],
    peer: [
      (summary.runs - 500) / 100,
      summary.strikeRate - 3,
      summary.average - 2,
      Math.max(0, summary.wickets - 2),
    ],
  };

  return {
    player,
    summary,
    performanceTrend,
    careerProgression,
    comparisons,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const player = url.searchParams.get("player") || DEFAULT_PLAYER;

    // Replace this with your Gemini API call if needed
    const data = makeDummyData(player);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[v0] /api/player-data error:", err?.message || err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
