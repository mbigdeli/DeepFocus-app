let timer; // Timer variable to hold the countdown interval
let worker;

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

function playRingtone() {
  console.log('Playing ringtone');
  const audio = new Audio('ringtone.mp3'); // Create a new audio object for the ringtone
  audio.play(); // Play the audio
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

  // Disable start button
  document.querySelector('.start-button').disabled = true;
  document.querySelector('.stop-button').disabled = false;
  document.getElementById('roundName').disabled = true;
  document.getElementById('minutes').disabled = true;
  document.getElementById('seconds').disabled = true;

  // Calculate total time in milliseconds
  const totalTime = (minutes * 60 + seconds) * 1000;
  console.log("total time:",totalTime)
  // Start the worker
  startWorkerTimer(totalTime);
  console.log("worker started")
}

function startWorkerTimer(timeInMilliseconds) {
  const userName = document.getElementById('userName').value;
  const roundName = document.getElementById('roundName').value;
  // Check if the browser supports Web Workers
  if (typeof Worker !== "undefined") {
    // If a worker already exists, terminate it
    if (worker) {
      worker.terminate();
    }

    // Create a new Web Worker instance
    worker = new Worker('scripts/worker.js');

    // Send a message to the worker to start the countdown
    worker.postMessage({ start: true, timeLeft: timeInMilliseconds });
    const saveMin = Math.floor(timeInMilliseconds / 60000);
    const saveSec = Math.floor((timeInMilliseconds % 60000) / 1000);
    // Handle messages received from the worker
    worker.onmessage = function (e) {
      if (e.data.done) {
        // Timer is done, handle completion
        playRingtone();
        saveResult(userName, roundName, true, saveMin, saveSec);

        setTimeout(() => {
          alert('Time is up!');
          document.querySelector('.start-button').disabled = false;
          document.querySelector('.stop-button').disabled = true;
          document.getElementById('roundName').disabled = false;
          document.getElementById('minutes').disabled = false;
          document.getElementById('seconds').disabled = false;
        }, 1000);
      } else {
        // Update the remaining time on the UI
        const remainingSeconds = Math.floor(e.data.timeLeft / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        updateTimerDisplay(minutes, seconds);
      }
    };
  } else {
    document.getElementById('roundName').disabled = false;
    document.getElementById('minutes').disabled = false;
    document.getElementById('seconds').disabled = false;
    console.error("Web Workers are not supported in your browser.");
  }
}

function updateTimerDisplay(minutes, seconds) {
  document.getElementById('timerDisplay').innerText =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
  if (worker) {
    worker.terminate(); // Terminate the worker when stopping the timer
    worker = null;
  }

  document.querySelector('.start-button').disabled = false;
  document.querySelector('.stop-button').disabled = true;
  document.getElementById('roundName').disabled = false;
  document.getElementById('minutes').disabled = false;
  document.getElementById('seconds').disabled = false;

  const userName = document.getElementById('userName').value;
  const roundName = document.getElementById('roundName').value;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  saveResult(userName, roundName, false, minutes, seconds); // Save result as failed
  // Reset the timer display
  updateTimerDisplay(0, 0);
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

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded, waiting for user name input');
});