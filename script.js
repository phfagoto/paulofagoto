/* ============================================================
   SCRIPT GLOBAL – www.paulofagoto.com.br
   Centraliza o JavaScript de todas as páginas do site.
   ============================================================ */

// ===== CONFIGURAÇÃO DO HORÁRIO DE ATENDIMENTO =====
// Segunda a domingo, das 06:00 às 21:30 (horário de São Paulo)
const SCHEDULE_OPEN = { hours: 6, minutes: 0 };
const SCHEDULE_CLOSE = { hours: 21, minutes: 30 };

// ===== UTILITÁRIOS =====

// Obtém a data/hora atual no fuso horário de São Paulo
function getSaoPauloTime() {
  const now = new Date();
  const spString = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  return new Date(spString);
}

// Formata uma duração (em segundos) em texto legível
// Ex: 3661 => "1h 1m 1s" | 125 => "2m 5s" | 45 => "45s"
function formatDuration(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const parts = [];
  if (h > 0) parts.push(h + 'h');
  if (m > 0 || h > 0) parts.push(m + 'm');
  parts.push(s + 's');

  return parts.join(' ');
}

// ===== ATUALIZAÇÃO DO STATUS E CRONÔMETRO =====
function updateScheduleStatus() {
  const sp = getSaoPauloTime();
  const hours = sp.getHours();
  const minutes = sp.getMinutes();
  const seconds = sp.getSeconds();

  const nowSeconds = hours * 3600 + minutes * 60 + seconds;
  const openSeconds = SCHEDULE_OPEN.hours * 3600 + SCHEDULE_OPEN.minutes * 60;
  const closeSeconds = SCHEDULE_CLOSE.hours * 3600 + SCHEDULE_CLOSE.minutes * 60;

  const isOnline = nowSeconds >= openSeconds && nowSeconds < closeSeconds;

  // ===== Atualiza a barra de status no topo =====
  const statusBar = document.getElementById('status-bar');
  const statusText = document.getElementById('status-text');

  if (statusBar && statusText) {
    if (isOnline) {
      statusBar.classList.remove('offline');
      statusBar.classList.add('online');
      statusText.textContent = 'Atendimento Online';
    } else {
      statusBar.classList.remove('online');
      statusBar.classList.add('offline');

      // Calcula o tempo até a próxima abertura
      let remaining;
      if (nowSeconds < openSeconds) {
        remaining = openSeconds - nowSeconds;
      } else {
        remaining = (24 * 3600 - nowSeconds) + openSeconds;
      }

      statusText.innerHTML = 'Atendimento Offline - Volte daqui <strong>' + formatDuration(remaining) + '</strong>';
    }
  }

  // ===== Atualiza o cronômetro na página inicial =====
  const countdownText = document.getElementById('schedule-countdown-text');
  if (countdownText) {
    if (isOnline) {
      const remaining = closeSeconds - nowSeconds;
      countdownText.innerHTML = 'Encerra em <strong>' + formatDuration(remaining) + '</strong>';
    } else {
      let remaining;
      if (nowSeconds < openSeconds) {
        remaining = openSeconds - nowSeconds;
      } else {
        remaining = (24 * 3600 - nowSeconds) + openSeconds;
      }
      countdownText.innerHTML = 'Abre em <strong>' + formatDuration(remaining) + '</strong>';
    }
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== Ano dinâmico no rodapé =====
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Banner de Cookies (LGPD / AdSense) =====
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const consent = localStorage.getItem('cookieConsent');

    if (!consent) {
      banner.classList.add('show');
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('show');
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.classList.remove('show');
      });
    }
  }

  // ===== Status de Atendimento em Tempo Real =====
  updateScheduleStatus();
  setInterval(updateScheduleStatus, 1000);

  // ===== INSERE LINK "DOWNLOADS" NO MENU AUTOMATICAMENTE =====
  // Adiciona o link na navegação de todas as páginas que usam este script,
  // sem precisar editar o HTML de cada uma.
  const nav = document.querySelector('.header-nav');
  if (nav && !nav.querySelector('a[href="/downloads.html"]')) {
    const downloadsLink = document.createElement('a');
    downloadsLink.href = '/downloads.html';
    downloadsLink.className = 'nav-link';
    downloadsLink.textContent = 'Downloads';

    // Marca como ativo se o usuário estiver na página de downloads
    if (window.location.pathname.endsWith('/downloads.html')) {
      downloadsLink.classList.add('active');
      downloadsLink.setAttribute('aria-current', 'page');
    }

    // Insere antes do link do Blog (se existir); senão, no final
    const blogLink = nav.querySelector('a[href="/blog/"]');
    if (blogLink) {
      nav.insertBefore(downloadsLink, blogLink);
    } else {
      nav.appendChild(downloadsLink);
    }
  }

  // ===== INSERE LINK "PLANILHAS" NO MENU AUTOMATICAMENTE =====
  // Adiciona o link na navegação de todas as páginas que usam este script,
  // sem precisar editar o HTML de cada uma.
  if (nav && !nav.querySelector('a[href="/planilhas.html"]')) {
    const planilhasLink = document.createElement('a');
    planilhasLink.href = '/planilhas.html';
    planilhasLink.className = 'nav-link';
    planilhasLink.textContent = 'Planilhas';

    // Marca como ativo se o usuário estiver na página de planilhas
    if (window.location.pathname.endsWith('/planilhas.html')) {
      planilhasLink.classList.add('active');
      planilhasLink.setAttribute('aria-current', 'page');
    }

    // Insere antes do link do Blog (se existir); senão, no final
    const blogLink = nav.querySelector('a[href="/blog/"]');
    if (blogLink) {
      nav.insertBefore(planilhasLink, blogLink);
    } else {
      nav.appendChild(planilhasLink);
    }
  }
});