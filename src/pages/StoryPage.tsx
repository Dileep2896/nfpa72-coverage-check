import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "../components/Brand";
import { HeroSection } from "../components/story/HeroSection";
import { PainSection } from "../components/story/PainSection";
import { DiagramSection } from "../components/story/DiagramSection";
import { DecisionSection } from "../components/story/DecisionSection";
import { HowSection } from "../components/story/HowSection";
import { ImpactSection } from "../components/story/ImpactSection";
export function StoryPage() {
  return (
    <div className="story-page">
      <header className="story-header">
        <Brand />
        <span>A closer look at Coverage Check</span>
        <Link to="/" className="text-button">
          Open the workspace <ArrowUpRight size={16} />
        </Link>
      </header>
      <main>
        <HeroSection />
        <PainSection />
        <DiagramSection />
        <DecisionSection />
        <HowSection />
        <ImpactSection />
      </main>
      <footer className="story-footer">
        <Brand />
        <span>An independent project · Built with Codex, verified by Claude Code</span>
        <Link to="/">Back to the drawing ↗</Link>
      </footer>
    </div>
  );
}
