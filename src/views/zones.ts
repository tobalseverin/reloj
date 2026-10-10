import { formatHMS } from '../time'
import { placeholderView } from './view'

export const createZonesView = () =>
  placeholderView('zones', 'Zonas', 'Comparador de zonas horarias', formatHMS)
