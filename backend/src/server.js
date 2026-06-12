import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { ensureDefaultAdminUser } from "./modules/auth/auth.controller.js";
import { ensureDefaultCatalogProducts } from "./modules/catalog/catalog.controller.js";
import { ensureDefaultCatalogCategories } from "./modules/catalog/catalogCategory.controller.js";

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);
    await ensureDefaultAdminUser();
    await ensureDefaultCatalogProducts();
    await ensureDefaultCatalogCategories();

    const app = createApp({ clientUrl: env.clientUrl });

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log("CLIENT_URL =", env.clientUrl);
console.log("NODE_ENV =", env.nodeEnv);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
