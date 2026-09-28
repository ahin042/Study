export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "대소고 11기 명언 REST API",
    description:
      "대소고 11기 GET 만 지원",
    version: "1.0.0",
  },
  servers: [{ url: "/", description: "현재 호스트" }],
  tags: [{ name: "quote", description: "명언 조회" }],
  paths: {
    "/quote": {
      get: {
        tags: ["quote"],
        summary: "랜덤 명언 1개",
        description:
          "명언 하나를 무작위로 반환합니다. 등록된 명언이 없으면 comment 가 안내 문구로 채워집니다.",
        responses: {
          "200": {
            description: "성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Quote" },
                example: { name: "권아인", comment: "뭐래" },
              },
            },
          },
        },
      },
    },
    "/quote/all": {
      get: {
        tags: ["quote"],
        summary: "전체 명언 목록",
        description: "등록된 모든 명언을 배열로 반환합니다. 없으면 빈 배열입니다.",
        responses: {
          "200": {
            description: "성공",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Quote" } },
                example: [
                  { name: "권아인", comment: "뭐래" },
                  { name: "권아인", comment: "물어버린다?" },
                ],
              },
            },
          },
        },
      },
    },
    "/openapi.json": {
      get: {
        summary: "OpenAPI 스펙",
        responses: { "200": { description: "이 문서 자체" } },
      },
    },
  },
  components: {
    schemas: {
      Quote: {
        type: "object",
        required: ["name", "comment"],
        properties: {
          name: { type: "string", description: "발언자 이름", example: "권아인" },
          comment: { type: "string", example: "뭐래" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["status", "message"],
        properties: {
          status: { type: "integer", example: 404 },
          message: { type: "string", example: "요청한 경로를 찾을 수 없습니다." },
        },
      },
    },
  },
} as const;
