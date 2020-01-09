import React from 'react'
export default class Alerts extends React.Component {
  render () {
    return (
      <div>
        <div className='card text-white bg-success mb-3' style={{ width: '18rem' }}>
          <div className='card-header'>{this.props.type} is {this.props.action} </div>
          <div className='card-body'>
            <p className='card-text'> <img alt={this.props.avatar} src={this.props.avatar} className='card-text' height='32' width='32' /> User: {this.props.user} has {this.props.action} {this.props.type} in issue number {this.props.number} Titled: {this.props.title} click on <a href={this.props.url} className='card-link'>URL</a> to access</p>
            {this.props.type === 'Comment' &&
              <span>comment: {this.props.content}</span>}

          </div>
        </div>
      </div>
    )
  }
}
