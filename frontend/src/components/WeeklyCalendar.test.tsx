import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeeklyCalendar } from './WeeklyCalendar'

test('週の7日分が表示される', () => {
  render(<WeeklyCalendar today={new Date('2026-07-01')} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(7)
})

test('次の週へボタンで表示日が進む', async () => {
  render(<WeeklyCalendar today={new Date('2026-07-01')} />)
  const before = screen.getAllByRole('listitem')[0].textContent
  await userEvent.click(screen.getByLabelText('次の週へ'))
  const after = screen.getAllByRole('listitem')[0].textContent
  expect(after).not.toBe(before)
})
