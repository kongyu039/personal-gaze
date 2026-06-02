// index.js

/**
 * 初始化视图
 */
function initView() {
  const headerHome = document.querySelector('.header-container>.home')
  const headerRefresh = document.querySelector('.header-container>.refresh')
  headerHome.addEventListener('click', headerHomeClick)
  headerRefresh.addEventListener('click', headerRefreshClick)
}

/** 头部点击主页事件(在新标签页中打开) */
function headerHomeClick() {window.open(dbJson.home, "_blank")}

/** 头部点击刷新事件 */
function headerRefreshClick() {window.location.reload()}

/**
 * 读取URL参数
 * @returns {string} 参数
 */
function readParams() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('read') || dbJson.defaultRead
}

/**
 * 获取API数据
 * @param {successCallback} successCallback 成功回调
 * @param {errorCallback} errorCallback 错误回调
 */
function fetchApiData(successCallback, errorCallback) {
  // 获取数据FetchPromise
  const fetchPromise = fetch(dbJson.defaultUrl, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01", "accept-language": "zh-CN,zh;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    "body": `note_id=${ readParams() }`,
    "method": "POST",
  })
    .then(response => {
      if (!response.ok) {throw new Error('网络响应不正常')}
      return response.json()
    })
    .then(data => {
      // 验证数据,并且处理返回正常的数据,否则返回错误
      if (data['status'] !== 1) {throw new Error('数据获取失败 status 不正常！')}
      try {
        const noteContentArr = JSON.parse(data['data']['note_content'])
        if (!Array.isArray(noteContentArr)) { new Error('数据获取失败 note_content 不正常！')}
        for (let noteContentArrElement of noteContentArr) {
          if (noteContentArrElement['title'] === 'phone') {
            const contentObj = JSON.parse(noteContentArrElement['content'])
            if (contentObj['status'] === 1 || contentObj['status'] === 0) {
              return contentObj
            } else {
              new Error('数据获取失败 content 不正常！')
            }
          }
        }
        new Error('数据获取失败 note_content 不正常！')
      } catch (e) {
        throw new Error(e.message)
      }
    })

  // 请求超时处理Promise
  const timeoutPromise = new Promise((_, reject) => {setTimeout(() => {reject(new Error(`请求超时，超时时长为 8 秒`))}, 8000)})

  Promise.race([fetchPromise, timeoutPromise])
    .then(data => {successCallback(data)})
    .catch(error => {errorCallback(error)})
}

/**
 * IP地址获取天气
 * @param {string} ipAddress IP地址
 * @param {successCallback} successCallback 成功回调
 */
function ipGetWeather(ipAddress, successCallback) {
  // 请求超时处理Promise
  const timeoutPromise = new Promise((_, reject) => {setTimeout(() => {reject(new Error(`请求超时，超时时长为 8 秒`))}, 8000)})

  // 获取数据FetchPromise
  const fetchPromise = fetch("https://node.api.xfabe.com/api/weather/get?ip=" + ipAddress)
    .then(response => {
      if (!response.ok) {throw new Error('网络响应不正常')}
      return response.json()
    })
    .then(data => {
      if (data['code'] !== 200) {throw new Error('数据获取失败 status 不正常！')}
      const weather = data['data']['weather'][0]
      weather['city'] = data['data']['city']
      return weather
    })

  Promise.race([fetchPromise, timeoutPromise])
    .then(data => {successCallback(data)})
    .catch(error => { console.error('数据处理失败：', error)})
}

/** 加载数据并渲染页面 */
function loadDataAndRender() {
  fetchApiData(handlerData => {
    // 必有属性 status为1||0
    if (handlerData['status'] === 1 || handlerData['status'] === 0) {
      requiredAttributeRendering(handlerData)
    }

    // 可选属性 status为0
    if (handlerData['status'] === 0) {
      optionalAttributeRendering(handlerData)
    } else {
      // 隐藏可选属性的容器
      ;(/** @type {HTMLElement} */document.querySelector('.today-screen-usage')).style.display = 'none'
      ;(/** @type {HTMLElement} */document.querySelector('.week-screen-usage')).style.display = 'none'
      ;(/** @type {HTMLElement} */document.querySelector('.using-app-info')).style.display = 'none'
      ;(/** @type {HTMLElement} */document.querySelector('.app-info-list')).style.display = 'none'
    }

    // 显示Toast
    showToast('数据处理成功！')
  }, error => {
    showToast(`数据处理失败：${ error.message }`)
    console.error('数据处理失败：', error)
  })
}

/**
 * 必填属性渲染(status为0|1)
 * @param {Object} handlerData 数据对象
 */
function requiredAttributeRendering(handlerData) {
  const deviceInfo = handlerData['deviceInfo']
  document.getElementById("uploadTimestamp").textContent = timestampToTime(handlerData['uploadTimestamp'])
  document.getElementById("battery").textContent = `${ deviceInfo['battery'] }%`
  document.getElementById("deviceIP").textContent = deviceInfo['deviceIP']
  document.getElementById("deviceModel").textContent = deviceInfo['deviceModel']
  document.getElementById("isCharging").textContent = deviceInfo['isCharging'] ? '是' : '否'
  document.getElementById("memoryUsageRate").textContent = `${ deviceInfo['memoryUsageRate'] }%`
  document.getElementById("networkType").textContent = deviceInfo['networkType']
  document.getElementById("slogan").textContent = deviceInfo['slogan']
  document.getElementById("status").textContent = deviceInfo['status'] ? '亮屏' : '息屏'
  document.getElementById("userAgent").textContent = deviceInfo['userAgent']
  this.renderDailyBatteryChart(document.getElementById('dailyBatteryUsageChart'), deviceInfo['dailyBatteryUsage'])
  this.ipGetWeather(deviceInfo['deviceIP'], weather => {
    document.getElementById("weatherCity").textContent = weather['city']
    document.getElementById("weatherTemp").textContent = weather['temp']
    document.getElementById("weatherHigh").textContent = `${ weather['low'] }~${ weather['high'] }`
    document.getElementById("weatherRainfall").textContent = weather['rainfall']
    document.getElementById("weatherHumidity").textContent = weather['humidity']
    document.getElementById("weatherWind").textContent = `${ weather['wind_scale'] }级`
  })
}

/**
 * 必填属性渲染(status为0)
 * @param {Object} handlerData 数据对象
 */
function optionalAttributeRendering(handlerData) {
  if (handlerData['status'] !== 0) {return}
  const deviceInfo = handlerData['deviceInfo']
  // 显示今日使用时长
  if (deviceInfo['todayScreenUsageMsecond'] !== 0 &&
    Array.isArray(deviceInfo['todayScreenUsage24Msecond'])) {
    document.getElementById('todayScreenUsage').textContent = millisecondToHour(deviceInfo['todayScreenUsageMsecond']) + '小时'
    this.renderDailyScreenUsageChart(document.getElementById('todayScreenUsageChart'), deviceInfo['todayScreenUsage24Msecond'], '今日')
  } else {
    (/** @type {HTMLElement} */document.querySelector('.today-screen-usage')).style.display = 'none'
  }
  // 显示本周使用时长
  if (deviceInfo['weekScreenUsageMsecond'] !== 0 &&
    Array.isArray(deviceInfo['weekScreenUsage7Msecond'])) {
    document.getElementById('weekScreenUsage').textContent = millisecondToHour(deviceInfo['weekScreenUsageMsecond']) + '小时'
    this.renderWeekScreenUsageChart(document.getElementById('weekScreenUsageChart'), deviceInfo['weekScreenUsage7Msecond'])
  } else {
    (/** @type {HTMLElement} */document.querySelector('.week-screen-usage')).style.display = 'none'
  }
  // 显示使用应用信息
  if (deviceInfo['usingFullAppInfo']) {
    this.renderUsingAppInfo(deviceInfo['usingFullAppInfo'])
  } else {
    (/** @type {HTMLElement} */document.querySelector('.using-app-info')).style.display = 'none'
  }
  // 今日应用基本使用信息列表
  if (deviceInfo['todayBaseAppInfoList']) {
    this.renderTodayBaseAppInfoList(deviceInfo['todayBaseAppInfoList'])
  } else {
    (/** @type {HTMLElement} */document.querySelector('.app-info-list')).style.display = 'none'
  }
}

/**
 * 今日应用基本使用信息列表渲染
 * @param {Array<Object>} todayBaseAppInfoList 今日应用基本使用信息列表
 */
function renderTodayBaseAppInfoList(todayBaseAppInfoList) {
  const appInfoList = document.getElementById('appInfoList')
  const newTodayBaseAppInfoList = todayBaseAppInfoList.slice().sort((a, b) => b['dailyUsageMsecond'] - a['dailyUsageMsecond'])
  newTodayBaseAppInfoList.forEach(item => {
    /** @type {HTMLDivElement} */
    const tempRootDiv = document.createElement('div')
    tempRootDiv.className = 'item-value-item'
    /** @type {HTMLDivElement} */
    const appDetails = document.createElement('div')
    /** @type {HTMLSpanElement} */
    const appName = document.createElement('span')
    appName.textContent = item['appName'] // 安全插入
    /** @type {HTMLSpanElement} */
    const packageName = document.createElement('span')
    packageName.textContent = item['packageName'] // 安全插入
    /** @type {HTMLSpanElement} */
    const typeFlag = document.createElement('span')
    typeFlag.textContent = item['typeFlag'] // 安全插入
    appDetails.appendChild(appName)
    appDetails.appendChild(packageName)
    appDetails.appendChild(typeFlag)

    /** @type {HTMLDivElement} */
    const usageDetails = document.createElement('div')
    /** @type {HTMLSpanElement} */
    const usageTime = document.createElement('span')
    usageTime.textContent = millisecondToTime(item['dailyUsageMsecond']) // 安全插入
    /** @type {HTMLSpanElement} */
    const lastUsedTime = document.createElement('span')
    lastUsedTime.textContent = timestampToTime(item['dailyLastUsedTimestamp']) // 安全插入
    usageDetails.appendChild(usageTime)
    usageDetails.appendChild(lastUsedTime)
    tempRootDiv.appendChild(appDetails)
    tempRootDiv.appendChild(usageDetails)
    appInfoList.appendChild(tempRootDiv)
  })
}

/**
 * 使用应用信息渲染
 * @param {Object} usingFullAppInfo 使用应用信息
 */
function renderUsingAppInfo(usingFullAppInfo) {
  document.getElementById('appNameUsing').textContent = usingFullAppInfo['appName']
  document.getElementById('packageNameUsing').textContent = usingFullAppInfo['packageName']
  document.getElementById('typeFlagUsing').textContent = usingFullAppInfo['typeFlag']
  document.getElementById('lastUsedTimestampUsing').textContent = timestampToTime(usingFullAppInfo['lastUsedTimestamp'])
  document.getElementById('todayUsageMsecondUsing').textContent = millisecondToHour(usingFullAppInfo['todayUsageMsecond']) + '小时'
  document.getElementById('yesterdayUsageMsecondUsing').textContent = millisecondToHour(usingFullAppInfo['yesterdayUsageMsecond']) + '小时'
  document.getElementById('weekTotalUsageMsecondUsing').textContent = millisecondToHour(usingFullAppInfo['weekTotalUsageMsecond']) + '小时'
  document.getElementById('lastWeekTotalUsageMsecondUsing').textContent = millisecondToHour(usingFullAppInfo['lastWeekTotalUsageMsecond']) + '小时'
}

/**
 * 绘制每日电量图表(柱状图)
 * @param {HTMLCanvasElement} ctx Element对象
 * @param {Array<number>} dailyBatteryArr 每日电量数据
 */
function renderDailyBatteryChart(ctx, dailyBatteryArr) {
  const labels = []
  for (let i = 0; i < 24; i++) {labels.push(i + '点')}
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, datasets: [{
        label: '每日时刻电量', data: dailyBatteryArr.slice(0, -1), backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {beginAtZero: true, min: 0, max: 100}, x: {grid: {display: false}},
      },
    },
  })
}

/**
 *
 * @param {HTMLCanvasElement} ctx Element对象
 * @param {Array<number>} dailyScreenUsage 每日屏幕使用数据
 * @param {string} flag 标识符
 */
function renderDailyScreenUsageChart(ctx, dailyScreenUsage, flag) {
  const labels = []
  const minuteArr = dailyScreenUsage.map(item => millisecondToMinute(item))
  for (let i = 0; i < 24; i++) {labels.push(i + '点')}
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, datasets: [{
        label: flag, data: minuteArr, backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {beginAtZero: true, min: 0, max: 60}, x: {grid: {display: false}},
      },
    },
  })
}

/**
 * 绘制本周屏幕使用图表(柱状图)
 * @param {HTMLCanvasElement} ctx Element对象
 * @param {Array<number>} weekScreenUsage 每日屏幕使用数据
 */
function renderWeekScreenUsageChart(ctx, weekScreenUsage) {
  const labels = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
  const hourlyArr = weekScreenUsage.map(item => millisecondToHour(item))
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, datasets: [{
        label: '本周', data: hourlyArr, backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {beginAtZero: true, min: 0, max: 24}, x: {grid: {display: false}},
      },
    },
  })
}

// 自动执行函数
;(() => {
  initView()
  loadDataAndRender()
})()
