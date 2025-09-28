// airtable.direct.js  (rename to airtable.js para usar no repo)
// COLAR SEU PERSONAL ACCESS TOKEN AQUI (ex: patj4...)
const apiKey =  "patj4YJMOCo2eKk5o.544fe3082198705feb14e9668bd92c73c7e39a7c36bdece90ca549298b813a25"; // << seu token completo
const baseId = "appWObWnrpNMXVv4I";
const tableNameOrId = "tblwXOoXiIbChDRWN";
const airtableUrlBase = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableNameOrId)}`;

// Listar usuários (paginação)
async function listarUsuarios() {
  const container = document.getElementById("usuarios");
  if (!container) return console.warn("#usuarios não encontrado");
  container.innerText = "Carregando usuários...";

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
    const nome = (document.getElementById("nome").value || "").trim();
    const telefone = (document.getElementById("telefone").value || "").trim();
    const email = (document.getElementById("email").value || "").trim();
    const senha = (document.getElementById("senha").value || "").trim();
    const receber = document.getElementById("receber").checked ? "Sim" : "Não";

    if (!nome || !email || !senha) {
      alert("Por favor preencha Nome, E-mail e Senha.");
      return;
    }

    const fields = {
      Nome: nome,
      Telefone: telefone,
      Email: email,
      Senha: senha,
      ReceberNotificacoes: receber,
      Tipo: "Doador"
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
