# Cave Layer — como colocar no ar e usar o painel /admin

Esta pasta é o site completo. O conteúdo editável (mods, preços, textos, dúvidas, galeria, links) fica em `content/`, e o painel em `seusite.com/admin` edita esses arquivos para você.

Como funciona: o site fica guardado no **GitHub**, e a **Netlify** publica o site automaticamente. Quando você salva algo no painel, ele grava no GitHub e, cerca de 1 minuto depois, o site atualiza sozinho.

---

## 1. Subir o site para o GitHub (uma vez só)
1. Crie uma conta em github.com (se ainda não tiver).
2. Clique em **New repository**, dê um nome (ex.: `cavelayer`) e crie.
3. Na página do repositório, clique em **uploading an existing file** e arraste **todo o conteúdo desta pasta** (não a pasta em si). Clique em **Commit changes**.

## 2. Publicar na Netlify (uma vez só)
1. Entre em app.netlify.com com a sua conta do GitHub.
2. **Add new site → Import an existing project → GitHub** e escolha o repositório `cavelayer`.
3. Deixe "Build command" vazio e "Publish directory" como `/`. Clique em **Deploy**.
4. Pronto: o site ganha um endereço tipo `cavelayer.netlify.app`. Em **Domain management** você pode ligar um domínio próprio (ex.: `cavelayer.com.br`, comprado no Registro.br).

## 3. Ligar o painel /admin (uma vez só)
1. Abra o arquivo `admin/config.yml` (pode editar direto no GitHub, clicando no lápis) e troque
   `repo: USUARIO/REPOSITORIO` pelo seu, por exemplo `repo: squareguy/cavelayer`. Salve.
2. Crie um **token de acesso** no GitHub: foto do perfil → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Repository access: **Only select repositories** → escolha `cavelayer`.
   - Permissions → Repository permissions → **Contents: Read and write**.
   - Gere e **copie o token** (guarde num lugar seguro, ele é como uma senha).
3. Acesse `seusite.netlify.app/admin`, clique na setinha ao lado de **Sign In** e escolha **Sign In with Access Token**. Cole o token.

Cada Pedro pode criar o próprio token (os dois precisam ter acesso ao repositório: Settings → Collaborators no GitHub).

> Opcional: para entrar com o botão "Sign in with GitHub" em vez de token, crie um OAuth App no GitHub e registre em Netlify → Site configuration → Access & security → OAuth. Não é necessário para usar o painel.

## 4. Usando o painel
- **Loja → Mods à venda:** adicionar, remover, reordenar mods; nome, descrição, preço, categoria, versão, imagem e **link de pagamento**. Sem link, o botão aparece como "Em breve".
- **Textos do site:** frase amarela, subtítulo, links do Discord/Instagram, passos do "Como funciona", textos da encomenda, galeria de prints, link do trailer no YouTube e as dúvidas.
- Clique em **Save/Publish**. Em ~1 minuto o site atualiza.

## 5. Vendas e pedidos
- **Pagamento:** crie um link de pagamento por mod no Mercado Pago, PagSeguro, Stripe, Hotmart, Kiwify ou Gumroad e cole no campo "Link de pagamento". Hotmart/Kiwify/Gumroad também entregam o arquivo `.jar` automaticamente.
- **Pedidos sob encomenda:** o formulário já usa o **Netlify Forms**. Os pedidos aparecem no painel da Netlify em **Forms**, e dá pra ativar aviso por e-mail em Forms → Notifications.

## Arquivos
- `index.html`, `css/`, `js/` — o site (visual e animações).
- `content/mods.json`, `content/site.json` — o conteúdo (o painel edita estes).
- `assets/` — texturas, logo, céu, fonte. `images/uploads/` — imagens enviadas pelo painel.
- `admin/` — o painel (Sveltia CMS).

Créditos: fonte "Minecraft" por Pwnage_Block (CC BY-SA 3.0). Projeto não oficial, sem relação com a Mojang ou a Microsoft.
