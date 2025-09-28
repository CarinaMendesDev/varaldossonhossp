// COLAR SEU PERSONAL ACCESS TOKEN AQUI
const apiKey =  "patj4YJMOCo2eKk5o.544fe3082198705feb14e9668bd92c73c7e39a7c36bdece90ca549298b813a25"; // << seu token completo
const baseId = "appWObWnrpNMXVv4I";
const tableNameOrId = "tblwXOoXiIbChDRWN";
const airtableUrlBase = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableNameOrId)}`;

// Listar usuários (paginação)
async function listarUsuarios() {
  const container = document.getElementById("Usuarios");
  if (!container) return console.warn("#Usuarios não encontrado");
  container.innerText = "Carregando Usuários...";

  try {
    let allRecords = [];
    let offset = undefined;
    do {
      const url = new URL(airtableUrlBase);
      if (offset) url.searchParams.set("offset", offset);
      url.searchParams.set("pageSize", 100);
      const resp = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    container.innerHTML = "";
    if (allRecords.length === 0) { container.innerText = "Nenhum usuário encontrado."; return; }

    allRecords.forEach(record => {
      const f = record.fields || {};
      const card = document.createElement("div");
      card.className = "usuario-card";
      card.innerHTML = `
        <h3>${f.Nome || "Sem nome"}</h3>
        <p><b>Email:</b> ${f.Email || "—"}</p>
        <p><b>Telefone:</b> ${f.Telefone || "—"}</p>
        <p><b>Tipo:</b> ${f.Tipo || "—"}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerText = "Erro ao carregar usuários. Veja console.";
  }
}

// Criar usuário
async function criarUsuario(fields) {
  const resp = await fetch(airtableUrlBase, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ records: [{ fields }] })
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  listarUsuarios();

  const form = document.getElementById("cadastroForm");
  if (!form) return;

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const Nome = (document.getElementById("Nome").value || "").trim();
    const Telefone = (document.getElementById("Telefone").value || "").trim();
    const Email = (document.getElementById("Email").value || "").trim();
    const Tipo = (document.getElementById("Tipo").value || "").trim();
    const Senha = (document.getElementById("Senha").value || "").trim();
    // const receber = document.getElementById("receber").checked ? "Sim" : "Não";

    if (!Nome || !Email || !Tipo || !Senha) {
      alert("Por favor preencha Nome, E-mail e Senha.");
      return;
    }

    const fields = {
      Nome: Nome,
      // Telefone: telefone,
      Email: Email,
      Senha: Senha,
      // ReceberNotificacoes: receber,
      // Tipo: "Doador"
      Senha: Senha,
    };

    try {
      await criarUsuario(fields);
      alert("Cadastro realizado com sucesso!");
      form.reset();
      listarUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar. Veja console.");
    }
  });
});
