import { useState, useEffect, useCallback } from 'react'
import Navbar       from '../components/Navbar'
import TaskCard     from '../components/TaskCard'
import TaskForm     from '../components/TaskForm'
import {
  getTasks, createTask, updateTask, deleteTask, toggleStatus
} from '../services/taskService'

// ── Icons ─────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ── Delete confirmation modal ─────────────────────────────
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3 className="modal-title">Delete task?</h3>
      <p className="modal-text">
        This action cannot be undone. The task will be permanently removed.
      </p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger"    onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
)

// ── Dashboard ─────────────────────────────────────────────
const Dashboard = () => {
  const [tasks,        setTasks]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [formLoading,  setFormLoading]  = useState(false)
  const [error,        setError]        = useState('')
  const [showForm,     setShowForm]     = useState(false)   // create form
  const [editingTask,  setEditingTask]  = useState(null)    // task being edited
  const [deleteId,     setDeleteId]     = useState(null)    // task pending deletion
  const [filter,       setFilter]       = useState('all')   // all | active | completed

  // ── Fetch all tasks on mount ─────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTasks()
      setTasks(data)
    } catch {
      setError('Could not load tasks. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // ── Create ───────────────────────────────────────────────
  const handleCreate = async (form) => {
    setFormLoading(true)
    try {
      const created = await createTask(form)
      setTasks(prev => [created, ...prev])
      setShowForm(false)
    } catch {
      setError('Failed to create task.')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Update ───────────────────────────────────────────────
  const handleUpdate = async (form) => {
    setFormLoading(true)
    try {
      const updated = await updateTask(editingTask.id, form)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setEditingTask(null)
    } catch {
      setError('Failed to update task.')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Delete (two-step: open modal → confirm) ──────────────
  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(deleteId)
      setTasks(prev => prev.filter(t => t.id !== deleteId))
    } catch {
      setError('Failed to delete task.')
    } finally {
      setDeleteId(null)
    }
  }

  // ── Toggle completion status ─────────────────────────────
  const handleToggleStatus = async (id, completed) => {
    try {
      const updated = await toggleStatus(id, completed)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    } catch {
      setError('Failed to update task status.')
    }
  }

  // ── Open edit form (close create form if open) ───────────
  const handleEdit = (task) => {
    setShowForm(false)
    setEditingTask(task)
  }

  // ── Filtered view ────────────────────────────────────────
  const filtered = tasks.filter(t => {
    if (filter === 'active')    return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const counts = {
    all:       tasks.length,
    active:    tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t =>  t.completed).length,
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* ── Page header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">My tasks</h1>
            <p className="page-subtitle">
              {counts.active} task{counts.active !== 1 ? 's' : ''} remaining
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(v => !v); setEditingTask(null) }}
          >
            <PlusIcon /> New task
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            {error}
            <button
              onClick={() => setError('')}
              style={{ marginLeft: 'auto', background: 'none', border: 'none',
                       cursor: 'pointer', fontSize: 18, color: '#b91c1c', lineHeight: 1 }}
            >×</button>
          </div>
        )}

        {/* ── Create form (inline) ── */}
        {showForm && (
          <div className="form-panel">
            <div className="form-panel-title">
              <PlusIcon /> Add new task
            </div>
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        )}

        {/* ── Edit form (inline, replaces create form) ── */}
        {editingTask && (
          <div className="form-panel">
            <div className="form-panel-title">Edit task</div>
            <TaskForm
              initialData={editingTask}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              loading={formLoading}
            />
          </div>
        )}

        {/* ── Filter tabs ── */}
        <div className="stats-bar">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`stat-chip${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* ── Task list ── */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✓</div>
            <div className="empty-state-title">
              {filter === 'completed' ? 'No completed tasks yet' : 'No tasks here'}
            </div>
            <div className="empty-state-text">
              {filter === 'all'
                ? 'Click "New task" to get started.'
                : filter === 'active'
                ? 'All caught up! No pending tasks.'
                : 'Complete a task and it will appear here.'}
            </div>
          </div>
        ) : (
          <div className="task-list">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Delete confirmation modal ── */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
