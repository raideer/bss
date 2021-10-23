export const timeout = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
