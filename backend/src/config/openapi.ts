export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "HR Management API",
    version: "1.0.0",
    description: "Personnel leave request API with authentication and role-based authorization.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Docker backend",
    },
    {
      url: "http://localhost:5000",
      description: "Local backend without Docker",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Leave Requests" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Form alanlarını kontrol ediniz." },
          errors: {
            type: "object",
            additionalProperties: { type: "string" },
            example: {
              email: "Geçerli bir e-posta adresi giriniz.",
              leaveType: "İzin türü seçiniz.",
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string", example: "Ali Acar" },
          email: { type: "string", example: "user@pratech.com" },
          phone: { type: "string", nullable: true, example: "+905423307995" },
          roleId: { type: "number", example: 1 },
          roleName: { type: "string", example: "Manager" },
          isActive: { type: "boolean", example: true },
          approvalStatus: {
            type: "string",
            enum: ["PENDING", "APPROVED", "REJECTED"],
            example: "APPROVED",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LeaveRequest: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          employee: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              fullName: { type: "string", example: "Çalışan Kullanıcı" },
              email: { type: "string", example: "employee@pratech.com" },
              phone: { type: "string", nullable: true },
            },
          },
          leaveType: {
            type: "string",
            enum: ["ANNUAL", "SICK", "PERSONAL"],
            example: "ANNUAL",
          },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          description: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["PENDING", "APPROVED", "REJECTED"],
            example: "PENDING",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "number", example: 1 },
          pageSize: { type: "number", example: 15 },
          totalItems: { type: "number", example: 60 },
          totalPages: { type: "number", example: 4 },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check API status",
        responses: {
          "200": {
            description: "API is running",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a pending user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: { type: "string", example: "Yeni Kullanıcı" },
                  email: { type: "string", example: "new@pratech.com" },
                  phone: { type: "string", example: "+905551112233" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered" },
          "400": { description: "Validation error" },
          "409": { description: "Duplicate email" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@pratech.com" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Missing or invalid token" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "roleId", in: "query", schema: { type: "number", enum: [1, 2, 3] } },
          { name: "page", in: "query", schema: { type: "number", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "number", default: 15 } },
        ],
        responses: {
          "200": { description: "Users listed" },
          "403": { description: "Manager only" },
        },
      },
    },
    "/api/users/pending": {
      get: {
        tags: ["Users"],
        summary: "List pending users",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "number", default: 15 } },
        ],
        responses: {
          "200": { description: "Pending users listed" },
          "403": { description: "Manager only" },
        },
      },
    },
    "/api/users/{id}/approve": {
      put: {
        tags: ["Users"],
        summary: "Approve pending user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User approved" },
          "400": { description: "Invalid user state" },
          "404": { description: "User not found" },
        },
      },
    },
    "/api/users/{id}/reject": {
      put: {
        tags: ["Users"],
        summary: "Reject pending user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User rejected" },
          "400": { description: "Invalid user state" },
          "404": { description: "User not found" },
        },
      },
    },
    "/api/users/{id}/role": {
      put: {
        tags: ["Users"],
        summary: "Update user role",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roleId"],
                properties: {
                  roleId: {
                    type: "number",
                    enum: [1, 2, 3],
                    description: "1: Manager, 2: Employee, 3: PendingUser",
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "User role updated" },
          "400": { description: "Invalid role or self role change" },
          "403": { description: "Manager only" },
          "404": { description: "User not found" },
        },
      },
    },
    "/api/leave-requests": {
      post: {
        tags: ["Leave Requests"],
        summary: "Create leave request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["leaveType", "startDate", "endDate"],
                properties: {
                  leaveType: {
                    type: "string",
                    enum: ["ANNUAL", "SICK", "PERSONAL"],
                    example: "ANNUAL",
                  },
                  startDate: { type: "string", example: "2026-05-01" },
                  endDate: { type: "string", example: "2026-05-05" },
                  description: { type: "string", example: "Aile ziyareti için izin talebi" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Leave request created" },
          "400": { description: "Validation error" },
          "403": { description: "Employee only" },
        },
      },
      get: {
        tags: ["Leave Requests"],
        summary: "List all leave requests",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] },
          },
          { name: "page", in: "query", schema: { type: "number", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "number", default: 15 } },
        ],
        responses: {
          "200": { description: "Leave requests listed" },
          "403": { description: "Manager only" },
        },
      },
    },
    "/api/leave-requests/my": {
      get: {
        tags: ["Leave Requests"],
        summary: "List current employee leave requests",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] },
          },
          { name: "page", in: "query", schema: { type: "number", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "number", default: 15 } },
        ],
        responses: {
          "200": { description: "Own leave requests listed" },
          "403": { description: "Employee only" },
        },
      },
    },
    "/api/leave-requests/{id}/status": {
      put: {
        tags: ["Leave Requests"],
        summary: "Approve or reject leave request",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["APPROVED", "REJECTED"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Leave request status updated" },
          "400": { description: "Invalid status transition" },
          "404": { description: "Leave request not found" },
        },
      },
    },
  },
};
