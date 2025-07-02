document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/report')
    .then(response => response.json())
    .then(data => {
      if (!data.site || data.site.length === 0 || !data.site[0].alerts) {
        throw new Error('No site data or alerts in ZAP report.');
      }

      const alerts = data.site[0].alerts;

      const summary = document.getElementById('summary');
      summary.innerHTML = `
        <h2>Scan Summary</h2>
        <p><strong>Total Alerts:</strong> ${alerts.length}</p>
      `;

      // Prepare data for chart
      const riskCounts = {};
      alerts.forEach(alert => {
        const risk = alert.riskdesc.split(' ')[0]; // Get "High", "Medium", "Low", "Informational"
        riskCounts[risk] = (riskCounts[risk] || 0) + 1;
      });

      const riskLabels = Object.keys(riskCounts);
      const riskData = Object.values(riskCounts);
      const backgroundColors = [
        '#e74c3c', // High
        '#f39c12', // Medium
        '#2ecc71', // Low
        '#3498db'  // Informational
      ];

      const ctx = document.getElementById('riskChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: riskLabels,
          datasets: [{
            data: riskData,
            backgroundColor: backgroundColors,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Alerts by Risk Level'
            }
          }
        }
      });

      const alertsContainer = document.getElementById('alerts');
      alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        const riskClass = alert.riskdesc.split(' ')[0];
        alertDiv.className = `alert risk-${riskClass}`;
        alertDiv.innerHTML = `
          <h3>${alert.name}</h3>
          <p><strong>Risk:</strong> <span class="risk-${riskClass}">${alert.riskdesc}</span></p>
          <p><strong>Confidence:</strong> ${alert.confidence}</p>
          <p><strong>Description:</strong> ${alert.desc}</p>
          <p><strong>Solution:</strong> ${alert.solution}</p>
        `;
        alertsContainer.appendChild(alertDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching ZAP report:', error);
      const summary = document.getElementById('summary');
      summary.innerHTML = `<p>Could not load ZAP report. Make sure a scan has been run and the report has been generated.</p>`;
    });
});
