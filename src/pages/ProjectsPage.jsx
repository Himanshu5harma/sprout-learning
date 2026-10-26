import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Coffee,
  Library,
  ListTodo,
  Wallet,
} from "lucide-react";
import { PageHeading } from "../shared/presentation.jsx";
import { projects } from "../generated/catalog.js";
import { taskIsCurrent } from "../learning/progress.js";

export default function ProjectsPage({ progress, setModal }) {
  return (
    <>
      <PageHeading
        eyebrow="TURN “I UNDERSTAND” INTO “I MADE THIS”"
        title="Small projects. Real proud moments."
        description="Put the pieces together. These guided builds grow with you, from a first component to a thoughtful little application."
      />
      <div className="projects-grid">
        {projects.map((project) => {
          const done = project.requirements.filter(
            (_, i) => progress.projects[project.id]?.[i],
          ).length;
          const behaviourChecked = taskIsCurrent(
            progress.practice[`project-${project.id}`],
            project.task,
            progress.drafts[`project-${project.id}`] ?? project.starter,
          );
          const ProjectIcon =
            project.icon === "wave"
              ? Coffee
              : project.icon === "tasks"
                ? ListTodo
                : project.icon === "budget"
                  ? Wallet
                  : Library;
          return (
            <button
              key={project.id}
              className={`project-card ${project.color}`}
              onClick={() => setModal(`project-${project.id}`)}
            >
              <div className={`project-art ${project.color}`}>
                <ProjectIcon size={58} strokeWidth={1} />
                <span className="project-art-spark">✦</span>
                <span className="project-art-circle" />
              </div>
              <div className="project-card-info">
                <div className="project-tags">
                  <span className={`tag ${project.color}`}>
                    {project.category}
                  </span>
                  <span>{project.level}</span>
                  {behaviourChecked && (
                    <span className="tag green">
                      <CheckCircle2 size={12} />
                      Behaviour checked
                    </span>
                  )}
                  {done === project.requirements.length && (
                    <span className="tag green">
                      <Check size={12} />
                      Checklist done
                    </span>
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <div className="project-card-footer">
                  <span>
                    {done
                      ? `${done} / ${project.requirements.length} steps marked`
                      : `${project.requirements.length} small steps`}
                  </span>
                  <span>
                    {done ? "Keep building" : "Explore project"}
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
