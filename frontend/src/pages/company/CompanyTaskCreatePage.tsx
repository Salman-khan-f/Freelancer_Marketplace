import { useState } from 'react'
import type { FormEvent } from 'react'

export default function CompanyTaskCreatePage() {
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // Hook up to taskApi.createTask when backend is wired
    console.log({ title, budget, description })
  }

  return (
    <section>
      <h1 className="dashboard-section-title">Create task</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="budget">Budget</label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ resize: 'vertical' }}
            required
          />
        </div>
        <button type="submit" className="primary-button">
          Save task
        </button>
      </form>
    </section>
  )
}

