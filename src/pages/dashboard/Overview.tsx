import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Overview.css';

const Overview = () => {
    const barChartRef = useRef(null);
    const lineChart1Ref = useRef(null);
    const lineChart2Ref = useRef(null);

    useEffect(() => {
        const destroyAndCreateChart = (ref: any, config: any) => {
            if (!ref?.current) return;
            if (ref.current.chartInstance) {
                ref.current.chartInstance.destroy();
            }
            ref.current.chartInstance = new Chart(ref.current, config);
        };

        destroyAndCreateChart(barChartRef, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Visits',
                    data: [95, 130, 160, 120, 140, 180, 200],
                    backgroundColor: '#4caf50',
                    borderRadius: 5,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 50 } } },
            }
        });

        destroyAndCreateChart(lineChart1Ref, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Cash Payments',
                    data: [4000, 5200, 4800, 5300],
                    borderColor: '#2196f3',
                    tension: 0.4,
                    fill: false,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
            }
        });

        destroyAndCreateChart(lineChart2Ref, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Insurance Revenue',
                    data: [15000, 17000, 19000, 18500],
                    borderColor: '#ff9800',
                    tension: 0.4,
                    fill: false,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
            }
        });
    }, []);

    const cards = [
        { title: 'Patients', value: '1,204', icon: 'monitor_heart', trend: '+12%', trendClass: 'text-success', footer: 'since last week' },
        { title: 'Doctors', value: '128', icon: 'medical_services', trend: '+5%', trendClass: 'text-success', footer: 'added this month' },
        { title: 'Insurance', value: '892 Claims', icon: 'health_and_safety', trend: '+8%', trendClass: 'text-success', footer: 'processed recently' },
        { title: 'Departments', value: '14', icon: 'apartment', trend: '0%', trendClass: 'text-warning', footer: 'no change' },
    ];

    return (
        <div className="dashboard-wrapper">
            <div className="overview-container">
                <h3 className="overview-title">Dashboard</h3>
                <p className="overview-subtitle">
                    View patient stats, staff counts, insurance claims, and department details.
                </p>

                <div className="overview-cards-row">
                    {cards.map((card, index) => (
                        <div className="overview-card" key={index}>
                            <div className="card-header">
                                <div>
                                    <p className="card-title">{card.title}</p>
                                    <h4 className="card-value">{card.value}</h4>
                                </div>
                                <span className="material-symbols-rounded card-icon">{card.icon}</span>
                            </div>
                            <hr className="card-divider" />
                            <div className="card-footer">
                                <p className="card-footer-text">
                                    <span className={card.trendClass}>{card.trend}</span> {card.footer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="charts-row">
                    {/* Chart 1: Hospital Visits */}
                    <div className="chart-card">
                        <div className="card-body">
                            <h6 className="chart-title">Hospital Visits</h6>
                            <p className="chart-subtitle">Weekly Patient Turnout</p>
                            <div className="chart-container">
                                <canvas ref={barChartRef} className="chart-canvas" height="170" />
                            </div>
                            <hr className="chart-divider" />
                            <div className="chart-footer">
                                <span className="material-symbols-rounded text-sm me-1">schedule</span>
                                <p className="chart-footer-text">Updated 2 days ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart 2: Cash Payments */}
                    <div className="chart-card">
                        <div className="card-body">
                            <h6 className="chart-title">Cash Payments</h6>
                            <p className="chart-subtitle">Monthly Cash Flow Summary</p>
                            <div className="chart-container">
                                <canvas ref={lineChart1Ref} className="chart-canvas" height="170" />
                            </div>
                            <hr className="chart-divider" />
                            <div className="chart-footer">
                                <span className="material-symbols-rounded text-sm me-1">payments</span>
                                <p className="chart-footer-text">Updated 1 day ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart 3: Insurance Revenue */}
                    <div className="chart-card">
                        <div className="card-body">
                            <h6 className="chart-title">Insurance Revenue</h6>
                            <p className="chart-subtitle">Quarterly Insurance Payouts</p>
                            <div className="chart-container">
                                <canvas ref={lineChart2Ref} className="chart-canvas" height="170" />
                            </div>
                            <hr className="chart-divider" />
                            <div className="chart-footer">
                                <span className="material-symbols-rounded text-sm me-1">analytics</span>
                                <p className="chart-footer-text">Refreshed this week</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Summary and System Overview Row */}
                <div className="summary-system-row">
                    {/* Summary Table */}
                    <div className="summary-table-wrapper">
                        <h6 className="summary-table-title">Summary</h6>
                        <div className="summary-table-scroll">
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Members</th>
                                        <th>Patients</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="dept-icon material-symbols-rounded">favorite</span>Cardiology</td>
                                        <td className="member-images">
                                            <img src="/avatars/doc1.png" alt="M1" />
                                            <img src="/avatars/doc2.png" alt="M2" />
                                            <img src="/avatars/doc3.png" alt="M3" />
                                        </td>
                                        <td>240</td>
                                        <td>$12,000</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dept-icon material-symbols-rounded">psychology</span>Neurology</td>
                                        <td className="member-images">
                                            <img src="/avatars/doc4.png" alt="M4" />
                                            <img src="/avatars/doc5.png" alt="M5" />
                                        </td>
                                        <td>185</td>
                                        <td>$9,500</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dept-icon material-symbols-rounded">child_care</span>Pediatrics</td>
                                        <td className="member-images">
                                            <img src="/avatars/doc6.png" alt="M6" />
                                            <img src="/avatars/doc7.png" alt="M7" />
                                            <img src="/avatars/doc8.png" alt="M8" />
                                            <img src="/avatars/doc9.png" alt="M9" />
                                        </td>
                                        <td>310</td>
                                        <td>$14,200</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Overview Card */}
                    <div className="system-card">
                        <div className="card-body">
                            <h6 className="chart-title">System Overview</h6>
                            <p className="chart-subtitle">Recent Activity</p>

                            <div className="system-item">
                                <span className="material-symbols-rounded system-icon">monitor_heart</span>
                                <div className="system-details">
                                    <p className="system-label">Patient Added</p>
                                    <p className="system-change text-success">Just now</p>
                                </div>
                            </div>

                            <div className="system-item">
                                <span className="material-symbols-rounded system-icon">medical_services</span>
                                <div className="system-details">
                                    <p className="system-label">Doctor Assigned</p>
                                    <p className="system-change text-success">5 mins ago</p>
                                </div>
                            </div>

                            <div className="system-item">
                                <span className="material-symbols-rounded system-icon">health_and_safety</span>
                                <div className="system-details">
                                    <p className="system-label">Insurance Updated</p>
                                    <p className="system-change text-success">Today</p>
                                </div>
                            </div>

                            <div className="system-item">
                                <span className="material-symbols-rounded system-icon">apartment</span>
                                <div className="system-details">
                                    <p className="system-label">New Department Added</p>
                                    <p className="system-change text-warning">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    );
};

export default Overview;
