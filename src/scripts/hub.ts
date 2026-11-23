const hub = document.querySelector<HTMLElement>('[data-link-hub]');

if (hub) {
  const search = hub.querySelector<HTMLInputElement>('#link-search')!;
  const feedback = hub.querySelector<HTMLElement>('.hub-feedback')!;
  const empty = hub.querySelector<HTMLElement>('.no-results')!;
  const buttons = [...hub.querySelectorAll<HTMLButtonElement>('[data-profile-button]')];
  const panels = [...hub.querySelectorAll<HTMLElement>('[data-profile-panel]')];

  function filterLinks(announce = true) {
    const panel = panels.find((item) => item.dataset.profilePanel === hub!.dataset.activeProfile);
    const query = search.value.trim().toLocaleLowerCase();
    let matches = 0;
    panel?.querySelectorAll<HTMLElement>('[data-lane]').forEach((lane) => {
      let count = 0;
      lane.querySelectorAll<HTMLElement>('[data-link-card]').forEach((card) => {
        card.hidden = !(card.dataset.search ?? '').toLocaleLowerCase().includes(query);
        if (!card.hidden) count++;
      });
      lane.hidden = count === 0;
      lane.querySelector('[data-lane-count]')!.textContent = `${count} ${count === 1 ? 'link' : 'links'}`;
      matches += count;
    });
    empty.hidden = !query || matches > 0;
    if (announce) feedback.textContent = `${matches} ${matches === 1 ? 'link' : 'links'} found.`;
  }

  function rememberProfile(id: string) {
    try {
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${hub!.dataset.cookieName}=${encodeURIComponent(id)}; Path=${hub!.dataset.cookiePath}; Max-Age=31536000; SameSite=Lax${secure}`;
      return document.cookie.split(';').some((part) => part.trim() === `${hub!.dataset.cookieName}=${encodeURIComponent(id)}`);
    } catch {
      return false;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.profileButton!;
      hub.dataset.activeProfile = id;
      panels.forEach((panel) => { panel.hidden = panel.dataset.profilePanel !== id; });
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      search.value = '';
      filterLinks(false);
      const remembered = rememberProfile(id);
      feedback.textContent = `${button.textContent!.trim()} profile selected.${remembered ? '' : ' Your browser is blocking cookies, so this choice cannot be remembered.'}`;
    });
  });

  // Store the initial choice too, so a later default change does not reset this browser.
  rememberProfile(hub.dataset.activeProfile!);
  filterLinks(false);
  search.addEventListener('input', () => filterLinks());
  window.addEventListener('pageshow', () => filterLinks(false));

  hub.querySelectorAll<HTMLImageElement>('.favicon').forEach((icon) => {
    const update = () => icon.parentElement?.classList.toggle('has-favicon', icon.complete && icon.naturalWidth > 0);
    icon.addEventListener('load', update);
    icon.addEventListener('error', update);
    update();
  });

  hub.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    let resetTimer: ReturnType<typeof setTimeout>;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy!);
        clearTimeout(resetTimer);
        const hint = button.querySelector('.copy-hint')!;
        hint.textContent = 'Copied';
        button.classList.add('is-copied');
        feedback.textContent = `Copied ${button.querySelector('.link-title')!.textContent} to clipboard.`;
        resetTimer = setTimeout(() => {
          hint.textContent = 'Copy';
          button.classList.remove('is-copied');
        }, 2000);
      } catch {
        // Leave the exact path selectable when clipboard permission is unavailable.
        feedback.classList.remove('sr-only');
        feedback.textContent = `Copy this path: ${button.dataset.copy}`;
      }
    });
  });
}
