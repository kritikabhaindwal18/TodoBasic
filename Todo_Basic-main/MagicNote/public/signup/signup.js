document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let userId = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  signup(userId, password);

  document.getElementById('signupForm').reset();
});

async function signup(userId, password) {
  const urlpost = 'http://3.7.73.252:8000/signup';
  const dataToSend = {
    userId: userId,
    password: password,
  };

  try {
    const response = await fetch(urlpost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    

  } catch (error) {
    console.log(error);
  }
}

let signupbtn = document.getElementById('signup-btn');
signupbtn.addEventListener('click', function() {
  document.getElementById('signupForm').submit();
});

