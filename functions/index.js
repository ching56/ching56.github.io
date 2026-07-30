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
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1;

      return {
        language: language.toLowerCase(),
        position,
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(({ quality }) => quality > 0)
    .sort(
      (left, right) =>
        right.quality - left.quality || left.position - right.position,
    );

  for (const { language } of preferences) {
    if (language === "zh" || language.startsWith("zh-")) {
      return true;
    }

    if (language === "en" || language.startsWith("en-") || language === "*") {
      return false;
    }
  }

  return false;
}
