// Inline SVG icons — no library dependency
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

// Returns CSS class name for the priority badge
const priorityClass = (p) => {
  if (p === 'high')   return 'badge badge-high'
  if (p === 'medium') return 'badge badge-medium'
  return 'badge badge-low'
}

// Checks if due_date is in the past
const isOverdue = (due_date, completed) => {
  if (!due_date || completed) return false
  return new Date(due_date) < new Date()
}

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const overdue = isOverdue(task.due_date, task.completed)

  const formatDate = (d) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={`task-card${task.completed ? ' completed' : ''}`}>
      {/* Checkbox */}
      <div className="task-checkbox-wrap">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleStatus(task.id, !task.completed)}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />
      </div>

      {/* Content */}
      <div className="task-body">
        <div className="task-header">
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task">
              <EditIcon />
            </button>
            <button className="btn-icon danger" onClick={() => onDelete(task.id)} title="Delete task">
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Optional description */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Meta: badges + due date */}
        <div className="task-meta">
          <span className={priorityClass(task.priority)}>{task.priority}</span>
          <span className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
            {task.completed ? 'Done' : 'Pending'}
          </span>
          {task.due_date && (
            <span className={`task-due${overdue ? ' overdue' : ''}`}>
              {overdue ? '⚠ Overdue · ' : 'Due · '}
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
