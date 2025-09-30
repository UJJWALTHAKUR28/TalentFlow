import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { seedJobs } from "./db/seedData";
import { seedCandidates } from "./db/seedCandidates";
import "./index.css"; 
import { initializeAssessments } from "./db/assesmentseed";

async function prepare() {
 
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass", 
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });


  await seedJobs();        
  await seedCandidates();
  await initializeAssessments();
}


prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
