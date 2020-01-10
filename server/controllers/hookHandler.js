const hookHandler = {}
const octonode = require('octonode')
const client = octonode.client(process.env.Token)
const repo = client.repo('1dv523/aa224fn-examination-3')
hookHandler.list = (body) => {
  const issueList = []
  body.map((item) => {
    issueList.push({
      title: item.title,
      url: item.html_url,
      number: item.number,
      user: item.user.login,
      body: item.body,
      created: item.created_at,
      updated: item.updated_at,
      comments: item.comments,
      avatar: item.user.avatar_url,
      alerts: 0,
      event: ''
    })
  })
  return issueList
}
hookHandler.obj = (type, data) => {
  const obj = {
    message: type,
    action: data.action,
    title: data.issue.title,
    comments: data.issue.comments,
    number: data.issue.number,
    body: data.issue.body,
    created: data.issue.created_at,
    updated: data.issue.updated_at,
    user: data.issue.user.login,
    url: data.issue.html_url,
    avatar: data.issue.user.avatar_url,
    alerts: 0,
    event: ''
  }
  if (type === 'issue_comment') {
    obj.commentUser = data.comment.user.login
    obj.commentAvatar = data.comment.user.avatar_url
    obj.commentBody = data.comment.body
  }
  return obj
}
hookHandler.sendIssues = (ws) => {
  repo.issues(function (callback, body, header) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ message: 'list', data: hookHandler.list(body) }))
    }
  })
}
hookHandler.send = (type, data, ws) => {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(hookHandler.obj(type, data)))
  }
}
module.exports = hookHandler
