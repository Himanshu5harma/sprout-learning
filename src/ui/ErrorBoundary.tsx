import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Feedback } from "./primitives";
export class ErrorBoundary extends Component<
  { children: ReactNode; scope?: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Never send component stacks, source, code, profile names, or saved data.
    console.error("Sprout interface failure", {
      category: "render",
      scope: this.props.scope || "application",
    });
  }
  render() {
    if (this.state.failed)
      return (
        <Feedback tone="error">
          <h2>This part of Sprout could not open.</h2>
          <p>
            Your saved work is kept on this device. Retry, or reload if the
            problem continues.
          </p>
          <Button onClick={() => this.setState({ failed: false })}>
            Retry
          </Button>{" "}
          <Button variant="secondary" onClick={() => location.reload()}>
            Reload Sprout
          </Button>
        </Feedback>
      );
    return this.props.children;
  }
}
