
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [newPriority, setNewPriority] = useState('Medium')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load tasks from the database
  async function loadTasks() {
    try {
      setError('')
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load tasks.')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(
        'Backend se connection nahi ho raha. Check karo ki server port 5000 par chal raha hai.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.assignee || '')
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' || task.status === filter

    return matchesSearch && matchesFilter
  })

  // Create and save a task in SQLite
  async function addTask(event) {
    event.preventDefault()

    if (!newTitle.trim() || !newAssignee.trim()) return

    try {
      setError('')

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          project: 'Operations',
          priority: newPriority,
          assignee: newAssignee.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not create task.')
      }

      setTasks((previous) => [data, ...previous])
      setNewTitle('')
      setNewAssignee('')
      setNewPriority('Medium')
      setShowForm(false)
    } catch (err) {
      setError(err.message || 'Task save nahi hua.')
    }
  }

  // Update status in SQLite
  async function updateStatus(id, status) {
    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not update task.')
      }

      setTasks((previous) =>
        previous.map((task) =>
          task.id === id ? data : task
        )
      )
    } catch (err) {
      setError(err.message || 'Status update nahi hua.')
      loadTasks()
    }
  }

  const openCount = tasks.filter(
    (task) => task.status === 'Open'
  ).length

  const progressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const resolvedCount = tasks.filter(
    (task) => task.status === 'Resolved'
  ).length

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">O</div>
          <div>
            <h2>OpsFlow</h2>
            <span>WORK MANAGEMENT</span>
          </div>
        </div>

        <div className="menu-label">WORKSPACE</div>

        <button
          className="nav-item active"
          onClick={() => setFilter('All')}
        >
          ▦ <span>Dashboard</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setFilter('All')}
        >
          ☷ <span>All Tasks</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setFilter('Open')}
        >
          ◷ <span>Open Tasks</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setFilter('In Progress')}
        >
          ↻ <span>In Progress</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setFilter('Resolved')}
        >
          ✓ <span>Resolved</span>
        </button>

        <div className="sidebar-bottom">
          <div className="profile-avatar">SP</div>
          <div className="profile-text">
            <strong>Sonam Patel</strong>
            <span>Team Member</span>
          </div>
          <span className="online-dot"></span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Dashboard
          </div>
          <div className="topbar-right">
            <span className="today-label">
              ● System online
            </span>
            <div className="top-avatar">SP</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                WORKSPACE · OVERVIEW
              </p>
              <h1>
                Good afternoon, Sonam <span>✦</span>
              </h1>
              <p className="subtitle">
                Here’s what’s happening with your team today.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              + Create task
            </button>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                background: '#fff0f0',
                color: '#b42318',
              }}
            >
              {error}
              <button
                onClick={loadTasks}
                style={{ marginLeft: '12px' }}
              >
                Retry
              </button>
            </div>
          )}

          {showForm && (
            <form className="task-form" onSubmit={addTask}>
              <h3>Create a new task</h3>

              <div className="form-grid">
                <label>
                  Task title
                  <input
                    value={newTitle}
                    onChange={(event) =>
                      setNewTitle(event.target.value)
                    }
                    placeholder="What needs to be done?"
                    required
                  />
                </label>

                <label>
                  Assign to
                  <input
                    value={newAssignee}
                    onChange={(event) =>
                      setNewAssignee(event.target.value)
                    }
                    placeholder="Team member name"
                    required
                  />
                </label>

                <label>
                  Priority
                  <select
                    value={newPriority}
                    onChange={(event) =>
                      setNewPriority(event.target.value)
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  Save task
                </button>
              </div>
            </form>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total tasks</span>
                <span className="stat-icon purple">☷</span>
              </div>
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-foot">
                Tasks in your workspace
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Open tasks</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <div className="stat-number">{openCount}</div>
              <div className="stat-foot">
                Waiting to be started
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>In progress</span>
                <span className="stat-icon blue">↻</span>
              </div>
              <div className="stat-number">
                {progressCount}
              </div>
              <div className="stat-foot">
                Currently being worked on
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Resolved</span>
                <span className="stat-icon green">✓</span>
              </div>
              <div className="stat-number">
                {resolvedCount}
              </div>
              <div className="stat-foot">
                Successfully completed
              </div>
            </div>
          </div>

          <section className="tasks-panel">
            <div className="panel-heading">
              <div>
                <h2>Task overview</h2>
                <p>Manage and track your team's work.</p>
              </div>

              <button
                className="text-button"
                onClick={() => {
                  setSearch('')
                  setFilter('All')
                }}
              >
                Reset filters ↗
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search tasks or assignees..."
                />
              </div>

              <select
                className="filter-select"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
              >
                <option value="All">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>TASK</th>
                    <th>ASSIGNEE</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>UPDATE STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredTasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <div className="task-title">
                              {task.title}
                            </div>
                            <div className="task-project">
                              {task.project}
                            </div>
                          </td>

                          <td>
                            <div className="assignee">
                              <span className="assignee-avatar">
                                {(task.assignee || 'NA')
                                  .split(' ')
                                  .map((part) => part[0])
                                  .join('')
                                  .slice(0, 2)}
                              </span>
                              {task.assignee}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`priority ${(task.priority || 'Medium').toLowerCase()}`}
                            >
                              <i></i>
                              {task.priority}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status ${
                                task.status === 'In Progress'
                                  ? 'in-progress'
                                  : task.status.toLowerCase()
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>

                          <td>
                            <select
                              className="row-status"
                              value={task.status}
                              onChange={(event) =>
                                updateStatus(
                                  task.id,
                                  event.target.value
                                )
                              }
                              aria-label={`Update status for ${task.title}`}
                            >
                              <option>Open</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}

                      {filteredTasks.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="empty-state"
                          >
                            No tasks found. Try changing your
                            search or filters.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Showing <strong>{filteredTasks.length}</strong> of{' '}
              <strong>{tasks.length}</strong> tasks
              <span>Changes are saved to the database</span>
            </div>
          </section>

          <footer className="page-footer">
            <span>
              OpsFlow <b>·</b> Operations Under Pressure
            </span>
            <span>Built for better teamwork ✦</span>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
