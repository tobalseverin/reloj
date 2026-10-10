import { formatHMS } from '../time'
import { placeholderView } from './view'

export const createDigitalView = () =>
  placeholderView('digital', 'Digital', 'HH:MM:SS.mmm', formatHMS)
