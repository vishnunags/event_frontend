document.addEventListener('DOMContentLoaded', () => {
    const eventsList = document.getElementById('events-list');
    const registerModal = document.getElementById('register-modal');
    const closeModalButton = document.getElementById('close-register-modal');
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const eventNameInput = document.getElementById('event-name');
    const nameInput = document.getElementById('name');
    const contactInput = document.getElementById('contact');
    const emailInput = document.getElementById('email');

    // Function to fetch and display events
    async function fetchEvents() {
        try {
            const response = await fetch('http://http://ec2-34-205-29-69.compute-1.amazonaws.com:3002/api/events'); // Adjust URL if necessary
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const events = await response.json();
            eventsList.innerHTML = ''; // Clear existing content
            events.forEach(event => {
                const listItem = document.createElement('li');
                listItem.textContent = `${event.name} - ${event.date} - ${event.location}`;
                
                // Create and append a register button for each event
                const button = document.createElement('button');
                button.textContent = 'Register';
                button.addEventListener('click', () => openRegisterModal(event.name));
                listItem.appendChild(button);

                eventsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching events:', error);
            eventsList.innerHTML = 'Failed to load events. Please try again later.';
        }
    }

    // Function to open the registration modal
    function openRegisterModal(eventName) {
        registerModal.style.display = 'block';
        eventNameInput.value = eventName;
        registerButton.onclick = () => handleRegistration(eventName);
    }

    // Function to handle registration form submission
    async function handleRegistration(eventName) {
        const name = nameInput.value;
        const contact = contactInput.value;
        const email = emailInput.value;

        try {
            const response = await fetch('http://http://ec2-34-205-29-69.compute-1.amazonaws.com:3002/api/register', { // Adjust URL if necessary
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventName: eventName,
                    name: name,
                    contact: contact,
                    email: email
                })
            });

            if (response.ok) {
                alert('Registration successful!');
                registerForm.reset();
                registerModal.style.display = 'none';
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error registering for event ', error);
            alert('Failed to register for event. Please try again.');
        }
    }

    // Hide modal when "close" button is clicked
    closeModalButton.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    // Hide modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Fetch events on page load
    fetchEvents();
});
