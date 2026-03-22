import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API ='https://notes-app-backend-rxxxx.vercel.app';
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    setLoading(false);
  };

  // Create or Update note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing note
        await axios.put(`${API}/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        // Create new note
        await axios.post(API, { title, content });
      }

      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note');
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (confirm('Delete this note?')) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note');
      }
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>📝 Simple Notes App</h1>
        <p>Create, edit, and manage your notes</p>
      </header>

      {/* Create/Edit Form */}
      <div className="form-container">
        <h2>{editingId ? '✏️ Edit Note' : '✨ Create New Note'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Enter note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="textarea"
          />
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Update Note' : '➕ Create Note'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="notes-container">
        <h2>📚 Your Notes ({notes.length})</h2>
        
        {loading ? (
          <div className="loading">⏳ Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty">
            <p>📭 No notes yet</p>
            <p>Create your first note above!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                </div>
                <p className="note-content">{note.content}</p>
                <small className="note-date">
                  📅 {new Date(note.createdAt).toLocaleDateString()}
                </small>
                <div className="note-actions">
                  <button
                    onClick={() => handleEdit(note)}
                    className="btn-icon edit"
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="btn-icon delete"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>🚀 Built with React + Express | Simple Notes App v1.0</p>
      </footer>
    </div>
  );
}

export default App;