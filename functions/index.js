export function onRequest({ request }) {
  const destination = prefersTraditionalChinese(
    request.headers.get("Accept-Language"),
  )
    ? "/zh-TW/"
    : "/en/";

  return new Response(null, {
    status: 302,
    headers: {
      "Cache-Control": "private, no-store",
      Location: new URL(destination, request.url).href,
      Vary: "Accept-Language",
    },
  });
}

function prefersTraditionalChinese(acceptLanguage) {
  const preferences = (acceptLanguage ?? "")
    .split(",")
    .map((value, position) => {
      const [language, ...parameters] = value.trim().split(";");
      const qualityMatch = parameters
        .map((parameter) => parameter.trim().match(/^q\s*=\s*(.*)$/i))
        .find(Boolean);
      const parsedQuality = qualityMatch ? Number(qualityMatch[1]) : 1;
      const quality =
        Number.isFinite(parsedQuality) &&
        parsedQuality >= 0 &&
        parsedQuality <= 1
          ? parsedQuality
          : 0;

      return {
        language: language.toLowerCase(),
        position,
        quality,
      };
    });
  const chinese = getLanguagePreference(preferences, "zh");
  const english = getLanguagePreference(preferences, "en");

  if (chinese.quality <= 0) return false;
  if (english.quality <= 0) return true;

  return (
    chinese.quality > english.quality ||
    (chinese.quality === english.quality &&
      chinese.position < english.position)
  );
}

function getLanguagePreference(preferences, languagePrefix) {
  const explicit = preferences.filter(
    ({ language }) =>
      language === languagePrefix || language.startsWith(`${languagePrefix}-`),
  );
  const candidates = explicit.length
    ? explicit
    : preferences.filter(({ language }) => language === "*");

  return candidates.reduce(
    (best, candidate) =>
      candidate.quality > best.quality ||
      (candidate.quality === best.quality &&
        candidate.position < best.position)
        ? candidate
        : best,
    { quality: -1, position: Number.POSITIVE_INFINITY },
  );
}
