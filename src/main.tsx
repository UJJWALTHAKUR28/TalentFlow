import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { seedJobs } from "./db/seedData";
import { seedCandidates } from "./db/seedCandidates";
import "./index.css"; // Tailwind
import { initializeAssessments } from "./db/assesmentseed";

async function prepare() {
  // Always start MSW (not just in dev)
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass", // don’t block requests you haven’t mocked
    serviceWorker: {
      url: "/mockServiceWorker.js", // ensure it's served from /public
    },
  });

  // Seed data into IndexedDB
  await seedJobs();        
  await seedCandidates();
  await initializeAssessments();
}

// Wait for MSW + seeding before rendering app
prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
