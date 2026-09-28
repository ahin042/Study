import { QUOTES, type Quote } from "./data/quotes-list";
import { openApiSpec } from "./openapi";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};


const EMPTY_FALLBACK: Quote = {
  name: "대소고 11기",
  comment: "등록된 명언이 없습니다.",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

function errorJson(status: number, message: string): Response {
  return json({ status, message }, status);
}

function pickRandomQuote(): Quote {
  if (QUOTES.length === 0) return EMPTY_FALLBACK;
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index]!;
}

const SWAGGER_UI_PAGE = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>대소고 11기 명언 API 문서</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: "/openapi.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          layout: "BaseLayout",
        });
      };
    </script>
  </body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return errorJson(405, "GET 요청만 지원합니다.");
    }

    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    switch (path) {
      case "/":
        return json({
          name: "대소고 11기 명언 REST API",
          endpoints: ["/quote", "/quote/all", "/docs", "/openapi.json"],
        });

      case "/quote":
        return json(pickRandomQuote());

      case "/quote/all":
        return json(QUOTES);

      case "/openapi.json":
        return json(openApiSpec);

      case "/docs":
        return html(SWAGGER_UI_PAGE);

      default:
        return errorJson(404, "요청한 경로를 찾을 수 없습니다.");
    }
  },
} satisfies ExportedHandler;
