
  // Variáveis do login
  const formLogin = document.getElementById("loginForm");
  const emailLogin = document.getElementById("loginEmail");
  const senhaLogin = document.getElementById("loginPassword");

  // Adiciona evento de submit ao formulário
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const urlLogin = "http://localhost:8080/login";

    const data = {
      email: emailLogin.value,
      password: senhaLogin.value
    };

    console.log("Dados enviados:", data);

    axios.post(urlLogin, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log("Resposta do servidor:", response.data);

      sessionStorage.setItem("token", response.data.token || response.data.access_token);

      if (response.data.userId) {
        sessionStorage.setItem("userId", response.data.userId);
      } else {
        console.warn("userId não encontrado na resposta.");
      }

      window.location.href = "index.html";
    })
    .catch(error => {
      console.error("Erro ao fazer login:", error);
      alert("Login inválido. Verifique seu e-mail e senha.");
    });
  });

