document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
    };

    try {
      const response = await fetch('http://localhost:5000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Došlo k chybě při odesílání rezervace.');
    }
  });
});
