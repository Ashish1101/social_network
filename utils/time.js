import moment from 'moment'

export const timeFormat = (date) => {
    return moment(date).format('ll');
}