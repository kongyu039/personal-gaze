// 工具js库 - src/static/utils.js
/**
 * 处理页面可见工具
 * @param {function} [hiddenFunc = ()=>{}] 隐藏回调函数
 * @param {function} [visibleFunc = ()=>{}] 可见回调函数
 */
function handleVisibilityChange(hiddenFunc = () => {}, visibleFunc = () => {}) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {hiddenFunc()} else if (document.visibilityState === 'visible') {visibleFunc()}
  })
}

/**
 * 时间戳转时间
 * @param {number} timestamp 时间戳（单位为毫秒）
 * @return {string} 时间（格式为 yyyy-MM-dd HH:mm）
 */
function timestampToTime(timestamp) {
  // 创建一个 Date 对象
  const date = new Date(timestamp)
  // 提取年、月、日、小时和分钟
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  // 返回格式化后的字符串
  return `${ year }-${ month }-${ day } ${ hours }:${ minutes }`
}

/**
 * 毫秒转时分
 * @param {number} millisecond 毫秒数
 * @return {string} 时间（格式为 HH时mm分）
 */
function millisecondToTime(millisecond) {
  // 计算总秒数
  const totalSeconds = Math.floor(millisecond / 1000)

  // 计算小时、分钟和秒
  const hours = Math.floor(totalSeconds / 3600) // 向下取整
  const minutes = Math.ceil((totalSeconds % 3600) / 60) // 向上取整

  // 返回格式化后的字符串
  return `${ String(hours) }时${ String(minutes).padStart(2, '0') }分`
}

/**
 * 毫秒转分
 * @param {number} millisecond 毫秒数
 * @return {string} 时间（mm）
 */
function millisecondToMinute(millisecond) {
  // 计算总秒数
  const totalSeconds = Math.floor(millisecond / 1000)
  // 计算总分钟数
  const minutes = Math.floor(totalSeconds / 60)
  // 返回格式化的分钟数
  return minutes.toString() // 使用 toString() 而不是加空字符串
}

/**
 * 毫秒转小时
 * @param {number} millisecond 毫秒数
 * @return {string} 时间（HH）
 */
function millisecondToHour(millisecond) {
  // 计算总秒数
  const totalSeconds = Math.floor(millisecond / 1000)
  // 计算总小时数
  const hours = totalSeconds / 3600 // 直接计算小时数
  // 如果小时数是整数，则返回整数部分；如果有小数则保留1位小数
  return hours % 1 === 0 ? hours.toString() : hours.toFixed(1)
}

/**
 * 显示Toast
 * @param {string} message 显示内容
 * @param {number} duration 显示时长（毫秒）默认3秒
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast')
  toast.textContent = message // 设置弹窗内容
  toast.classList.add('show') // 添加显示类

  // 设定定时器以在指定时间后隐藏弹窗
  setTimeout(() => {
    toast.classList.remove('show') // 移除显示类
  }, duration)
}
