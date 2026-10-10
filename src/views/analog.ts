import { formatHMS, localZone } from '../time'
import { placeholderView } from './view'

export const createAnalogView = () =>
  placeholderView('analog', 'Analógico', `Reloj redondo · ${localZone}`, formatHMS)
