/* Teach pages: copy the syllabus line, print a worksheet, and fill in today's date
   where a citation asks for the date accessed. Uses no storage and makes no requests. */
(function () {
  'use strict';

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  var now = new Date();
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var dates = {
    apa: months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear(),
    iso: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
  };
  Array.prototype.forEach.call(document.querySelectorAll('[data-accessed]'), function (el) {
    var form = el.getAttribute('data-accessed');
    if (dates[form]) el.textContent = dates[form];
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    var target = document.getElementById(btn.getAttribute('data-copy'));
    var status = btn.parentNode.querySelector('.t-copy-status');
    btn.addEventListener('click', function () {
      if (!target) return;
      var text = target.textContent.trim();
      var done = function (ok) {
        if (status) status.textContent = ok ? 'Copied.' : 'Copy failed; select the text and copy it instead.';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });
})();
