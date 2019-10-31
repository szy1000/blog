import React from 'react'

interface Props {
  foo: String
}

export default class App extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props)
    this.state = {
      init: 1,
    }
  }

  render() {
    const { init } = this.state
    console.log(init)
    return <div>sss</div>
  }
}
