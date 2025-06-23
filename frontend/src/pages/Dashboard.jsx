import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  getTasks,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  updateTask as apiUpdateTask,
} from "../services/TaskService";

function Dashboard() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filterState, setFilterState] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    state: "Pending",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Fetch all tasks

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      console.log("RES", res);
      setTasks(res.data.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreateTask = async () => {
    if (!newTask.name.trim()) return toast.error("Task name is required");

    try {
      await apiCreateTask(newTask);
      toast.success("Task created");
      setShowModal(false);
      setNewTask({ name: "", description: "", state: "Pending" });
      fetchTasks();
    } catch (err) {
      toast.error("Error creating task");
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await apiDeleteTask(id);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error("Error deleting task");
      console.error(err);
    }
  };

  // Save updated task
  const handleSave = async (task) => {
    const { _id, name, description, state } = task;
    try {
      await apiUpdateTask(_id, { name, description, state });
      toast.success("Task updated");
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    }
  };

  if (!user) {
    return <div className="text-white">Loading user...</div>;
  }

  const filteredTasks =
    filterState === "All"
      ? tasks
      : tasks.filter((task) => task.state === filterState);

  //debug logs

  console.log("🔍 Dashboard render: user:", user, "| tasks:", tasks);

  return (
    <div className="text-white bg-zinc-900 min-h-screen px-4 pt-6">
      <div className="flex justify-between shadow-lg p-3 items-center mb-6">
        <h1 className="text-4xl font-bold">Taskify</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 px-4 py-2 text-xl  cursor-pointer font-semibold rounded hover:bg-blue-700"
          >
            Create Task
          </button>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 text-xl cursor-pointer  font-semibold rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-3xl p-2 font-semibold mb-4">
        Tasks of {user?.fullName}
      </h2>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="bg-zinc-800 border border-zinc-600 p-2 rounded"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-zinc-800 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              {editingTaskId === task._id ? (
                <div className="w-full md:flex md:items-center md:gap-4">
                  <input
                    value={task.name}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, name: e.target.value }
                            : t
                        )
                      )
                    }
                    className="bg-zinc-700 p-2 rounded mb-2 md:mb-0 w-full md:w-1/4"
                  />
                  <input
                    value={task.description}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, description: e.target.value }
                            : t
                        )
                      )
                    }
                    className="bg-zinc-700 p-2 rounded mb-2 md:mb-0 w-full md:w-1/2"
                  />
                  <select
                    value={task.state}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, state: e.target.value }
                            : t
                        )
                      )
                    }
                    className="bg-zinc-700 p-2 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{task.name}</p>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <p className="text-sm text-yellow-400 mt-1">{task.state}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4 md:mt-0">
                {editingTaskId === task._id ? (
                  <button
                    onClick={() => handleSave(task)}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingTaskId(task._id)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10">
          <div className="bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <input
              type="text"
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full mb-3 p-2 rounded bg-zinc-700 border border-zinc-600"
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full mb-3 p-2 rounded bg-zinc-700 border border-zinc-600"
            />
            <select
              value={newTask.state}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, state: e.target.value }))
              }
              className="w-full mb-4 p-2 rounded bg-zinc-700 border border-zinc-600"
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Finished">Finished</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
