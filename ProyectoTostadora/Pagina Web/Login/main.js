document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Detecta si estás en la Raspberry Pi o en un entorno local
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Define la URL base según el entorno
  const baseUrl = isLocal ? 'http://raspberrypi.local:3000' : 'http://raspberrypi.local:3000';

  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem('jwtToken', data.token);

      const decodedToken = jwt_decode(data.token);
      const userRole = decodedToken.role;

      if (userRole === 1) {
        window.location.href = `${baseUrl}/admin/admin.html`;
      } else if (userRole === 2) {
        window.location.href = `${baseUrl}/user/user.html`;
      } else {
        throw new Error('Rol de usuario desconocido');
      }

      alert('Inicio de sesión exitoso');
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
});
