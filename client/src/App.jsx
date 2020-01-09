import React from 'react'
import './App.css'
import Alerts from './alerts'
import Issues from './issues'
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
    } else if (data.message === 'issues') {
      this.update(data)
    } else if (data.message === 'issue_comment') {
      this.alertComment(data)
    }
  }

  update (e) {
    if (e.action === 'open' || e.action === 'reopened') {
      this.open(e)
    }
    if (e.action === 'closed') {
      this.closed(e)
    }
    if (e.action === 'edited') {
      this.edited(e)
    }
  }

  closed (e) {
    const temp = this.state.issueList
    const index = temp.findIndex(x => x.number === e.number)
    temp.splice(index, 1)
    this.alertIssue(e)
    this.setState({
      issueList: temp
    })
  }

  edited (e) {
    const temp = this.state.issueList
    const index = temp.findIndex(x => x.number === e.number)
    const current = temp[index].alerts
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
      alerts: current,
      event: e.action
    }
    this.alertIssue(e)
    this.setState({
      issueList: temp
    })
  }

  open (e) {
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
      user: e.commentUser,
      url: e.url,
      title: e.title,
      avatar: e.commentAvatar,
      content: e.commentBody,
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
          <h1 className='white'>Notification List</h1>
          {
            this.state.alertList.map((item) => (
              <Alerts key={item.number} type={item.type} title={item.title} number={item.number} action={item.action} user={item.user} avatar={item.avatar} url={item.url} content={item.content} />
            )
            )
          }
        </div>
        <div>
          <h1 className='white'> Issue List</h1>
          {
            this.state.issueList.map((item) => (
              <Issues key={item.number} alerts={item.alerts} event={item.event} title={item.title} avatar={item.avatar} user={item.user} number={item.number} comments={item.comments} body={item.body} created={item.created} updated={item.updated} url={item.url} />
            ))
          }
        </div>
      </div>
    )
  }
}
