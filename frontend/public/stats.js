// Firebase imports for authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGpGaJObquI1d6KuDGAkyLjGV-SjKO10Y",
  authDomain: "avrick1.firebaseapp.com",
  projectId: "avrick1",
  storageBucket: "avrick1.firebasestorage.app",
  messagingSenderId: "897272071390",
  appId: "1:897272071390:web:c2d403ea304c601e966e4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global variables
let currentUser = null;
let idToken = null;
let weeklyChart = null;
let monthlyChart = null;

// Logout function
window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout");
  }
};

// Fetch user's daily stats from backend
async function fetchDailyStats() {
  if (!idToken) return [];

  try {
    // Fetch from backend API
    const response = await fetch('/api/stats/daily', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });

    if (!response.ok) {
      // If no data exists, use mock data or empty array
      console.log("No stats data found, using mock data");
      return generateMockData(365);
    }

    const data = await response.json();
    return data.daily || [];
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    // Fallback to mock data for demonstration
    return generateMockData(365);
  }
}

// Generate mock data for demonstration
function generateMockData(days) {
  const data = [];
  for (let i = 0; i < days; i++) {
    // Random minutes between 0 and 240 (4 hours)
    const minutes = Math.random() > 0.3 ? Math.floor(Math.random() * 240) : 0;
    data.push(minutes);
  }
  return data;
}

// Create weekly bar chart
function createWeeklyChart(data) {
  const ctx = document.getElementById('weeklyChart');

  // Get last 7 days of data
  const last7Days = data.slice(-7);

  // Generate labels (day names)
  const today = new Date();
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  // Destroy existing chart if any
  if (weeklyChart) {
    weeklyChart.destroy();
  }

  // Create new chart
  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Minutes',
        data: last7Days,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(45, 55, 72, 0.95)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 12
            },
            color: '#718096'
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.5)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            },
            color: '#718096'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Create monthly line chart
function createMonthlyChart(data) {
  const ctx = document.getElementById('monthlyChart');

  // Get last 30 days of data
  const last30Days = data.slice(-30);

  // Generate labels (dates)
  const today = new Date();
  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  // Destroy existing chart if any
  if (monthlyChart) {
    monthlyChart.destroy();
  }

  // Create new chart
  monthlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Minutes',
        data: last30Days,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(45, 55, 72, 0.95)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 12
            },
            color: '#718096'
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.5)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 11
            },
            color: '#718096',
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Create 365-day heatmap (GitHub-style)
function createHeatmap(data) {
  const container = document.getElementById('heatmapContainer');

  // Clear loading message
  container.innerHTML = '';

  // Create grid
  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';

  // Calculate max value for color scaling
  const maxValue = Math.max(...data);

  // Get color level based on value
  function getLevel(value) {
    if (value === 0) return 0;
    const percentage = value / maxValue;
    if (percentage < 0.25) return 1;
    if (percentage < 0.5) return 2;
    if (percentage < 0.75) return 3;
    return 4;
  }

  // Create cells for each day
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';

    const dataIndex = data.length - 365 + (364 - i);
    const value = dataIndex >= 0 ? data[dataIndex] : 0;
    const level = getLevel(value);

    cell.classList.add(`level-${level}`);
    cell.setAttribute('data-date', date.toLocaleDateString());
    cell.setAttribute('data-value', value);

    // Tooltip on hover
    cell.addEventListener('mouseenter', (e) => {
      showTooltip(e, date, value);
    });

    cell.addEventListener('mouseleave', hideTooltip);

    grid.appendChild(cell);
  }

  container.appendChild(grid);
}

// Show tooltip for heatmap cell
function showTooltip(event, date, value) {
  let tooltip = document.querySelector('.heatmap-tooltip');

  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    document.body.appendChild(tooltip);
  }

  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  tooltip.textContent = `${dateStr}: ${value} minutes`;

  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top - 40}px`;
  tooltip.style.transform = 'translateX(-50%)';

  tooltip.classList.add('show');
}

// Hide tooltip
function hideTooltip() {
  const tooltip = document.querySelector('.heatmap-tooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
  }
}

// Calculate and display summary stats
function updateSummaryStats(data) {
  // Today's minutes (last element in array)
  const todayMinutes = data[data.length - 1] || 0;
  document.getElementById('todayMinutes').textContent = todayMinutes;

  // This week total
  const weekData = data.slice(-7);
  const weekTotal = weekData.reduce((sum, val) => sum + val, 0);
  document.getElementById('weekTotal').textContent = `${weekTotal} min`;

  // Calculate streak (consecutive days with > 0 minutes)
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] > 0) {
      streak++;
    } else {
      break;
    }
  }
  document.getElementById('streakCount').textContent = streak;

  // Total hours (sum of all data / 60)
  const totalMinutes = data.reduce((sum, val) => sum + val, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  document.getElementById('totalHours').textContent = `${totalHours}h`;
}

// Main initialization function
async function initializeStats() {
  // Fetch user's daily stats
  const dailyData = await fetchDailyStats();

  // Update summary cards
  updateSummaryStats(dailyData);

  // Create visualizations
  createWeeklyChart(dailyData);
  createMonthlyChart(dailyData);
  createHeatmap(dailyData);
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    idToken = await user.getIdToken();

    // Initialize stats page
    initializeStats();

    console.log("User authenticated:", user.email);
  } else {
    // No user logged in, redirect to login page
    window.location.href = "/login.html";
  }
});
