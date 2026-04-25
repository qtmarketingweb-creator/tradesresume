import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'TradesResume — AI Resume Builder for Tradespeople',
  description: 'Answer 10 questions, get a professional resume in 60 seconds. Built for plumbers, electricians, welders, HVAC techs, and more.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={inter.className}>{children}</body></html>)
}