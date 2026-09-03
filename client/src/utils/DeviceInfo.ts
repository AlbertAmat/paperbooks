/**
 * Best-effort, dependency-free classification of a `User-Agent` string for
 * Settings > Active sessions / Recent logins - not a full UA-parsing
 * library, just enough to pick a sensible icon and a short label like
 * "Chrome · Windows". Deliberately kept client-side (rather than parsed on
 * the server) so unrecognized values can fall back to a translated string
 * via vue-i18n instead of a hardcoded English one.
 */

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export interface ParsedDevice {
    deviceType: DeviceType;
    /** e.g. "Chrome", "Safari" - null if it couldn't be determined. */
    browser: string | null;
    /** e.g. "Windows", "iPhone" - null if it couldn't be determined. */
    os: string | null;
}

const OS_PATTERNS: [RegExp, string][] = [
    [/iPad/, "iPad"],
    [/iPhone/, "iPhone"],
    [/Android/, "Android"],
    [/Macintosh|Mac OS X/, "macOS"],
    [/CrOS/, "ChromeOS"],
    [/Windows/, "Windows"],
    [/Linux/, "Linux"],
];

const BROWSER_PATTERNS: [RegExp, string][] = [
    [/Edg\//, "Edge"],
    [/OPR\/|Opera/, "Opera"],
    [/Firefox\//, "Firefox"],
    [/CriOS\//, "Chrome"],
    [/Chrome\//, "Chrome"],
    [/Safari\//, "Safari"],
];

/** Classifies a raw `User-Agent` string. Returns all-null/"unknown" for a missing or unrecognized value. */
export function parseUserAgent(userAgent: string | null | undefined): ParsedDevice {
    if (!userAgent) {
        return {deviceType: "unknown", browser: null, os: null};
    }

    const os = OS_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null;

    // Safari's own UA also matches Chrome's "Safari/" suffix, so browser
    // detection order matters - Chrome/Edge/Opera/Firefox are checked first.
    const browser = BROWSER_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null;

    let deviceType: DeviceType;
    if (os === "iPad" || (os === "Android" && !/Mobile/.test(userAgent))) {
        deviceType = "tablet";
    } else if (os === "iPhone" || (os === "Android" && /Mobile/.test(userAgent))) {
        deviceType = "mobile";
    } else if (os !== null) {
        deviceType = "desktop";
    } else {
        deviceType = "unknown";
    }

    return {deviceType, browser, os};
}

/** Icon for a classified device type, for use with `<v-icon>`. */
export function deviceIcon(deviceType: DeviceType): string {
    switch (deviceType) {
        case "mobile":
            return "mdi-cellphone";
        case "tablet":
            return "mdi-tablet";
        case "desktop":
            return "mdi-monitor";
        default:
            return "mdi-help-rhombus-outline";
    }
}
