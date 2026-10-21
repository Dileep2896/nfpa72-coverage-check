import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlanPage } from "./pages/PlanPage";
const StoryPage = lazy(() =>
  import("./pages/StoryPage").then((m) => ({ default: m.StoryPage })),
);
export function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense fallback={<div className="loading-state">Loading story…</div>}>
        <Routes>
          <Route path="/" element={<PlanPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route
            path="*"
            element={
              <main className="loading-state">
                <h1>Drawing not found</h1>
                <a href="/">Return to FA-201</a>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
