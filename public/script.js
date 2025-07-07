document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestForm');
  const messagesDiv = document.getElementById('messages');

  fetch('/api/messages')
    .then(res => res.json())
    .then(messages => {
      messages.forEach(showMessage);
    });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !message) return;

    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    })
    .then(res => res.json())
    .then(newMessage => {
      showMessage(newMessage);
      form.reset();
    })
    .catch(err => console.error('Error:', err));
  });

  function showMessage({ name, message, date }) {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${name}</strong> <em>${new Date(date).toLocaleString()}</em><p>${message}</p>`;
    messagesDiv.prepend(div);
  }
});
