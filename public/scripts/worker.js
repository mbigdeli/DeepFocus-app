let endTime;

// The worker will receive messages from the main script
self.onmessage = function (e) {
  if (e.data.start) {
    // Calculate the target end time from the provided timeLeft
    endTime = Date.now() + e.data.timeLeft;
    countdown();
  }
};

// Function to handle countdown
function countdown() {
  const remainingTime = endTime - Date.now();

  // If the countdown is complete, inform the main script
  if (remainingTime <= 0) {
    self.postMessage({ done: true });
    return;
  }

  // Otherwise, keep updating the main script with remaining time
  self.postMessage({ timeLeft: remainingTime });

  // Call countdown again after 100ms to keep an accurate timer
  setTimeout(countdown, 100);
}
