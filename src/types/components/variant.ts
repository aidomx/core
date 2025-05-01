export type VariantColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'

export type VariantSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type VariantShape = 'default' | 'rounded' | 'pill' | 'circle' | 'square'

export type VariantStyle =
  | 'text'
  | 'contained'
  | 'outlined'
  | 'ghost'
  | 'link'
  | 'flat'
  | 'soft'

export type VariantElevation = 'none' | 'flat' | 'elevated' | 'raised' | 'deep'

export type ComponentVariant = {
  color?: VariantColor
  size?: VariantSize
  shape?: VariantShape
  style?: VariantStyle
  elevation?: VariantElevation
}
