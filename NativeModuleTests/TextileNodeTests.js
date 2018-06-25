import TestComponent from './TestComponent'

class TextileNodeTests extends TestComponent {
  testActionA() {    
    const data = LoggingBridge.performAction();
    
    if (data !== 'A') {
        throw Error('Expected A but got #{data} instead');
    }
    
    this.testPassed();
  }

  testActionB() {    
    const data = LoggingBridge.performAnotherAction();
    
    if (data !== 'B') {
        throw Error('Expected B but got #{data} instead');
    }
    
    this.testPassed();
  }
}

module.exports = LoggingBridgeTests;