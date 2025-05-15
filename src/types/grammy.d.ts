import { Context } from 'grammy';
import { SessionFlavor } from 'grammy';

declare module 'grammy' {
  interface Context extends SessionFlavor<SessionData> {}
}
