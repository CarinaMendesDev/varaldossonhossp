// Conexão com Airtable

// Token Pessoal (⚠️ usar só para teste, não publicar em produção)
const apiKey = "SUA_API_KEY_AQUI"; // <<< coloque a sua chave aqui

// IDs da base e tabela
const baseId = "appWObWnrpNMXVv4I";  
const tableId = "tblwXOoXiIbChDRWN";  // Tabela: Usuarios

// Função para buscar registros
async function listarUsuarios() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao conectar ao Airtable: " + response.statusText);
    }

    const data = await response.json();
    console.log("Registros recebidos:", data);

    // Exibir no HTML
    let container = document.getElementById("usuarios");
    if (!container) {
      console.warn("Elemento #usuarios não encontrado no HTML");
      return;
    }

    container.innerHTML = "";
    data.records.forEach(record => {
      const fields = record.fields;
      let div = document.createElement("div");
      div.classList.add("usuario-card");
      div.innerHTML = `
        <h3>${fields.Nome || "Sem nome"}</h3>
        <p><b>Email:</b> ${fields.Email || "—"}</p>
        <p><b>Tipo:</b> ${fields.Tipo || "—"}</p>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("usuarios").innerText = "Erro ao carregar usuários.";
  }
}

// Executa automaticamente quando a página carregar
document.addEventListener("DOMContentLoaded", listarUsuarios);
