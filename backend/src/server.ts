import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { publishDueScheduledPosts } from "./services/blog.service.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Shift My Car API listening on ${env.API_URL}`);
});

setInterval(() => {
  publishDueScheduledPosts().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Authentication failed") || message.includes("Can't reach database")) {
      console.warn("Scheduled publisher skipped: database unavailable");
      return;
    }
    console.error("Failed to publish scheduled posts", error);
  });
}, 60_000);
