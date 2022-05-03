import './style.scss'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Trybers!</h1>
`

const counter = app.querySelector('h1')!

const video = document.createElement('video')
video.autoplay = true
video.width = 640
app.appendChild(video)


const report = document.createElement('button')
report.textContent = 'Report'
app.appendChild(report)


const record = document.createElement('button')
record.textContent = 'Gravar'
record.disabled = true
app.appendChild(record)


report.onclick = () => {
  const media = navigator.mediaDevices.getDisplayMedia();
  media.then(stream => {
    video.srcObject = stream
    record.disabled = false
    report.disabled = true
    
    const blobs: Blob[] = []
    
    record.onclick = () => {
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (e) => blobs.push(e.data)
      recorder.onstop = () => console.table(blobs)
      
      recorder.start(1000)
      record.disabled = true
      
      const timer = setInterval(() => {
        counter.textContent = `${10 - blobs.length}s`
        if (blobs.length === 10) {
          clearInterval(timer)
        }

      })

      setTimeout(() => {
        recorder.stop()
        
        const a = document.createElement('a')
        a.href = URL.createObjectURL(new Blob(blobs))
        a.download = 'MinhaTela.webm'
        a.textContent = 'Download'
        a.click()
        URL.revokeObjectURL(a.href)
        report.disabled = false
        record.disabled = true
        a.remove()
      }, 10000)
    }
    
  })

}