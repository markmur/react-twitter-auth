/* eslint-disable import/no-unassigned-import */
import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

class App extends React.Component {
  state = {
    loading: true,
    user: {},
    error: '',
  }

  componentDidMount() {
    return fetch('/profile')
      .then(response => {
        if (response.status === 401) {
          window.location.href = 'http://localhost:8080/auth/twitter'
        }

        return response
      })
      .then(response => response.json())
      .then(user => this.setState({ user, loading: false }))
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false,
          error: 'You are not logged in',
        })
      })
  }

  render() {
    const { user, loading, error } = this.state

    if (error) return <div>{error}</div>
    if (loading) return <div>Loading...</div>

    return (
      <div className="App">
        <h1>Hello, {user.displayName}</h1>
      </div>
    )
  }
}

const rootElement = document.querySelector('#root')
ReactDOM.render(<App />, rootElement)
