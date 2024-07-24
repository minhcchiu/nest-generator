import { performance } from "perf_hooks";

class PerformanceLogger {
  private startTime: number;

  start(): void {
    this.startTime = performance.now();
  }

  end(): void {
    const duration = performance.now() - this.startTime;

    console.log(`Performance duration: ${duration}ms`); // eslint-disable-line
  }
}

const performanceLogger = new PerformanceLogger();

export { performanceLogger };
