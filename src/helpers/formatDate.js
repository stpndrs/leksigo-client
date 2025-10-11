export function formatDate(date, format = 'short') {
    if (!date) return '-'

    const parsedDate = new Date(date)
    if (isNaN(parsedDate)) return '-' // date tidak valid

    const options = format === 'long'
        ? {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
        : {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }

    return new Intl.DateTimeFormat('id-ID', options).format(parsedDate)
}
