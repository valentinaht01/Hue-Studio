document.addEventListener("DOMContentLoaded", () => {
    console.log("BOTONES DE IDIOMA:", document.querySelectorAll("[data-language]").length);
/* =========================================
SMOOTH SCROLL
========================================= */

const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
link.addEventListener("click", (event) => {
const targetId = link.getAttribute("href");
  if (!targetId || targetId === "#") return;

  const target = document.querySelector(targetId);

  if (target) {
    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
});

});

/* =========================================
LANGUAGE MENU
========================================= */

const languageMenu = document.querySelector(".language-menu");
const languageToggle = document.querySelector(".language-toggle");
const languageDropdown = document.querySelector(".language-dropdown");
const currentFlag = document.querySelector(".current-flag");

const languageFlags = {
es: "🇪🇸",
en: "🇺🇸",
pt: "🇧🇷",
fr: "🇫🇷",
de: "🇩🇪",
it: "🇮🇹",
ja: "🇯🇵",
ko: "🇰🇷"
};

const supportedLanguages = Object.keys(languageFlags);

/* =========================================
OPEN / CLOSE MENU
========================================= */

function openLanguageMenu() {
if (!languageMenu || !languageToggle) return;
languageMenu.classList.add("open");
languageToggle.setAttribute("aria-expanded", "true");

}

function closeLanguageMenu() {
if (!languageMenu || !languageToggle) return;
languageMenu.classList.remove("open");
languageToggle.setAttribute("aria-expanded", "false");
}

function toggleLanguageMenu() {
if (!languageMenu) return;
if (languageMenu.classList.contains("open")) {
  closeLanguageMenu();
} else {
  openLanguageMenu();
}
}

/* =========================================
TOGGLE BUTTON
========================================= */

if (languageToggle) {
languageToggle.addEventListener("click", (event) => {
event.preventDefault();
event.stopPropagation();
  toggleLanguageMenu();
});
}

/* =========================================
PREVENT DROPDOWN FROM CLOSING
========================================= */

if (languageDropdown) {
languageDropdown.addEventListener("click", (event) => {
event.stopPropagation();
});
}

/* =========================================
CLOSE WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", (event) => {
if (
languageMenu &&
!languageMenu.contains(event.target)
) {
closeLanguageMenu();
}
});

/* =========================================
ESCAPE TO CLOSE
========================================= */

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeLanguageMenu();
}
});

/* =========================================
CHANGE LANGUAGE
========================================= */

function setLanguage(language) {
if (
  typeof translations === "undefined" ||
  !translations[language]
) {
  console.warn(
    "No se encontró la traducción para:",
    language
  );
  return;
}

const dictionary = translations[language];

document.documentElement.lang = language;


/* Cambiar textos */

const elements = document.querySelectorAll("[data-i18n]");

elements.forEach((element) => {

  const key = element.dataset.i18n;

  if (dictionary[key] !== undefined) {
    element.textContent = dictionary[key];
  }

});


/* Cambiar título */

if (dictionary.pageTitle) {
  document.title = dictionary.pageTitle;
}


/* Cambiar bandera */

if (
  currentFlag &&
  languageFlags[language]
) {
  currentFlag.textContent =
    languageFlags[language];
}


/* Guardar idioma */

localStorage.setItem(
  "hueLanguage",
  language
);


/* Marcar idioma activo */

document
  .querySelectorAll("[data-language]")
  .forEach((button) => {

    button.classList.toggle(
      "active",
      button.dataset.language === language
    );

  });


closeLanguageMenu();
}

/* =========================================
LANGUAGE BUTTONS
========================================= */

document
.querySelectorAll("[data-language]")
.forEach((button) => {
  button.addEventListener("click", () => {

    const language =
      button.dataset.language;

    if (
      language &&
      supportedLanguages.includes(language)
    ) {
      setLanguage(language);
    }

  });

});

/* =========================================
COUNTRY → LANGUAGE
========================================= */

const countryLanguageMap = {
/* Español */
CO: "es",
ES: "es",
MX: "es",
AR: "es",
CL: "es",
PE: "es",
EC: "es",
VE: "es",
UY: "es",
PY: "es",
BO: "es",
CR: "es",
PA: "es",
GT: "es",
HN: "es",
SV: "es",
NI: "es",
DO: "es",

/* English */
US: "en",
CA: "en",
GB: "en",
AU: "en",
NZ: "en",
IE: "en",
ZA: "en",

/* Português */
BR: "pt",
PT: "pt",

/* Français */
FR: "fr",
BE: "fr",
LU: "fr",
MC: "fr",

/* Deutsch */
DE: "de",
AT: "de",
CH: "de",

/* Italiano */
IT: "it",
SM: "it",
VA: "it",

/* 日本語 */
JP: "ja",

/* 한국어 */
KR: "ko"
};

/* =========================================
BROWSER LANGUAGE
========================================= */

function detectBrowserLanguage() {
const browserLanguage =
  navigator.language ||
  navigator.userLanguage ||
  "";

const languageCode =
  browserLanguage
    .split("-")[0]
    .toLowerCase();

if (
  supportedLanguages.includes(languageCode)
) {
  return languageCode;
}

return null;
}

/* =========================================
IP COUNTRY
========================================= */

async function detectLanguageByIP() {
try {

  const response = await fetch(
    "https://ipapi.co/json/",
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo detectar el país"
    );
  }

  const data =
    await response.json();

  const countryCode =
    data.country_code?.toUpperCase();

  const detectedLanguage =
    countryLanguageMap[countryCode];

  if (
    detectedLanguage &&
    supportedLanguages.includes(
      detectedLanguage
    )
  ) {
    return detectedLanguage;
  }

} catch (error) {

  console.warn(
    "No se pudo detectar el idioma por IP.",
    error
  );

}

return null;
}

/* =========================================
INITIAL LANGUAGE
========================================= */

async function initializeLanguage() {
/* 1. Idioma elegido manualmente */

const savedLanguage =
  localStorage.getItem(
    "hueLanguage"
  );

if (
  savedLanguage &&
  supportedLanguages.includes(
    savedLanguage
  )
) {
  setLanguage(savedLanguage);
  return;
}


/* 2. País por IP */

const ipLanguage =
  await detectLanguageByIP();

if (ipLanguage) {
  setLanguage(ipLanguage);
  return;
}


/* 3. Idioma del navegador */

const browserLanguage =
  detectBrowserLanguage();

if (browserLanguage) {
  setLanguage(browserLanguage);
  return;
}


/* 4. Inglés por defecto */

setLanguage("en");
}

/* =========================================
START
========================================= */

initializeLanguage();

});
