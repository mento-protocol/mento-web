import { NextResponse } from 'next/server'

export const config = {}

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export function middleware() {
  return NextResponse.next()
}
