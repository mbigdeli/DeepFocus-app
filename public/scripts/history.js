// File: public/scripts/history.js
function loadHistoryRecords(userName) {
    console.log('Loading history records for user:', userName);
    // Fetch history records for the user via a GET request
    fetch(`/history/${userName}`)
      .then(response => response.json())
      .then(data => {
        console.log('History records loaded:', data);
        const historyRecordsTable = document.getElementById('historyRecords');
        historyRecordsTable.innerHTML = ''; // Clear existing records
        data.forEach(record => {
          // Create a table row for each record
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><a href="#" onclick="loadDetails('${userName}', '${record.date}')">${record.date}</a></td>
            <td>${record.successfulRounds}</td>
            <td>${record.failedRounds}</td>
            <td>${Math.floor(record.totalSpentTime / 60)}m ${record.totalSpentTime % 60}s</td>
          `;
          historyRecordsTable.appendChild(row); // Append the row to the table
        });
      })
      .catch(error => console.error('Error loading history records:', error));
  }
  
  function loadDetails(userName, date) {
    console.log(`Loading detailed records for user: ${userName} on date: ${date}`);
    // Fetch detailed records for the specified date via a GET request
    fetch(`/history/${userName}/${date}`)
      .then(response => response.json())
      .then(data => {
        console.log('Detailed records loaded:', data);
        const detailsRecordsTable = document.getElementById('detailsRecords');
        detailsRecordsTable.innerHTML = ''; // Clear existing records
        data.forEach(record => {
          // Create a table row for each detailed record
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${record.roundName}</td>
            <td>${record.success ? 'Successful' : 'Fail'}</td>
            <td>${record.minutes}m ${record.seconds}s</td>
          `;
          detailsRecordsTable.appendChild(row); // Append the row to the table
        });
        document.getElementById('popupDate').innerText = `Records for ${date}`;
        document.getElementById('detailsPopup').style.display = 'flex';
      })
      .catch(error => console.error('Error loading detailed records:', error));
  }
  
  function closePopup() {
    document.getElementById('detailsPopup').style.display = 'none';
  }
  
  window.onclick = function(event) {
    const popup = document.getElementById('detailsPopup');
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  }
  