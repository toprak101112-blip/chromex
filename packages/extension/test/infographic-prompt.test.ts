import { describe, expect, test } from "vitest";

import { buildInfographicPrompt } from "../src/infographic-prompt.js";

describe("buildInfographicPrompt", () => {
  test("builds a simple locale-aware infographic prompt from current page data", () => {
    const prompt = buildInfographicPrompt({
      locale: "ko",
      pageTitle: "AI 시장 보고서",
      pageUrl: "https://example.com/report",
    });

    expect(prompt).toContain("Create a polished infographic image that makes this page easy to understand.");
    expect(prompt).toContain("Locale/culture: 한국어 (ko).");
    expect(prompt).toContain("Use the attached current-page context as the source of truth.");
    expect(prompt).toContain("Choose the layout, aspect ratio, composition, and visual structure freely");
    expect(prompt).toContain("AI 시장 보고서");
    expect(prompt).not.toContain("gpt-image-2");
    expect(prompt).not.toContain("1024x1536");
    expect(prompt).not.toContain("vertical poster");
  });

  test("keeps source context separate from generation instructions", () => {
    const prompt = buildInfographicPrompt({
      locale: "en",
      pageTitle: "Quarterly revenue dashboard",
      pageUrl: "https://example.com/dashboard",
    });

    expect(prompt).toContain("Instructions:");
    expect(prompt).toContain("Source:");
    expect(prompt).toContain("Use the attached current-page context as the source of truth.");
    expect(prompt).not.toContain("<script");
  });

  test("uses a concise video focus hint for YouTube pages", () => {
    const prompt = buildInfographicPrompt({
      locale: "ko",
      pageTitle: "State of the Claw",
      pageUrl: "https://www.youtube.com/watch?v=demo",
      adapterPayload: { platform: "youtube", currentTimeSeconds: 92, transcriptSegments: [] },
    });

    expect(prompt).toContain("Page focus: explain the video through its main story, key moments, and takeaway.");
  });

  test("uses a concise paper focus hint for arxiv and PDF research pages", () => {
    const prompt = buildInfographicPrompt({
      locale: "en",
      pageTitle: "Attention Is All You Need",
      pageUrl: "https://arxiv.org/abs/1706.03762",
      adapterPayload: { platform: "arxiv", arxivId: "1706.03762" },
    });

    expect(prompt).toContain("Page focus: explain the paper through problem, method, evidence, result, limitation, and implication.");
  });

  test("uses a concise news focus hint for news pages", () => {
    const prompt = buildInfographicPrompt({
      locale: "ko",
      pageTitle: "속보 기사",
      pageUrl: "https://news.naver.com/article/001/0000000000",
      adapterPayload: { platform: "news", region: "kr" },
    });

    expect(prompt).toContain("Page focus: explain what happened, why it matters, and what to watch next.");
  });

  test("uses a concise information focus hint for reference and work pages", () => {
    const prompt = buildInfographicPrompt({
      locale: "en",
      pageTitle: "Project workspace",
      pageUrl: "https://www.notion.so/team/project",
      adapterPayload: { platform: "notion" },
    });

    expect(prompt).toContain("Page focus: turn the page into a simple map, checklist, process, or comparison.");
  });
});
