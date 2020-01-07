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
        body: e.body
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
        <Alerts active={this.state.alerts.active} message={this.state.alerts.message} />

        <div className='App'>
          {
            this.state.issueList.map((item) => (
              <div>
                {item.title}
                {item.body}
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
