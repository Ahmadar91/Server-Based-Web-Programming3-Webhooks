import React from 'react'
import './App.css'
import Alerts from './Alerts'
import AlertComments from './AlertComments'

import Issues from './issues'
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.socket = new window.WebSocket(process.env.REACT_APP_SOCKET)
    this.socket.addEventListener('message', (event) => this.receiveData(event))
    this.state = {
      issueList: [],
      alertList: [],
      alertListComments: []
    }
  }

  receiveData (e) {
    const data = JSON.parse(e.data)
    if (data.message === 'list') {
      this.setState({
        issueList: data.data
      })
    } else if (data.message === 'issues') {
      this.updateIssue(data)
    } else if (data.message === 'issue_comment') {
      this.alertComment(data)
    }
  }

  updateIssue (e) {
    if (e.action === 'open' || e.action === 'reopened') {
      this.openIssue(e)
    }
    if (e.action === 'closed') {
      this.closedIssue(e)
    }
    if (e.action === 'edited') {
      this.editedIssue(e)
    }
  }

  closedIssue (e) {
    const temp = this.state.issueList
    const index = temp.findIndex(x => x.number === e.number)
    temp.splice(index, 1)
    this.alertIssue(e)
    this.setState({
      issueList: temp
    })
  }

  editedIssue (e) {
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

  openIssue (e) {
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
    this.updateCommentAlert(alert, e)
  }

  updateCommentAlert (alert, e) {
    const alertTemp = this.state.alertListComments
    alertTemp.push(alert)
    const temp = this.state.issueList
    const index = temp.findIndex(x => x.number === e.number)
    console.log(index)
    if (index < 0) {
      this.setState({
        issueList: temp,
        alertListComments: alertTemp
      })
    } else {
      switch (e.action) {
        case 'deleted':
          temp[index].comments--
          break
        case 'created':
          temp[index].comments++
          temp[index].alerts++
          break
        case 'edited':
          temp[index].alerts++
          break
      }
      this.setState({
        issueList: temp,
        alertListComments: alertTemp
      })
    }
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
          {
            this.state.alertListComments.map((item) => (
              <AlertComments key={item.number} type={item.type} title={item.title} number={item.number} action={item.action} user={item.user} avatar={item.avatar} url={item.url} content={item.content} />
            )
            )
          }
        </div>
        <div>
          <h1> Issue List</h1>
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
