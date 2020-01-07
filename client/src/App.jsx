import React from 'react'
import logo from './logo.svg'
import './App.css'
import Alerts from './alerts'
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.socket = new WebSocket('ws:localhost:3000')
    this.socket.addEventListener('message', (event) => this.receive(event))
    this.state = {
      issueList: [],
      alerts: {
        active: false,
        message: ''
      }
    }
  }

  receive (e) {
    const data = JSON.parse(e.data)
    console.log(e.data)

    if (data.message === 'list') {
      this.setState({
        issueList: data.data
      })
    } else if (data.message === 'update') {
      this.update(data)
      console.log(data.action)
    }
  }

  update (e) {
    if (e.action === 'open' || e.action === 'reopened') {
      const temp = this.state.issueList
      temp.push({
        action: e.action,
        title: e.title,
        comments: e.comments,
        number: e.number,
        body: e.body,
        created: e.created,
        updated: e.updated,
        user: e.user,
        url: e.url
      })
      this.setState({
        issueList: temp,
        alerts: {
          active: true,
          message: `new issue is ${e.action}`
        }
      })
      console.log(temp)
    }
    if (e.action === 'closed') {
      const temp = this.state.issueList
      const index = temp.findIndex(x => x.number === e.number)
      temp.splice(index, 1)
      this.setState({
        issueList: temp
      })
      console.log(temp)
    }
    if (e.action === 'edited') {
      const temp = this.state.issueList
      const index = temp.findIndex(x => x.number === e.number)
      temp[index] = {
        action: e.action,
        title: e.title,
        comments: e.comments,
        number: e.number,
        body: e.body
      }
      this.setState({
        issueList: temp
      })
      console.log(temp)
    }
  }

  render () {
    return (
      <div>
        <h1>ISSUE LIST</h1>
        <Alerts active={this.state.alerts.active} message={this.state.alerts.message} />

        <div className='App'>
          {
            this.state.issueList.map((item) => (
              <div className='card' style={{ width: '18rem' }}>
                <div className='card-body'>
                  <h5 className='card-title'>Title: {item.title}</h5>
                  <h6 className='card-subtitle mb-2 text-muted'>USER: {item.user}</h6>
                  <h6 className='card-subtitle mb-2 text-muted'>ISSUE NUMBER: {item.number}</h6>
                  <h6 className='card-subtitle mb-2 text-muted'>comments: {item.comments}</h6>
                  <p className='card-text'>Content: {item.body}</p>
                  <p className='card-text'>CREATED: {item.created}</p>
                  <p className='card-text'>UPDATED: {item.updated}</p>
                  <a href={item.url} class='card-link'>URL</a>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    )
  }
}
