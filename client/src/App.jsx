import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {

  socket
  state
  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws:localhost:3000");
    this.socket.addEventListener('message', (event)=>this.receive(event))
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
if (data.message === 'update') {
  this.setState({
    issueList: data.data
  })
// }else if (data.message === 'comment'){
//   this.setState
// }
    console.log(e);
    
}
  }}

  render() {
    return (
<div>
{
this.state.issueList.map((item) =>(
  <div>
{item.title}

  </div>
))
}
</div>
    )
  }
}
