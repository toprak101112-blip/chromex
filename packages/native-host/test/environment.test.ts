import { describe, expect, test } from "vitest";

import { createBridgeProcessEnv, normalizeNativeHostPath } from "../src/index.js";

describe("createBridgeProcessEnv", () => {
  test("forwards only the allowlisted environment values needed by the bridge", () => {
    const env = createBridgeProcessEnv(
      {
        Path: "C:\\Program Files\\nodejs;C:\\Users\\example\\AppData\\Roaming\\npm",
        HOME: "/Users/example",
        COMSPEC: "C:\\Windows\\System32\\cmd.exe",
        HTTPS_PROXY: "http://proxy.internal:8080",
        OPENAI_API_KEY: "test-openai-key",
        AWS_SECRET_ACCESS_KEY: "should-not-leak",
      },
      { codexBinPath: "/opt/codex/bin/codex" },
    );

    expect(env.PATH).toBe("C:\\Program Files\\nodejs;C:\\Users\\example\\AppData\\Roaming\\npm");
    expect(env.HOME).toBe("/Users/example");
    expect(env.ComSpec).toBe("C:\\Windows\\System32\\cmd.exe");
    expect(env.HTTPS_PROXY).toBe("http://proxy.internal:8080");
    expect(env.OPENAI_API_KEY).toBe("test-openai-key");
    expect(env.CODEX_BIN).toBe("/opt/codex/bin/codex");
    expect(env.AWS_SECRET_ACCESS_KEY).toBeUndefined();
  });

  test("accepts quoted BRIDGE_ENTRY paths from Windows launcher environments", () => {
    expect(normalizeNativeHostPath('"C:\\Program Files\\Chromex\\bridge\\cli.js"')).toBe(
      "C:\\Program Files\\Chromex\\bridge\\cli.js",
    );
    expect(normalizeNativeHostPath("'C:\\Users\\example\\AppData\\Local\\Chromex\\bridge\\cli.js'")).toBe(
      "C:\\Users\\example\\AppData\\Local\\Chromex\\bridge\\cli.js",
    );
  });
});
