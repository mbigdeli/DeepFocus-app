let timer; // Timer variable to hold the countdown interval

function loadUserRecords() {
  const userName = document.getElementById('userName').value;
  if (!userName) {
    alert('Please enter your name.');
    return;
  }

  // Update the header title with the user's name
  document.getElementById('headerTitle').innerText = `Dear ${userName}, DeppFuckus More Today`;

  // Show the rest of the form and enable fields
  document.getElementById('userNameForm').style.display = 'none';
  document.getElementById('tabs').style.display = 'block';
  document.getElementById('today').style.display = 'block';
  document.getElementById('roundName').disabled = false;
  document.getElementById('minutes').disabled = false;
  document.getElementById('seconds').disabled = false;
  document.querySelector('.start-button').disabled = false;

  loadTodayRecords(userName);
  loadHistoryRecords(userName);
}


function showTab(tabName) {
  console.log('Switching to tab:', tabName);
  // Hide all tab contents
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');

  // Show the selected tab content
  document.getElementById(tabName).style.display = 'block';
}

function startTimer() {
  const userName = document.getElementById('userName').value;
  const roundName = document.getElementById('roundName').value;
  let minutes = parseInt(document.getElementById('minutes').value) || 0;
  let seconds = parseInt(document.getElementById('seconds').value) || 0;

  if (!userName || !roundName) {
    alert('Please fill all fields correctly.');
    return;
  }

  if (minutes === 0 && seconds === 0) {
    alert('The time cannot be empty. Please set either minutes or seconds.');
    return;
  }

  function playRingtone() {
    console.log('Playing ringtone');
    const audio = new Audio('ringtone.mp3'); // Create a new audio object for the ringtone
    audio.play(); // Play the audio
  }

  // Disable start button
  document.querySelector('.start-button').disabled = true;
  document.querySelector('.stop-button').disabled = false;

  // Calculate total time in milliseconds
  const totalTime = (minutes * 60 + seconds) * 1000;
  console.log("total time:",totalTime)
  endTime = Date.now() + totalTime;
  console.log("end time:",endTime)

  function updateTimer() {
    const remainingTime = endTime - Date.now();


    if (remainingTime <= 0) {
      // Timer is done
      clearTimeout(timer);
      playRingtone();
      setTimeout(() => {
        alert('Time is up!');
        saveResult(userName, roundName, true, minutes, seconds);
        document.querySelector('.start-button').disabled = false;
        document.querySelector('.stop-button').disabled = true;
      }, 1000);
      return;
    }

    // Calculate minutes and seconds
    const remainingSeconds = remainingTime / 1000;
    const displayMinutes = Math.floor(remainingSeconds / 60);
    const displaySeconds = Math.floor(remainingSeconds % 60);
    updateTimerDisplay(displayMinutes, displaySeconds);

    // Schedule the next update
    timer = setTimeout(updateTimer, 1000);
  }

  // Start updating the timer
  updateTimer();
}






function updateTimerDisplay(minutes, seconds) {
  document.getElementById('timerDisplay').innerText =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


function stopTimer() {
  clearInterval(timer); // Clear the countdown timer
  console.log('Timer stopped by user');
  document.querySelector('.start-button').disabled = false; // Re-enable start button
  document.querySelector('.stop-button').disabled = true; // Disable stop button

  // Get user inputs to save the failed result
  const userName = document.getElementById('userName').value;
  const roundName = document.getElementById('roundName').value;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  saveResult(userName, roundName, false, minutes, seconds); // Save result as failed
}

function saveResult(userName, roundName, success, minutes, seconds) {
  console.log('Saving result:', { userName, roundName, success, minutes, seconds });
  // Send the countdown result to the backend via a POST request
  fetch('/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName, roundName, success, minutes, seconds })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Result saved response:', data);
      loadTodayRecords(userName); // Reload today's records after saving
    })
    .catch(error => console.error('Error saving result:', error));
}

function loadTodayRecords(userName) {
  console.log('Loading toda\'s records for user:', userName);
  // Fetch today's records for the user via a GET request
  fetch(`/today/${userName}`)
    .then(response => response.json())
    .then(data => {
      console.log('Today\'s records loaded:', data);
      const todayRecordsTable = document.getElementById('todayRecords');
      todayRecordsTable.innerHTML = ''; // Clear existing records
      data.forEach(record => {
        // Create a table row for each record
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.roundName}</td>
          <td>${record.success ? 'Yes' : 'No'}</td>
          <td>${record.minutes}m ${record.seconds}s</td>
        `;
        todayRecordsTable.appendChild(row); // Append the row to the table
      });
    })
    .catch(error => console.error('Error loading today\'s records:', error));
}

// function updateTimerDisplay(seconds) {
//   // Calculate minutes and seconds from the total remaining seconds
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   // Update the timer display in MM:SS format
//   document.getElementById('timerDisplay').innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded, waiting for user name input');
});