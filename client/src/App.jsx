import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {

  socket
  state
  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws:localhost:3000");
    this.socket.addEventListener('message', (event) => this.receive(event))
    this.state = {
      issueList: []
    }
  }
  receive(e) {
    const data = JSON.parse(e.data)
    console.log(e.data);

    if (data.message === 'list') {
      this.setState({
        issueList: data.data
      })
      
    }
   else if (data.message === 'update') {
        this.update(data)
        console.log(data.action);
      }
  }

  update(e) {
    if (e.action === 'open' || e.action === 'reopened') {
      const temp = this.state.issueList
      temp.push({
        action: e.action,
        title: e.title,
        comments: e.comments,
        number: e.number
      })
      this.setState({
        issueList: temp
      })
      console.log(temp)
    }
    if (e.action === 'closed') {
      const temp = this.state.issueList
     let index = temp.findIndex(x => x.number === e.number)
     temp.splice(index , 1)
      this.setState({
        issueList: temp
      })
      console.log(temp)
    }
  }


  render() {
    return (
      <div>
        {
          this.state.issueList.map((item) => (
            <div>
              {item.title}

            </div>
          ))
        }
      </div>
    )
  }
}
