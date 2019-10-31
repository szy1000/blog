import React from 'react'


export default class Index extends React.Component<any, any> {
  constructor(props:any) {
    super(props)
    this.state = {
      init: 1,
    }
  }

  render() {
    const { init } = this.state
    console.log(init)
    return 'ssss'
  }
}
