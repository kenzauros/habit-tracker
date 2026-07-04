import { render, screen } from '@testing-library/react'
import { StreakBadge } from './StreakBadge'
import type { HabitLog } from '../../types'

test('連続達成日数が表示される', () => {
  const logs: HabitLog[] = [
    { checkedDate: '2026-07-04' },
    { checkedDate: '2026-07-03' },
    { checkedDate: '2026-07-02' },
  ]
  render(<StreakBadge today={new Date('2026-07-04')} logs={logs} />)
  expect(screen.getByLabelText('3日連続達成')).toBeInTheDocument()
})

test('記録がない場合は専用の表示になる', () => {
  render(<StreakBadge today={new Date('2026-07-04')} logs={[]} />)
  expect(screen.getByText('記録なし')).toBeInTheDocument()
})
