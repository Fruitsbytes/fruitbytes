// PORT TARGET: web-stencil/src/components/console-welcome/console-welcome.tsx
// Decorative code-blocks shown in the right panel when route is /welcome.
// Syntax highlighting is deferred — render as plain monospace for now.

const PHP_SNIPPET = `<?php
/**
 * PHP 8.1.7 - Laravel 9.1.10 - MySql 8.0.29
 *
 * Hi,
 * I am a graphic designer and a senior software developer from Haïti
 * with many years on web technology, mobile technology, C++,
 * and managing teams
 *
 * More info on the About page ↑
 *
 **/

 $selected_lang =  $_GET['lang'] ?: 'en'; // You are not dreaming, PHP code snippet in a inspection dev tool, I had to do it 😂🤣😅

?>`;

const HTML_SNIPPET = `<!DOCTYPE html>
<html lang="<?php echo $selected_lang ?>">
<head>
  <meta name="description" content="Jeffrey Nicholson Carré's personal webpage" />
  <meta charset="utf-8">
  <title>FruitsBytes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="author" content="Jeffrey Nicholson Carré">
  <link rel="stylesheet" href="css/style.scss">
  <script src="https://code.rare-pokemon.ht/scyther-latest.min.js"></script>
  <script src="https://cdn.fruitsbytes.ht/jeffrey.min.js"></script>
  <script src="./assets/js/elevated-permission-kit.js"></script>
</head>
<body>
  <header></header>
  <main class="container-fluid">
    <web-component></web-component>
    <angular version='14.0.3' level='proficient'></angular>
    <react version='18.2.0' level='expert'></react>
    <typescript version='4.6.3' level='expert'></typescript>
  </main>
  <footer class="beautiful-dark-footer.css">
    <div class="row">
      <div class="col"><!-- TO-DO 😎 --></div>
      <div class="col"><!-- TO-DO 💻 --></div>
      <div class="col"><!-- TO-DO 🎮 --></div>
    </div>
  </footer>
  <script type="module">
    import { sudo, masterBatch } from 'elevated-permission-kit';

    function apply_kryptonite() {
      try {
        const scyther = new Pokemon('scyther', { megamax: true, baseColor: 'blue' });
        await scyther.removeSecurityProtections('root');
      } catch (e) {
        return;
      }
    }

    (async () => {
      /* open user developer-tool:inspection */
      const [exe] = masterBatch;
      await apply_kryptonite();
      exe.run(
        'sudo ./tools.dll --open=inspection-dev-tool --silent -verbose=false',
        { ...sudo.root }
      );
    })();
  </script>
</body>
</html>`;

export default function ConsoleWelcome() {
  return (
    <div class="h-full overflow-y-auto p-2 text-[var(--panel-text-strong)] font-mono text-[11px] leading-[1.45] space-y-3">
      <pre class="m-0 p-2 bg-[var(--panel-toolbar)] border border-[var(--panel-border)] rounded overflow-x-auto whitespace-pre">
        <code>{PHP_SNIPPET}</code>
      </pre>
      <pre class="m-0 p-2 bg-[var(--panel-toolbar)] border border-[var(--panel-border)] rounded overflow-x-auto whitespace-pre">
        <code>{HTML_SNIPPET}</code>
      </pre>
    </div>
  );
}
