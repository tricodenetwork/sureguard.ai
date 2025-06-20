export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sureguard.ai/v1",
    timeout: 30000,
    retries: 3,
  },

  // AI/LLM Configuration
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4-turbo",
      maxTokens: 2000,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-sonnet-20240229",
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      model: "gemini-pro",
    },
  },

  // Google Services
  google: {
    maps: {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      libraries: ["places", "geometry"],
    },
    places: {
      apiKey: process.env.GOOGLE_PLACES_API_KEY,
    },
    geocoding: {
      apiKey: process.env.GOOGLE_GEOCODING_API_KEY,
    },
  },

  // External APIs
  external: {
    ipGeolocation: {
      apiKey: process.env.IPGEOLOCATION_API_KEY,
      baseUrl: "https://api.ipgeolocation.io",
    },
    maxmind: {
      licenseKey: process.env.MAXMIND_LICENSE_KEY,
      userId: process.env.MAXMIND_USER_ID,
    },
    virusTotal: {
      apiKey: process.env.VIRUSTOTAL_API_KEY,
      baseUrl: "https://www.virustotal.com/vtapi/v2",
    },
    shodan: {
      apiKey: process.env.SHODAN_API_KEY,
      baseUrl: "https://api.shodan.io",
    },
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: 20,
    connectionTimeout: 60000,
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    ttl: 3600, // 1 hour default TTL
  },

  // Payment Configuration
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // Email Configuration
  email: {
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      from: "noreply@sureguard.ai",
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // WebSocket Configuration
  websocket: {
    port: Number.parseInt(process.env.WEBSOCKET_PORT || "8080"),
    host: process.env.WEBSOCKET_HOST || "localhost",
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    apiSecretKey: process.env.API_SECRET_KEY,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Rate Limiting
  rateLimit: {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
  },

  // Feature Flags
  features: {
    aiRecommendations: process.env.ENABLE_AI_RECOMMENDATIONS === "true",
    realTimeTracking: process.env.ENABLE_REAL_TIME_TRACKING === "true",
    teamCollaboration: process.env.ENABLE_TEAM_COLLABORATION === "true",
    advancedAnalytics: process.env.ENABLE_ADVANCED_ANALYTICS === "true",
  },

  // File Storage
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-east-1",
      bucket: process.env.AWS_S3_BUCKET,
    },
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
    mixpanel: process.env.MIXPANEL_TOKEN,
  },

  // Webhooks
  webhooks: {
    slack: process.env.SLACK_WEBHOOK_URL,
    discord: process.env.DISCORD_WEBHOOK_URL,
    teams: process.env.TEAMS_WEBHOOK_URL,
  },
}

export default config
