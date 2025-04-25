import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {}

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return NextResponse.next()
}
