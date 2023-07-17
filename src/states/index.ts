import * as states from './states'

export type StateType = keyof typeof states
export type StateValue = typeof states[keyof typeof states]
export * as states from './states'
