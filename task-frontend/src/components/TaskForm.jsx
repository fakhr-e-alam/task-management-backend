import { useState, useEffect } from 'react'

const EMPTY = { title: '', description: '', priority: 'medium', due_date: '', completed: false }

// Used for both CREATE (initialData = null) and EDIT (initialData = task object).
const TaskForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(EMPTY)

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title        ?? '',
        description: initialData.description  ?? '',
        priority:    initialData.priority     ?? 'medium',
        due_date:    initialData.due_date
                       ? initialData.due_date.split('T')[0]  // strip time portion
                       : '',
        completed:   initialData.completed    ?? false,
      })
    } else {
      setForm(EMPTY)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    // Pass null due_date if empty so backend gets null instead of ''
    onSubmit({ ...form, due_date: form.due_date || null })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details (optional)"
          rows={2}
        />
      </div>

      {/* Priority + Due date side by side */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-input" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Due date</label>
          <input
            type="date"
            className="form-input"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initialData ? 'Update task' : 'Add task'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
