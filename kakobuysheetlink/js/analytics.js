/* kakobuysheetlink — GA4 / Firebase Analytics (kakobuywebsite2) */
(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyDKQ5x1dCohEIeppElYY0PsyF7b2hu5hDc",
    authDomain: "kakobuywebsite2.firebaseapp.com",
    projectId: "kakobuywebsite2",
    storageBucket: "kakobuywebsite2.firebasestorage.app",
    messagingSenderId: "433406177038",
    appId: "1:433406177038:web:574fe9ff4f2b55fab0315f",
    measurementId: "G-4QV7PQFTJT",
  };

  var MEASUREMENT_ID = firebaseConfig.measurementId;
  window.KF = window.KF || {};
  window.KF.analyticsId = MEASUREMENT_ID;
  window.KF.firebaseConfig = firebaseConfig;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: "SameSite=None;Secure",
  });

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  var mod = document.createElement("script");
  mod.type = "module";
  mod.textContent =
    'import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";\n' +
    'import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";\n' +
    "const firebaseConfig = " +
    JSON.stringify(firebaseConfig) +
    ";\n" +
    "const app = initializeApp(firebaseConfig);\n" +
    "window.KF.firebaseApp = app;\n" +
    "window.KF.firebaseAnalytics = getAnalytics(app);\n";
  document.head.appendChild(mod);
})();
