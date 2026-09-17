
const formulario = document.getElementById("formItem");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();
    const status = document.getElementById("itemStatus");
    status.textContent = "Salvando item...";

    const dados = Object.fromEntries(new FormData(formulario));

    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sua sessão expirou. Faça login novamente.");

      const { data: produto, error: produtoError } = await supabaseClient
        .from("products")
        .insert({
          name: dados.itemNome.trim(),
          default_price: Number(dados.itemPreco)
        })
        .select("id")
        .single();
      if (produtoError) throw produtoError;

      formulario.reset();
      status.textContent = "Item cadastrado com sucesso.";
    } catch (erro) {
      const detalhes = [erro.code, erro.details, erro.hint].filter(Boolean).join(" | ");
      status.textContent = `Não foi possível cadastrar o item: ${erro.message}${detalhes ? ` | ${detalhes}` : ""}`;
    }
});
