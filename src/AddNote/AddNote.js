import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ErrorBoundary from '../ErrorBoundary'
import PropTypes from 'prop-types'
import './AddNote.css'

export default class AddNote extends Component {
  state = {
    'note-name': "",
    'note-folder-id': "",
    'note-content': "",
    error: null
  };

  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  static contextType = ApiContext;

  onChange = event => {
    this.setState({ 
        [event.target.name]: event.target.value 
    });
  };

  handleSubmit = event => {
    event.preventDefault()

    if (!this.state["note-name"]) {
      this.setState({
        error: "Name is Required"
      });
    } else if (!this.state["note-content"]) {
      this.setState({
        error: "Content is Required"
      });
    } else if (!this.state["note-folder-id"]) {
      this.setState({
        error: "Choosing a Folder is Required"
      });
    } else {
      const newNote = {
      name: event.target['note-name'].value,
      content: event.target['note-content'].value,
      folderId: event.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(event => Promise.reject(event))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folders/${note.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      });
    }    
  }

  render() {
    const { folders=[] } = this.context
    return (
      <ErrorBoundary>
        <section className='AddNote'>
          <h2>Create a note</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className='field'>
              <label htmlFor='note-name-input'>
                Name
              </label>
              <input type='text' id='note-name-input' name='note-name' onChange={this.onChange} />
            </div>
          
            <div className='field'>
              <label htmlFor='note-content-input'>
                Content
              </label>
              <textarea id='note-content-input' name='note-content'  onChange={this.onChange} />
            </div>

            <div className='field'>
              <label htmlFor='note-folder-select'>
                Folder
              </label>
              <select id='note-folder-select' name='note-folder-id' onChange={this.onChange} >
                <option value={null}>...</option>
                {folders.map(folder =>
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                )}
              </select>
            </div>

            {this.state.error && (
              <p style={{ color: "red" ,fontSize:20}}>{this.state.error}</p>
            )}

            <div className='buttons'>
              <button type='submit'>
                Add note
              </button>
            </div>
          </NotefulForm>
        </section>
      </ErrorBoundary>
    )
  }
}

AddNote.propTypes = {
    history: PropTypes.object
};