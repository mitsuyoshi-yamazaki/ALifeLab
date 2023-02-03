export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> }

// export function random(max: number): number	// not working: raises "Expected 1 arguments, but got 2."
export function random(max: number, min?: number): number {
  if (min == null) {
    return Math.random() * max
  }
  const range = max - min

  return Math.random() * range + min
}

export function isFullScreen(): boolean {
  return document.fullscreenElement != null
    || document.webkitFullscreenElement != null
    || document.mozFullScreenElement != null
    || document.msFullscreenElement != null
}

export function toggleFullscreen(elementId: string): void {
  if (isFullScreen()) {
    if (document.exitFullscreen != null) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen != null) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen != null) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen != null) {
      document.msExitFullscreen()
    }
  } else {
    const canvas = document.getElementById(elementId)
    if (canvas?.requestFullscreen != null) {
      canvas.requestFullscreen()
    } else if (canvas?.mozRequestFullScreen != null) {
      canvas.mozRequestFullScreen()
    } else if (canvas?.webkitRequestFullscreen != null) {
      canvas.webkitRequestFullscreen() // (Element.ALLOW_KEYBOARD_INPUT)
    } else if (canvas?.msRequestFullscreen != null) {
      canvas.msRequestFullscreen()
    }
  }
}

export const strictEntries = <Key extends string, Value>(object: {[K in Key]: Value}): [Key, Value][] => {
  return Object.entries(object) as [Key, Value][]
}
