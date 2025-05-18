// benchmark.ts
const marks: [label: string, time: number][] = []

function markStart(label: string) {
  marks.push([`[start] ${label}`, performance.now()])
}

function markEnd(label: string) {
  marks.push([`[end] ${label}`, performance.now()])
}

function reportBenchmark(log: boolean = true) {
  const results: string[] = []

  for (let i = 0; i < marks.length; i += 2) {
    const [startLabel, startTime] = marks[i] || []
    const [endLabel, endTime] = marks[i + 1] || []
    if (!startLabel || !endLabel) continue

    const label = startLabel.replace('[start] ', '')
    const duration = (endTime - startTime).toFixed(3)
    results.push(`${label}: ${duration}ms`)
  }

  if (log) console.log(results.join('\n'))
  return results
}

function clearBenchmark() {
  marks.length = 0
}

export const benchmark = {
  start: markStart,
  end: markEnd,
  report: reportBenchmark,
  clear: clearBenchmark,
}
