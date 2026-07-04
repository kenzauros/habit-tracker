import { useState } from 'react'

function startOfWeek(date: Date) {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay())
  return start
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useWeekNav(today: Date) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return toDateKey(d)
  })

  function goToPreviousWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  function goToNextWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  return { days, goToPreviousWeek, goToNextWeek }
}
