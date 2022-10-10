import { toBase64, toUtf8 } from '@cosmjs/encoding'

export const jsonToUtf8 = (json: Record<string, unknown>): Uint8Array =>
  toUtf8(JSON.stringify(json))

export const jsonToBinary = (json: Record<string, unknown>): string =>
  toBase64(jsonToUtf8(json))
