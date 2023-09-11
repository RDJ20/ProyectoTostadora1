document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
      
      localStorage.setItem('jwtToken', data.token);

     
      const decodedToken = jwt_decode(data.token);
      const userRole = decodedToken.role;

     
      if (userRole === 1 ) {
        window.location.href = './admin/admin.html';
      } else if (userRole === 2 ) {
        window.location.href = './user/user.html';
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

