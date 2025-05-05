document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault(); 

  const user = {
    fullName: document.getElementById("fullName").value,
    username: document.getElementById("username").value,
    email: document.getElementById("registerEmail").value,
    password: document.getElementById("registerPassword").value,
    birthday: document.getElementById("birthday").value
  };

  console.log("Cadastro:", user);

  cadastrar(
    user.fullName,
    user.username,
    user.email,
    user.birthday,
    user.password
  );
});

function cadastrar(nomeCompleto, apelido, email, dataNascimento, senha) {
  fetch("http://localhost:8080/user/cadastrar", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      fullName: nomeCompleto,
      email: email,
      username: apelido,
      password: senha,
      birthday: dataNascimento
    })
  })
  .then(function (res) {
    console.log("Resposta da API:", res);
    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      // Mostrar a aba de login após cadastro
      document.getElementById('login').classList.add('show', 'active');
      document.getElementById('register').classList.remove('show', 'active');
    } else if (res.status === 400) {
      res.json().then(data => {
        console.error("Detalhes do erro 400:", data);
      });
      alert('Erro de validação: verifique os campos e tente novamente.');
    } else {
      console.error("Erro inesperado:", res.status);
      alert('Erro no cadastro. Tente novamente mais tarde.');
    }
  })
  .catch(function (error) {
    console.error('Erro na requisição:', error);
    alert('Erro na conexão com o servidor.');
  });
}
