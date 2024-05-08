import dayjs, { Dayjs } from 'dayjs'

import isTodayPlugin from 'dayjs/plugin/isToday'
import toObjectPlugin from 'dayjs/plugin/toObject'
import weekdayPlugin from 'dayjs/plugin/weekday'
import { useEffect, useState } from 'react'
import Header from './Header'
import ViewDates from './ViewDates'
import ViewDays from './ViewDays'
import { now, IFormattedDateObj, getFormattedDateObj } from './calender.utils'

dayjs.extend(isTodayPlugin)
dayjs.extend(toObjectPlugin)
dayjs.extend(weekdayPlugin)

function CalendarView() {
	const [currentMonth, setCurrentMonth] = useState<Dayjs>(now)
	const [arrayOfDays, setArrayOfDays] = useState<IFormattedDateObj[][]>([])

	const getAllDays = () => {
		let currentDate = currentMonth.startOf('month').weekday(0) // 1st sunday in this month
		const nextMonth = currentMonth.add(1, 'month').month()

		const allDates = []
		let weekDates = []
		let weekCounter = 1

		while (currentDate.weekday(0).toObject().months !== nextMonth) {
			const formatted = getFormattedDateObj(currentDate, currentMonth.month())
			weekDates.push(formatted)
			if (weekCounter === 7) {
				allDates.push(weekDates)
				weekDates = []
				weekCounter = 0
			}
			weekCounter++
			currentDate = currentDate.add(1, 'day')
		}
		setArrayOfDays(allDates)
	}

	useEffect(() => {
		getAllDays()
	}, [currentMonth])

	return (
		<main className="flex h-full flex-col">
			<Header
				currentMonth={currentMonth}
				onChangeCurrentMonth={(day) => {
					setCurrentMonth(day)
				}}
			/>

			<div className="flex flex-1">
				<div className="ring-1 ring-border ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
					<ViewDays />
					<div className="flex overflow-auto bg-border text-xs leading-6 text-foreground lg:flex-auto">
						<ViewDates arrayOfDays={arrayOfDays} />
					</div>
				</div>
			</div>
		</main>
	)
}

export default CalendarView
