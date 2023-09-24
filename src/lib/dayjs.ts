import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('ko')
dayjs.extend(relativeTime)

export default dayjs
