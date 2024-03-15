import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      console.log("clalllll");
      // 에러가 발생한 경우 에러 메시지를 표시하거나 다른 대체 UI를 제공할 수 있음
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }

    // 정상적인 경우 자식 컴포넌트를 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;
