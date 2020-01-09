import React from 'react'
export default class Issues extends React.Component {
  render () {
    return (
      <div>
        <div className='card' style={{ width: '18rem' }}>
          <div className='card-body'>
            {this.props.alerts > 0 &&
              <span className='red'>{this.props.alerts} New Comment&#40;s&#41;</span>}
            <br />
            {this.props.event.length !== 0 &&
              <span className='red'> Issue is {this.props.event} </span>}
            <h5 className='card-title'>Title: {this.props.title} </h5>
            <h6 className='card-subtitle mb-2 text-muted'>
              <img alt={this.props.avatar} src={this.props.avatar} className='card-text' height='32' width='32' />
                            USER: {this.props.user}
            </h6>
            <p className='card-text'>Issue Number: {this.props.number}</p>
            <p className='card-text'>Number of comments: {this.props.comments}</p>
            {this.props.body.length !== 0 &&
              <p className='card-text'>Body: {this.props.body}</p>}
            <p className='card-text'>Created: {this.props.created}</p>
            <p className='card-text'>Updated: {this.props.updated}</p>
            <a href={this.props.url} className='card-link'>URL</a>
          </div>
        </div>
      </div>
    )
  }
}
