import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import crosstab from 'crosstab'

window.crosstab = crosstab

window.amIMaster = () => crosstab.util.tabs[crosstab.util.keys.MASTER_TAB].id === crosstab.id

class Sender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [1, 2, 3, 4, 5, 6],
    }
    window.sender = this
    this.beSender = this.beSender.bind(this)
  }

  beSender () {
    crosstab.on('getVehiclesForValuation', message => {
      console.log('sender got message', message)
      crosstab.broadcast('setVehiclesForValuation', { items: this.state.items })
    })
  }

  render () {
    return (
      <div>
        Sender<br/>
        <ul>
          {this.state.items.map(item => <li key={item}>{item}</li>)}
        </ul>
        <button onClick={this.beSender}>Be Sender</button>
      </div>
    )
  }
}

class Receiver extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
    window.receiver = this
    this.getItems = this.getItems.bind(this)
  }

  getItems () {
    crosstab.on('setVehiclesForValuation', (message) => {
      console.log('receiver got message', message)
      this.setState({
        items: message.data.items,
      })
      crosstab.off('setVehiclesForValuation')
    })

    // ask for data
    crosstab.broadcast('getVehiclesForValuation', null)
  }

  render () {
    return (
      <div>
        Receiver<br/>
        <ul>
          {this.state.items.map(item => <li key={item}>{item}</li>)}
        </ul>
        <button onClick={this.getItems}>Get Items</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">*/}
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Welcome to React</h1>*/}
        {/*</header>*/}
        {/*<p className="App-intro">*/}
          {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        <hr />
        <Sender />
        <hr />
        <Receiver />
      </div>
    )
  }
}

export default App;
