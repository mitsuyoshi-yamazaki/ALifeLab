// export function random(max: number): number	// not working: raises "Expected 1 arguments, but got 2."
export function random(max: number, min?: number): number {
  if (min == undefined) {
    return Math.random() * max
  }
  const range = max - min

  return Math.random() * range + min
}

export function isFullScreen(): boolean {
  return document.fullscreenElement != undefined
    || document.webkitFullscreenElement != undefined
    || document.mozFullScreenElement != undefined
    || document.msFullscreenElement != undefined
}

export function toggleFullscreen(elementId: string): void {
  if (isFullScreen()) {
    if (document.exitFullscreen != undefined) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen != undefined) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen != undefined) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen != undefined) {
      document.msExitFullscreen()
    }
  } else {
    const canvas = document.getElementById(elementId)
    if (canvas?.requestFullscreen !== undefined) {
      canvas.requestFullscreen()
    } else if (canvas?.mozRequestFullScreen !== undefined) {
      canvas.mozRequestFullScreen()
    } else if (canvas?.webkitRequestFullscreen !== undefined) {
      canvas.webkitRequestFullscreen() // (Element.ALLOW_KEYBOARD_INPUT)
    } else if (canvas?.msRequestFullscreen !== undefined) {
      canvas.msRequestFullscreen()
    }
  }
}
