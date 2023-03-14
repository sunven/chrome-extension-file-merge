import './assets/css/popup.css'

const downloadByData = (data: string) => {
  const url = window.URL.createObjectURL(
    new Blob([data], {
      type: 'application/javascript; charset=utf-8',
    })
  )
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', Date.now() + '.js')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function downloadFun() {
  const textarea = document.querySelector<HTMLTextAreaElement>('#textarea')
  if (!textarea) {
    return
  }
  const textareaValue = textarea.value
  if (!textareaValue) {
    return
  }
  const urlArr = textareaValue
    .split('\n')
    .map(c => c.trim())
    .filter(c => c)
    .map(c => {
      if (c.startsWith('<script')) {
        const reg = /src=[\'\"](.*)[\'\"]/i
        const result = c.match(reg)
        if (result) {
          return result[1]
        } else {
          return c
        }
      } else {
        return c
      }
    })
    .filter(c => c)
  if (urlArr.length < 1) {
    return
  }
  console.log(urlArr)
  const promiseArr = urlArr.map(c => fetch(c).then(c => c.text()))
  Promise.all(promiseArr).then(values => {
    const data = values.reduce((pre, cur) => pre + cur + '\n', '')
    downloadByData(data.trimEnd())
  })
}

const downloadBtn = document.querySelector('#download')
if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadFun)
}
