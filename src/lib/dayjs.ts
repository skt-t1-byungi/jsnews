import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.locale('ko')
dayjs.extend(relativeTime)
dayjs.extend(utc)

export default dayjs
