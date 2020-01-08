import React from 'react'
import './App.css'
import Alerts from './alerts'
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.socket = new WebSocket('ws:localhost:3000')
    this.socket.addEventListener('message', (event) => this.receive(event))
    this.state = {
      issueList: [],
      alertList: []

    }
  }

  receive (e) {
    const data = JSON.parse(e.data)

    if (data.message === 'list') {
      this.setState({
        issueList: data.data
      })
    } else if (data.message === 'update') {
      this.update(data)
    } else if (data.message === 'comment') {
      this.alertComment(data)
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
        url: e.url,
        avatar: e.avatar,
        alerts: e.alerts
      })
      this.alertIssue(e)
      this.setState({
        issueList: temp
      })
    }
    if (e.action === 'closed') {
      const temp = this.state.issueList
      const index = temp.findIndex(x => x.number === e.number)
      temp.splice(index, 1)
      this.alertIssue(e)
      this.setState({
        issueList: temp
      })
    }
    if (e.action === 'edited') {
      const temp = this.state.issueList
      const index = temp.findIndex(x => x.number === e.number)
      temp[index] = {
        action: e.action,
        title: e.title,
        comments: e.comments,
        number: e.number,
        body: e.body,
        created: e.created,
        updated: e.updated,
        user: e.user,
        url: e.url,
        avatar: e.avatar,
        alerts: e.alerts
      }
      this.alertIssue(e)
      this.setState({
        issueList: temp
      })
    }
  }

  alertIssue (e) {
    const alert = `the issue number ${e.number} is ${e.action} by user: ${e.user}`
    const temp = this.state.alertList
    temp.push(alert)
    this.setState({
      alertList: temp
    })
  }

  alertComment (e) {
    const alert = `an Comment is ${e.action} by user: ${e.user} in issue number ${e.number}`
    const alertTemp = this.state.alertList
    alertTemp.push(alert)
    const temp = this.state.issueList
    const index = temp.findIndex(x => x.number === e.number)
    if (e.action === 'deleted') {
      temp[index].comments--
    } else if (e.action === 'created') {
      temp[index].comments++
      temp[index].alerts++
    } else if (e.action === 'edited') {
      temp[index].alerts++
    }

    this.setState({
      issueList: temp,
      alertList: alertTemp
    })
  }

  render () {
    return (
      <div className='App'>

        <div className='left'>
          <h1>Notification LIST</h1>
          {
            this.state.alertList.map((item) => (<Alerts key={item} message={item} />)
            )
          }

        </div>

        <div>
          <h1>ISSUE LIST</h1>
          {
            this.state.issueList.map((item) => (
              <div key={item.number} className='card' style={{ width: '18rem' }}>
                <div className='card-body'>

                  {item.alerts > 0 &&
                    <span className='red'>{item.alerts} New Comment</span>}

                  <h5 className='card-title'>Title: {item.title} </h5>

                  <h6 className='card-subtitle mb-2 text-muted'>

                    <img alt={item.avatar} src={item.avatar} className='card-text' height='32' width='32' />
                    USER: {item.user}
                  </h6>

                  <h6 className='card-subtitle mb-2 text-muted'>ISSUE NUMBER: {item.number}</h6>
                  <h6 className='card-subtitle mb-2 text-muted'>Number of comments: {item.comments}</h6>
                  <p className='card-text'>Content: {item.body}</p>
                  <p className='card-text'>CREATED: {item.created}</p>
                  <p className='card-text'>UPDATED: {item.updated}</p>

                  <a href={item.url} className='card-link'>URL</a>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    )
  }
}
