'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import '../admin.css'

interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        color: string
    }[]
}

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'settings'>('analytics')
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [loading, setLoading] = useState(true)

    // Mock Settings State
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistrations: true,
        emailNotifications: true
    })

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics')
                const data = await res.json()
                if (data.labels) {
                    setChartData(data)
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error)
            } finally {
                setLoading(false)
            }
        }

        if (activeTab === 'analytics') {
            fetchAnalytics()
        }
    }, [activeTab])

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const getMaxDataValue = () => {
        if (!chartData) return 0
        const allValues = chartData.datasets.flatMap(d => d.data)
        return Math.max(...allValues, 5) // Minimum max of 5 for scale
    }

    return (
        <div className="admin-page">
            <div className="dashboard-header">
                <h1 className="dashboard-title serif">Platform Settings</h1>
                <p className="dashboard-subtitle">Analytics and system configuration</p>
            </div>

            <div className="settings-tabs">
                <button
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    General Settings
                </button>
            </div>

            <div className="settings-content">
                {activeTab === 'analytics' && (
                    <div className="analytics-panel fade-in">
                        <h3 className="panel-title">Growth Overview (Last 7 Days)</h3>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading analytics...</div>
                        ) : chartData ? (
                            <div className="chart-container">
                                <div className="chart-legend">
                                    {chartData.datasets.map(ds => (
                                        <div key={ds.label} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: ds.color }}></span>
                                            {ds.label}
                                        </div>
                                    ))}
                                </div>

                                <div className="bar-chart">
                                    {chartData.labels.map((label, index) => (
                                        <div key={label} className="chart-column">
                                            <div className="bars-group">
                                                {chartData.datasets.map(ds => {
                                                    const max = getMaxDataValue()
                                                    const height = (ds.data[index] / max) * 100
                                                    return (
                                                        <div
                                                            key={ds.label}
                                                            className="bar"
                                                            style={{
                                                                height: `${height}%`,
                                                                backgroundColor: ds.color
                                                            }}
                                                            title={`${ds.label}: ${ds.data[index]}`}
                                                        >
                                                            <span className="bar-tooltip">{ds.data[index]}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="x-label">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">No data available</div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-panel fade-in">
                        <div className="setting-group">
                            <div className="setting-info">
                                <h4>Maintenance Mode</h4>
                                <p>Temporarily disable access to the platform for all non-admin users.</p>
                            </div>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="maintenance"
                                    checked={settings.maintenanceMode}
                                    onChange={() => toggleSetting('maintenanceMode')}
                                />
                                <label htmlFor="maintenance"></label>
                            </div>
                        </div>

                        <div className="setting-group">
                            <div className="setting-info">
                                <h4>Allow New Registrations</h4>
                                <p>Enable or disable new user signups.</p>
                            </div>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="registrations"
                                    checked={settings.allowRegistrations}
                                    onChange={() => toggleSetting('allowRegistrations')}
                                />
                                <label htmlFor="registrations"></label>
                            </div>
                        </div>

                        <div className="setting-group">
                            <div className="setting-info">
                                <h4>Email Notifications</h4>
                                <p>Send system-wide email notifications for new matches.</p>
                            </div>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="emails"
                                    checked={settings.emailNotifications}
                                    onChange={() => toggleSetting('emailNotifications')}
                                />
                                <label htmlFor="emails"></label>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <Button onClick={() => alert('Settings saved (Simulation)')}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
