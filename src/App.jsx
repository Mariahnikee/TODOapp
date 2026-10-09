
import { useEffect, useState } from "react";
import "./App.css";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("hng-todo-tasks")) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("hng-todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = input.trim();

    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ]);

    setInput("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remaining = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <main className="app">
      <section className="todo-card">
        <p className="eyebrow">HNG INTERNSHIP 15</p>
        <h1>My Tasks<span>.</span></h1>
        <p className="subtitle">
          Small steps. Real progress.
        </p>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">
            New task
          </label>
          <input
            id="new-task"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What needs to get done?"
          />
          <button type="submit">Add task</button>
        </form>

        <nav className="filters" aria-label="Filter tasks">
          {["all", "active", "completed"].map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "selected" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>

        {visibleTasks.length === 0 ? (
          <div className="empty">
            <span aria-hidden="true">✦</span>
            <p>
              {tasks.length === 0
                ? "A fresh start."
                : "Nothing in this filter."}
            </p>
            <small>Add a task above to get going.</small>
          </div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className="task" key={task.id}>
                <label className={task.completed ? "done" : ""}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.title}</span>
                </label>

                <button
                  type="button"
                  className="delete"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>
          {remaining} task{remaining === 1 ? "" : "s"} remaining
        </footer>
      </section>
    </main>
  );
}