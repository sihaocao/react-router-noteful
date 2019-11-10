import React from 'react'
import { Link } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Note.css'
import PropTypes from 'prop-types'

export default class Note extends React.Component {
  static defaultProps ={
    onDeleteNote: () => {},
  }
  static contextType = ApiContext;

  handleClickDelete = event => {
    event.preventDefault()
    const noteId = this.props.id

    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          // return res.json().then(e => Promise.reject(e))
          return res.then(event => Promise.reject(event))
        // return res.json()
        return res
        })
      .then(() => {
        this.context.deleteNote(noteId)
        // allow parent to perform extra behaviour
        this.props.onDeleteNote(noteId)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { name, id, modified } = this.props
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/notes/${id}`}>
            {name}
          </Link>
        </h2>
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          {/* <FontAwesomeIcon icon='trash-alt' />
          {' '} */}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified:
            {' '}
            <span className='Date'>
              {(new Date(modified).getMonth() + 1) + '-' + new Date(modified).getDate() + '-' + new Date(modified).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Note.propTypes = {
  deleteNote: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  modified: PropTypes.string,
}