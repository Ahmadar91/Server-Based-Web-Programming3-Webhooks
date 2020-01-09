import React from 'react'
import './App.css'
import Alerts from './alerts'
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.socket = new window.WebSocket('ws:localhost:3000')
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
        alerts: e.alerts,
        event: e.action
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
        alerts: e.alerts,
        event: e.action
      }
      this.alertIssue(e)
      this.setState({
        issueList: temp
      })
    }
  }

  alertIssue (e) {
    const alert = {
      number: e.number,
      action: e.action,
      user: e.user,
      url: e.url,
      title: e.title,
      avatar: e.avatar,
      type: 'Issue'

    }
    const temp = this.state.alertList
    temp.push(alert)
    this.setState({
      alertList: temp
    })
  }

  alertComment (e) {
    const alert = {
      number: e.number,
      action: e.action,
      user: e.user,
      url: e.url,
      title: e.title,
      avatar: e.avatar,
      type: 'Comment'

    }
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
          <h1>Notification List</h1>
          {
            this.state.alertList.map((item) => (
              <Alerts key={item.number} type={item.type} title={item.title} number={item.number} action={item.action} user={item.user} avatar={item.avatar} url={item.url} />
            )
            )
          }

        </div>

        <div>
          <h1> Issue List</h1>
          {
            this.state.issueList.map((item) => (
              <div key={item.number} className='card' style={{ width: '18rem' }}>
                <div className='card-body'>

                  {item.alerts > 0 &&
                    <span className='red'>{item.alerts} New Comment&#40;s&#41;</span>}
                  {item.event.length !== 0 &&
                    <span className='red'> Issue is {item.event} </span>}

                  <h5 className='card-title'>Title: {item.title} </h5>

                  <h6 className='card-subtitle mb-2 text-muted'>

                    <img alt={item.avatar} src={item.avatar} className='card-text' height='32' width='32' />
                    USER: {item.user}
                  </h6>

                  <p className='card-text'>Issue Number: {item.number}</p>
                  <p className='card-text'>Number of comments: {item.comments}</p>
                  {item.body.length !== 0 &&
                    <p className='card-text'>Body: {item.body}</p>}
                  <p className='card-text'>Created: {item.created}</p>
                  <p className='card-text'>Updated: {item.updated}</p>

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
