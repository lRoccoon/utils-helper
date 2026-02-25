'use client'

import { useState, useEffect } from 'react'

interface HolidayInfo {
  date: string
  is_holiday: boolean
  is_workday: boolean
  name?: string
  type?: string
}

export default function HolidayPage() {
  const [todayInfo, setTodayInfo] = useState<HolidayInfo | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedInfo, setSelectedInfo] = useState<HolidayInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTodayInfo = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/backend/holiday')
      if (!response.ok) {
        throw new Error('Failed to fetch holiday information')
      }
      const data = await response.json()
      setTodayInfo(data)
    } catch (e) {
      setError('Error fetching holiday info: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDateInfo = async () => {
    if (!selectedDate) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/backend/holiday/${selectedDate}`)
      if (!response.ok) {
        throw new Error('Failed to fetch holiday information')
      }
      const data = await response.json()
      setSelectedInfo(data)
    } catch (e) {
      setError('Error fetching holiday info: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayInfo()
  }, [])

  const getStatusBadge = (info: HolidayInfo) => {
    if (info.is_holiday) {
      return (
        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
          Holiday
        </span>
      )
    } else if (info.is_workday) {
      return (
        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
          Workday
        </span>
      )
    } else {
      return (
        <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm">
          Weekend
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chinese Legal Holiday Query</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Status</h2>

          {loading && !todayInfo && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {todayInfo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                  <div className="text-2xl font-bold">{todayInfo.date}</div>
                </div>
                <div>{getStatusBadge(todayInfo)}</div>
              </div>

              {todayInfo.name && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Holiday Name</div>
                  <div className="text-xl font-semibold">{todayInfo.name}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Query Specific Date</h2>

          <div className="flex gap-4 mb-4">
            <input
              type="date"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              onClick={fetchDateInfo}
              disabled={!selectedDate || loading}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              Query
            </button>
          </div>

          {selectedInfo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                  <div className="text-2xl font-bold">{selectedInfo.date}</div>
                </div>
                <div>{getStatusBadge(selectedInfo)}</div>
              </div>

              {selectedInfo.name && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Holiday Name</div>
                  <div className="text-xl font-semibold">{selectedInfo.name}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Endpoints</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded mb-2">
                GET /api/holiday
              </code>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded">
                GET /api/holiday/:date
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Response Example</h3>
              <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded overflow-x-auto text-sm">
{`{
  "date": "2026-02-23",
  "is_holiday": true,
  "is_workday": false,
  "name": "春节",
  "type": "holiday"
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Query current date or specific date</li>
                <li>Check if it&apos;s a legal holiday</li>
                <li>Check if it&apos;s a compensatory workday</li>
                <li>Chinese holiday data for 2024-2026</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
