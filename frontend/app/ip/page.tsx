'use client'

import { useState, useEffect } from 'react'

interface IPInfo {
  ip: string
  version: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
}

export default function IPAddressPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchIPInfo = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/backend/ip')
      if (!response.ok) {
        throw new Error('Failed to fetch IP information')
      }
      const data = await response.json()
      setIpInfo(data)
    } catch (e) {
      setError('Error fetching IP info: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIPInfo()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">IP Address Information</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your IP Address</h2>

          {loading && (
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

          {ipInfo && !loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">IP Address</div>
                  <div className="text-2xl font-bold">{ipInfo.ip}</div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Version</div>
                  <div className="text-2xl font-bold">{ipInfo.version}</div>
                </div>
              </div>

              {ipInfo.country && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Country</div>
                    <div className="text-lg font-semibold">
                      {ipInfo.country} ({ipInfo.country_code})
                    </div>
                  </div>

                  {ipInfo.region && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Region</div>
                      <div className="text-lg font-semibold">{ipInfo.region}</div>
                    </div>
                  )}
                </div>
              )}

              {ipInfo.city && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">City</div>
                  <div className="text-lg font-semibold">{ipInfo.city}</div>
                </div>
              )}

              {ipInfo.latitude !== undefined && ipInfo.longitude !== undefined && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Coordinates</div>
                  <div className="text-lg font-semibold">
                    {ipInfo.latitude.toFixed(4)}, {ipInfo.longitude.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={fetchIPInfo}
            disabled={loading}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Endpoint</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded">
                GET /api/ip
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Response Example</h3>
              <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded overflow-x-auto text-sm">
{`{
  "ip": "192.168.1.100",
  "version": "IPv4",
  "country": "China",
  "country_code": "CN",
  "region": "Beijing",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Supports both IPv4 and IPv6</li>
                <li>Geolocation information (country, region, city)</li>
                <li>GPS coordinates</li>
                <li>Automatic detection of client IP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
