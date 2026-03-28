let deferredPrompt

window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault()
  deferredPrompt=e

  const btn=document.createElement("button")
  btn.innerText="Install"
  btn.style.position="fixed"
  btn.style.bottom="20px"
  btn.style.right="20px"
  btn.style.padding="10px"
  btn.style.background="#2c8cff"
  btn.style.color="white"
  btn.style.borderRadius="10px"

  document.body.appendChild(btn)

  btn.onclick=()=>deferredPrompt.prompt()
})