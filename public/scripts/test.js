// // File: public/scripts/script.js
// // JavaScript to handle timer functionality, API calls, and data visualization
// let timer; // Timer variable to hold the countdown interval

// function loadUserRecords() {
//   const userName = document.getElementById('userName').value;
//   if (!userName) {
//     alert('Please enter your name.');
//     return;
//   }

//   // Update the header title with the user's name
//   document.getElementById('headerTitle').innerText = `Dear ${userName}, DeppFuckus More Today`;

//   // Show the rest of the form and enable fields
//   document.getElementById('userNameForm').style.display = 'none';
//   document.getElementById('tabs').style.display = 'block';
//   document.getElementById('today').style.display = 'block';
//   document.getElementById('roundName').disabled = false;
//   document.getElementById('minutes').disabled = false;
//   document.getElementById('seconds').disabled = false;
//   document.querySelector('.start-button').disabled = false;

//   loadTodayRecords(userName);
//   loadHistoryRecords(userName);
// }

// function startTimer() {
//   // Get user inputs from the form
//   const userName = document.getElementById('userName').value;
//   const roundName = document.getElementById('roundName').value;
//   let minutes = document.getElementById('minutes').value;
//   let seconds = document.getElementById('seconds').value;

//   console.log('Starting timer with:', { userName, roundName, minutes, seconds });

//   // Validate that required fields are filled
//   if (!userName || !roundName) {
//     alert('Please fill all fields correctly.');
//     return;
//   }

//   // Ensure at least one of minutes or seconds is set
//   if (minutes === '' && seconds === '') {
//     alert('The time cannot be empty. Please set either minutes or seconds.');
//     return;
//   }

//   function playRingtone() {
//     console.log('Playing ringtone');
//     const audio = new Audio('ringtone.mp3'); // Create a new audio object for the ringtone
//     audio.play(); // Play the audio
//   }

//   // Default empty minutes or seconds to 0
//   minutes = parseInt(minutes) || 0;
//   seconds = parseInt(seconds) || 0;

//   // Calculate total countdown time in seconds
//   const totalSeconds = minutes * 60 + seconds;
//   let remainingSeconds = totalSeconds;

//   // Disable start button and enable stop button
//   document.querySelector('.start-button').disabled = true;
//   document.querySelector('.stop-button').disabled = false;

//   // Update the timer display initially
//   updateTimerDisplay(remainingSeconds);

//   // Start the countdown timer
//   timer = setInterval(() => {
//     if (remainingSeconds <= 0) {
//       clearInterval(timer); // Clear the interval when timer reaches 0
//       playRingtone(); // Play ringtone
//       setTimeout(() => {
//         alert('Time is up!'); // Alert user that time is up
//         saveResult(userName, roundName, true, minutes, seconds); // Save result as successful
//         document.querySelector('.start-button').disabled = false; // Re-enable start button
//         document.querySelector('.stop-button').disabled = true; // Disable stop button
//       }, 1000);
//     } else {
//       console.log('Timer running, remaining seconds:', remainingSeconds);
//       remainingSeconds--; // Decrement the timer
//       updateTimerDisplay(remainingSeconds); // Update the timer display
//     }
//   }, 1000); // Set interval to 1 second
// }

// function stopTimer() {
//   clearInterval(timer); // Clear the countdown timer
//   console.log('Timer stopped by user');
//   document.querySelector('.start-button').disabled = false; // Re-enable start button
//   document.querySelector('.stop-button').disabled = true; // Disable stop button

//   // Get user inputs to save the failed result
//   const userName = document.getElementById('userName').value;
//   const roundName = document.getElementById('roundName').value;
//   const minutes = parseInt(document.getElementById('minutes').value) || 0;
//   const seconds = parseInt(document.getElementById('seconds').value) || 0;
//   saveResult(userName, roundName, false, minutes, seconds); // Save result as failed
// }

// function saveResult(userName, roundName, success, minutes, seconds) {
//   console.log('Saving result:', { userName, roundName, success, minutes, seconds });
//   // Send the countdown result to the backend via a POST request
//   fetch('/save', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ userName, roundName, success, minutes, seconds })
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Result saved response:', data);
//       loadTodayRecords(userName); // Reload today's records after saving
//     })
//     .catch(error => console.error('Error saving result:', error));
// }

// function loadTodayRecords(userName) {
//   console.log('Loading today's records for user:', userName);
//   // Fetch today's records for the user via a GET request
//   fetch(`/today/${userName}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log('Today's records loaded:', data);
//       const todayRecordsTable = document.getElementById('todayRecords');
//       todayRecordsTable.innerHTML = ''; // Clear existing records
//       data.forEach(record => {
//         // Create a table row for each record
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${record.roundName}</td>
//           <td>${record.success ? 'Yes' : 'No'}</td>
//           <td>${record.minutes}m ${record.seconds}s</td>
//         `;
//         todayRecordsTable.appendChild(row); // Append the row to the table
//       });
//     })
//     .catch(error => console.error('Error loading today's records:', error));
// }

// function updateTimerDisplay(seconds) {
//   // Calculate minutes and seconds from the total remaining seconds
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   // Update the timer display in MM:SS format
//   document.getElementById('timerDisplay').innerText = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // File: public/scripts/history.js
// function loadHistoryRecords(userName) {
//   console.log('Loading history records for user:', userName);
//   // Fetch history records for the user via a GET request
//   fetch(`/history/${userName}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log('History records loaded:', data);
//       const historyRecordsTable = document.getElementById('historyRecords');
//       historyRecordsTable.innerHTML = ''; // Clear existing records
//       data.forEach(record => {
//         // Create a table row for each record
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td><a href="#" onclick="loadDetails('${userName}', '${record.date}')">${record.date}</a></td>
//           <td>${record.successfulRounds}</td>
//           <td>${record.failedRounds}</td>
//           <td>${Math.floor(record.totalSpentTime / 60)}m ${record.totalSpentTime % 60}s</td>
//         `;
//         historyRecordsTable.appendChild(row); // Append the row to the table
//       });
//     })
//     .catch(error => console.error('Error loading history records:', error));
// }

// function loadDetails(userName, date) {
//   console.log(`Loading detailed records for user: ${userName} on date: ${date}`);
//   // Fetch detailed records for the specified date via a GET request
//   fetch(`/history/${userName}/${date}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log('Detailed records loaded:', data);
//       const detailsRecordsTable = document.getElementById('detailsRecords');
//       detailsRecordsTable.innerHTML = ''; // Clear existing records
//       data.forEach(record => {
//         // Create a table row for each detailed record
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${record.roundName}</td>
//           <td>${record.success ? 'Successful' : 'Fail'}</td>
//           <td>${record.minutes}m ${record.seconds}s</td>
//         `;
//         detailsRecordsTable.appendChild(row); // Append the row to the table
//       });
//       document.getElementById('popupDate').innerText = `Records for ${date}`;
//       document.getElementById('detailsPopup').style.display = 'flex';
//     })
//     .catch(error => console.error('Error loading detailed records:', error));
// }

// function closePopup() {
//   document.getElementById('detailsPopup').style.display = 'none';
// }

// window.onclick = function(event) {
//   const popup = document.getElementById('detailsPopup');
//   if (event.target === popup) {
//     popup.style.display = 'none';
//   }
// }
