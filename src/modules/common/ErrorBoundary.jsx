import React from "react";
import { MdErrorOutline } from "react-icons/md";
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log("Log Error TO service", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        if(this.props.type==="icon") {
            return <MdErrorOutline />
        } else {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;