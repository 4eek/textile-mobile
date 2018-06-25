const ForbiddenKeywords = ['testPassed', 'testTimedOut', 'runMethod'];

class TestComponent extends React.Component {
  componentDidMount() {
    const methodName = this.props.testName;
    const timeout = this.props.testTimeout;

    if (methodName === undefined || methodName === null) {
      throw Error('The test name was not specified');
    }

    if (timeout === undefined || timeout === null) {
      throw Error('The timeout was not specified');
    }

    if (ForbiddenKeywords.indexOf(methodName) > -1) {
      throw Error('The provided method name appears in the forbidden keywords');
    }

    const message = `${methodName} has timed out after ${timeout} seconds`;
    this.timerId = setTimeout(() => this.testTimedOut(message), timeout * 1000);

    this.runMethod(methodName);
  }

  testPassed() {
    clearTimeout(this.timerId);

    NativeModules.TestModule.markTestCompleted();
  }

  testTimedOut(message) {
    this.console.error(message);
  }

  async runMethod(methodName) {
    try {
      await this[methodName]();
    } catch (e) {
      this.console.error(e.message);
    }
  }

  render() {
    return <View />;
  }
}

module.exports = TestComponent;