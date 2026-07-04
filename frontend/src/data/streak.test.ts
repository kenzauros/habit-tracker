import { calculateStreak } from './streak'
import type { HabitLog } from '../types'

test('連続した日数分をカウントする', () => {
  const logs: HabitLog[] = [
    { checkedDate: '2026-07-04' },
    { checkedDate: '2026-07-03' },
    { checkedDate: '2026-07-02' },
  ]
  expect(calculateStreak(logs, new Date('2026-07-04'))).toBe(3)
})

test('途中で途切れたらそこで止まる', () => {
  const logs: HabitLog[] = [{ checkedDate: '2026-07-04' }, { checkedDate: '2026-07-02' }]
  expect(calculateStreak(logs, new Date('2026-07-04'))).toBe(1)
})

test('today の記録がなければ0', () => {
  const logs: HabitLog[] = [{ checkedDate: '2026-07-03' }]
  expect(calculateStreak(logs, new Date('2026-07-04'))).toBe(0)
})

test('月をまたぐ連続記録を数える', () => {
  const logs: HabitLog[] = [
    { checkedDate: '2026-08-01' },
    { checkedDate: '2026-07-31' },
    { checkedDate: '2026-07-30' },
  ]
  expect(calculateStreak(logs, new Date('2026-08-01'))).toBe(3)
})

test('年をまたぐ連続記録を数える', () => {
  const logs: HabitLog[] = [{ checkedDate: '2027-01-01' }, { checkedDate: '2026-12-31' }]
  expect(calculateStreak(logs, new Date('2027-01-01'))).toBe(2)
})
