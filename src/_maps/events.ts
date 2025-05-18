export const eventMaps = [
  // Mouse Events
  'onClick',
  'onDoubleClick',
  'onMouseDown',
  'onMouseUp',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',

  // Keyboard Events
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',

  // Focus Events
  'onFocus',
  'onBlur',

  // Form Events
  'onChange',
  'onInput',
  'onSubmit',
  'onReset',
  'onInvalid',

  // Composition Events
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',

  // Drag Events
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',

  // Clipboard Events
  'onCopy',
  'onCut',
  'onPaste',

  // Touch Events
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',

  // Pointer Events
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerOver',
  'onPointerOut',

  // Media Events
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',

  // Image Events
  'onError',
  'onLoad',

  // Animation Events
  'onAnimationStart',
  'onAnimationEnd',
  'onAnimationIteration',

  // Transition Events
  'onTransitionEnd',

  // UI Events
  'onScroll',
  'onResize',

  // Miscellaneous
  'onContextMenu',
  'onFocusCapture',
  'onBlurCapture',
  'onChangeCapture',
  'onInputCapture',
  'onClickCapture',
  'onSubmitCapture',
] as const

export type EventMaps = (typeof eventMaps)[number]
