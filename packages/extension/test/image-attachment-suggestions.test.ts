import { describe, expect, test } from "vitest";

import { createImageAttachmentSuggestionCards } from "../src/sidepanel/image-attachment-suggestions.js";
import { getUiStrings } from "../src/sidepanel/i18n.js";

describe("image attachment suggestions", () => {
  test("creates prompt extraction and description cards for attached images", () => {
    const cards = createImageAttachmentSuggestionCards({
      attachments: [
        {
          id: "image-1",
          name: "landing-page.png",
          mimeType: "image/png",
          sizeBytes: 1000,
          lastModified: 1,
          base64: "abc",
          kind: "image",
        },
      ],
      locale: "ko",
    });

    expect(cards.map((card) => card.id)).toEqual([
      "image-attachment-prompt-extract",
      "image-attachment-describe",
    ]);
    expect(cards.map((card) => card.title)).toEqual([
      getUiStrings("ko").actionCards["image-attachment-prompt-extract"],
      getUiStrings("ko").actionCards["image-attachment-describe"],
    ]);
    expect(cards[0]?.prompt).toContain("landing-page.png");
    expect(cards[0]?.prompt).toContain("이미지 생성 프롬프트");
    expect(cards[0]?.prompt).toContain("한국어로 답해줘");
    expect(cards[0]?.prompt).not.toContain("reusable image-generation prompt");
    expect(cards[1]?.prompt).toContain("이미지");
    expect(cards[1]?.prompt).toContain("설명해줘");
  });

  test("does not create cards when no image is attached", () => {
    expect(
      createImageAttachmentSuggestionCards({
        attachments: [
          {
            id: "file-1",
            name: "notes.txt",
            mimeType: "text/plain",
            sizeBytes: 100,
            lastModified: 1,
            base64: "abc",
            kind: "text",
          },
        ],
        locale: "en",
      }),
    ).toEqual([]);
  });

  test("uses the selected UI language for generated prompts", () => {
    const cards = createImageAttachmentSuggestionCards({
      attachments: [
        {
          id: "image-1",
          name: "screen.png",
          mimeType: "image/png",
          sizeBytes: 1000,
          lastModified: 1,
          base64: "abc",
          kind: "image",
        },
      ],
      locale: "ja",
    });

    expect(cards[0]?.title).toBe(getUiStrings("ja").actionCards["image-attachment-prompt-extract"]);
    expect(cards[0]?.prompt).toContain("screen.png");
    expect(cards[0]?.prompt).toContain("日本語");
    expect(cards[0]?.prompt).not.toContain("Answer in Japanese");
    expect(cards[0]?.prompt).not.toMatch(/\{(?:imageList|outputLanguage|pluralSuffix)\}/u);
  });
});
