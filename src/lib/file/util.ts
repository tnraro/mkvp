export const humanReadableFileSize = (size: number) => {
  if (size < 1024) return `${size} Bytes`
  else if (size < 1048576) return `${Math.round(size / 1024)} KB`
  else if (size < 1073741824) return `${Math.round(size / 1048576)} MB`
  else if (size < 1099511627776) return `${Math.round(size / 1073741824)} GB`
  else return `${Math.round(size / 1099511627776)} TB`
}

export const humanReadableDateTime = (dateTime: number) => {
  return Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" })
    .format(dateTime)
}