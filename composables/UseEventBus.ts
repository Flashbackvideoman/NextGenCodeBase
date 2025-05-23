import mitt from 'mitt'
import type { LogoutEvent, AccountEvent } from './NextGenModel'

type logoutEvents = LogoutEvent
const logoutEmitter = mitt<LogoutEvent>()
export const useLogout = logoutEmitter.emit
export const useLogoutListen = logoutEmitter.on
export const endLogoutListen = logoutEmitter.off

type accountEvents = AccountEvent;
const accountEventsEmmitter = mitt<AccountEvent>()
export const useAccountEvent = accountEventsEmmitter.emit;
export const useAccountEventListen = accountEventsEmmitter.on
export const useAccountEventEmitterOff = accountEventsEmmitter.off
