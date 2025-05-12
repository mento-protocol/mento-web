import { NextResponse } from 'next/server'

export const config = {}

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

export function middleware() {
  return NextResponse.next()
}
