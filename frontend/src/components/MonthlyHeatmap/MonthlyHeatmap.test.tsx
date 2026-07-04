import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonthlyHeatmap } from './MonthlyHeatmap'
import type { HabitLog } from '../../types'

test('月の日数分のセルが表示される', () => {
  render(<MonthlyHeatmap today={new Date('2026-07-01')} logs={[]} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(31)
})

test('ログがある日はチェック済みスタイルになる', () => {
  const logs: HabitLog[] = [{ checkedDate: '2026-07-15' }]
  render(<MonthlyHeatmap today={new Date('2026-07-01')} logs={logs} />)
  expect(screen.getByText('15')).toHaveClass('monthly-heatmap-day-checked')
})

test('次の月へボタンで表示月が進む', async () => {
  render(<MonthlyHeatmap today={new Date('2026-07-01')} logs={[]} />)
  await userEvent.click(screen.getByLabelText('次の月へ'))
  expect(screen.getByText('2026年8月')).toBeInTheDocument()
})

test('前の月へボタンで表示月が戻る', async () => {
  render(<MonthlyHeatmap today={new Date('2026-07-01')} logs={[]} />)
  await userEvent.click(screen.getByLabelText('前の月へ'))
  expect(screen.getByText('2026年6月')).toBeInTheDocument()
})
