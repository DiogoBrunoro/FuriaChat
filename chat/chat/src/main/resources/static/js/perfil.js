function getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    console.log(`ID do usuário na URL: ${userId}`);
    return userId;
  }
  
  async function fetchUserData() {
    const userId = getUserIdFromURL();
    const sessionId = sessionStorage.getItem("userId");
    console.log(`ID do usuário da sessão: ${sessionId}`);
  
    if (!userId) {
      console.log("ID do usuário não encontrado na URL.");
      alert("ID do usuário não encontrado na URL.");
      return;
    }
  
    try {
      console.log(`Buscando dados para o usuário com ID: ${userId}`);
      const response = await fetch(`/user/buscarPorId/${userId}`);
  
      if (!response.ok) {
        console.log(`Erro na resposta: ${response.status}`);
        throw new Error("Erro ao buscar usuário.");
      }
  
      const text = await response.text();
      console.log("Resposta recebida:", text);
  
      if (!text) {
        console.log("Resposta vazia recebida.");
        throw new Error("Resposta vazia recebida.");
      }
  
      try {
        console.log("Tentando analisar o JSON da resposta...");
        const data = JSON.parse(text);
        console.log(data);
  
        const username = data.username || "Usuário";
        console.log(`Nome de usuário: ${username}`);
        document.getElementById("username-title").textContent = `Perfil de ${username}`;
        document.getElementById("username").textContent = username;
  
        const fotoContainer = document.getElementById("fotoContainer");
        fotoContainer.innerHTML = "";
  
        if (data.foto) {
          console.log("Foto encontrada, exibindo imagem...");
          const img = document.createElement("img");
          img.src = `data:image/jpeg;base64,${data.foto}`;
          fotoContainer.appendChild(img);
        } else {
          console.log("Foto não encontrada, exibindo inicial...");
          fotoContainer.textContent = username.charAt(0).toUpperCase();
        }
  
        document.getElementById("edit-descricao").value = data.descricao || "";
        console.log("Descrição:", data.descricao || "(vazio)");
  
        const emailP = document.createElement("p");
        emailP.innerHTML = `<strong>Email:</strong> <span id="email">${data.email || "Não informado"}</span>`;
        document.getElementById("username").parentNode.insertAdjacentElement("afterend", emailP);
  
        if (userId === sessionId) {
          console.log("Usuário logado, habilitando edição.");
          document.getElementById("edit-button").style.display = "inline-block";
        } else {
          console.log("Usuário não é o logado, não habilitando edição.");
        }
      } catch (jsonError) {
        console.error("Erro ao analisar JSON:", jsonError);
        alert("Erro ao processar os dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      alert("Erro ao carregar perfil.");
    }
  }
  
  function enableEditing() {
    console.log("Habilitando edição...");
    document.getElementById("edit-descricao").disabled = false;
    document.getElementById("edit-foto").style.display = "block";
    document.getElementById("change-photo-button").style.display = "inline-block";
    document.getElementById("save-button").style.display = "inline-block";
    document.getElementById("edit-button").style.display = "none";
  }
  
  function saveProfileChanges() {
    const id = getUserIdFromURL();
    const descricao = document.getElementById("edit-descricao").value;
    const foto = document.getElementById("edit-foto").files[0];
  
    console.log("Enviando dados para atualização de perfil...");
    console.log(`ID: ${id}`);
    console.log(`Descrição: ${descricao}`);
    console.log(`Foto selecionada: ${foto ? foto.name : "Nenhuma foto"}`);
  
    const formData = new FormData();
    formData.append("descricao", descricao);
    if (foto) formData.append("foto", foto);
  
    fetch(`http://localhost:8080/user/updateProfile/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        console.log("Resposta da atualização:", res);
        if (!res.ok) {
          console.log(`Erro na resposta de atualização: ${res.status}`);
          throw new Error("Erro ao atualizar perfil.");
        }
  
        console.log(`Status da resposta: ${res.status}`);
        console.log("Headers da resposta:", res.headers);
  
        if (res.status !== 204) {
          return res.json().catch(() => ({}));
        } else {
          console.log("Resposta sem conteúdo (204), nada para processar.");
          return {};
        }
      })
      .then((data) => {
        console.log("Resposta JSON da atualização:", data);
        alert("Perfil atualizado!");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Erro:", err);
        alert("Erro ao salvar.");
      });
  }
  
  document.getElementById("edit-button").addEventListener("click", enableEditing);
  document.getElementById("save-button").addEventListener("click", saveProfileChanges);
  window.addEventListener("load", fetchUserData);
  
  function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  