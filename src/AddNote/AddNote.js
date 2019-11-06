import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types'
import config from '../config'
import ErrorBoundary from '../ErrorBoundary'
import './AddNote.css'

export default class AddNote extends Component {
    static defaultProps = {
        history: {
            push: () => {}
        }
    };
    static contextType = ApiContext;

    handleSubmit = event => {
        event.preventDefault();
        const newNote = {
            name: event.target['note-name'].value,
            content: event.target['note-content'].value,
            folderId: event.target['note-folder-id'].value,
            modified: new Date()
        };
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote)
        })
            .then(res => {
                if (!res.ok) return res.json().then(event => Promise.reject(event));
                return res.json();
            })
            .then(note => {
                this.context.addNote(note);
                this.props.history.push(`/folder/${note.folderId}`);
            })
            .catch(error => {
                console.error({ error });
            });
    };

    render() {
        const { folders = [] } = this.context;
        return (
            <ErrorBoundary>
                <section className='AddNote'>
                    <h2>Create a note</h2>
                    <NotefulForm onSubmit={this.handleSubmit}>
                        <div className='field'>
                            <label htmlFor='note-name-input'>Name</label>
                            <input type='text' id='note-name-input' name='note-name' />
                        </div>
                        <div className='field'>
                            <label htmlFor='note-content-input'>Content</label>
                            <textarea id='note-content-input' name='note-content' />
                        </div>
                        <div className='field'>
                            <label htmlFor='note-folder-select'>Folder</label>
                            <select id='note-folder-select' name='note-folder-id'>
                                <option value={null}>...</option>
                                {folders.map(folder => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='buttons'>
                            <button type='submit'>Add Note</button>
                        </div>
                    </NotefulForm>
                </section>
            </ErrorBoundary>
        );
    }
}

AddNote.propTypes = {
    history: PropTypes.object
};