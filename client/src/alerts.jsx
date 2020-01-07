import React from 'react'
export default class Alerts extends React.Component {
  render () {
    if (this.props.active === true) {
      return (
        <div>
          {this.props.message}

        </div>
      )
    }
    return (
      <div />
    )
  }
}
