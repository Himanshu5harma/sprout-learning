import { ChevronRight, Lightbulb } from "lucide-react";
import { CourseCard, PageHeading, Filter } from "../shared/presentation.jsx";
import { courses, learningOrder } from "../generated/catalog.js";

export default function PathsIndexPage({
  openCourse,
  filter,
  setFilter,
  progress,
}) {
  return (
    <>
      <PageHeading
        eyebrow="A ROADMAP, NOT A RACE"
        title="Your path to “I can build that.”"
        description="Learn core JavaScript, build with React Essentials, then make your shop project. Return to deeper topics as you need them."
      />
      <div className="path-roadmap">
        {learningOrder.map((id, index) => {
          const course = courses.find((c) => c.id === id);
          return (
            <button key={id} onClick={() => openCourse(id)}>
              <span className={`roadmap-number ${course.color}`}>
                {index + 1}
              </span>
              <span>
                {course.category}
                <strong>
                  {
                    [
                      "Lay the foundations",
                      "Understand the language",
                      "Build your first interface",
                      "Build with confidence",
                      "Think like an engineer",
                      "Prepare for real users",
                    ][index]
                  }
                </strong>
              </span>
              {index < learningOrder.length - 1 && <ChevronRight size={17} />}
            </button>
          );
        })}
      </div>
      <div className="section-heading">
        <h2>Find your next little step</h2>
        <Filter value={filter} setValue={setFilter} />
      </div>
      <div className="all-courses-grid">
        {courses
          .filter(
            (course) => filter === "All paths" || course.category === filter,
          )
          .map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progress}
              openCourse={openCourse}
            />
          ))}
      </div>
      <div className="soft-note">
        <Lightbulb size={19} />
        <p>
          Brand new to coding? Start with{" "}
          <button
            className="inline-link"
            onClick={() => openCourse("js-foundations")}
          >
            JavaScript Foundations
          </button>
          . You don’t need any special software or prior experience.
        </p>
      </div>
    </>
  );
}
