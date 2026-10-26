import {
  Braces,
  Code2,
  ExternalLink,
  GraduationCap,
  Heart,
} from "lucide-react";
import { PageHeading } from "../shared/presentation.jsx";

export default function ResourcesPage() {
  return (
    <>
      <PageHeading
        eyebrow="A FEW GOOD PLACES TO KEEP GROWING"
        title="A little help along the way."
        description="Thoughtfully chosen, official references for when you want to explore a little further."
      />
      <div className="resources-grid">
        {[
          {
            name: "The JavaScript field guide",
            label: "MDN WEB DOCS",
            description:
              "A dependable reference for JavaScript syntax, built-in objects, and language concepts.",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            icon: Braces,
            color: "yellow",
          },
          {
            name: "Learn from the React team",
            label: "REACT DOCUMENTATION",
            description:
              "Interactive examples and deeper explanations, straight from the people building React.",
            url: "https://react.dev/learn",
            icon: Code2,
            color: "blue",
          },
          {
            name: "Build an accessible web",
            label: "W3C WEB ACCESSIBILITY INITIATIVE",
            description:
              "Understand how to create interfaces that work for people with a wide range of abilities.",
            url: "https://www.w3.org/WAI/tutorials/",
            icon: Heart,
            color: "purple",
          },
          {
            name: "The browser is your workshop",
            label: "MDN LEARNING AREA",
            description:
              "Explore HTML, CSS, developer tools, and the foundations that support your JavaScript skills.",
            url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
            icon: GraduationCap,
            color: "peach",
          },
        ].map((item) => (
          <a
            className="resource-card card"
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className={`course-icon ${item.color}`}>
              <item.icon size={27} strokeWidth={1.5} />
            </span>
            <div className="eyebrow">{item.label}</div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="text-button">
              Explore resource
              <ExternalLink size={15} />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
