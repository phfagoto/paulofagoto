/* ============================================================
   SCRIPT GLOBAL – www.paulofagoto.com.br
   Centraliza o JavaScript de todas as páginas do site.
   ============================================================ */

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
});