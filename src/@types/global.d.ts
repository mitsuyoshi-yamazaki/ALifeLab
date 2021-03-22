declare interface Document {
  msFullscreenElement: Element | null
  mozFullScreenElement: Element | null
  webkitFullscreenElement: Element | null

  mozCancelFullScreen(): void
  webkitExitFullscreen(): void
  msExitFullscreen(): void
}

declare interface HTMLElement {
  mozRequestFullScreen(): void
  webkitRequestFullscreen(): void
  msRequestFullscreen(): void
}
