import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { HabitItem } from './HabitItem'
import type { Habit } from '../../types'

const habit: Habit = {
  id: 'habit-1',
  name: '読書',
  category: '学習',
  archived: false,
  logs: [],
}

test('習慣名とカテゴリが表示される', () => {
  render(<HabitItem habit={habit} onCheckIn={() => {}} onArchive={() => {}} />)
  expect(screen.getByText('読書')).toBeInTheDocument()
  expect(screen.getByText('学習')).toBeInTheDocument()
})

test('チェックインボタンを押すとonCheckInが呼ばれる', async () => {
  const onCheckIn = vi.fn()
  render(<HabitItem habit={habit} onCheckIn={onCheckIn} onArchive={() => {}} />)
  await userEvent.click(screen.getByLabelText('読書をチェックイン'))
  expect(onCheckIn).toHaveBeenCalledWith('habit-1')
})
