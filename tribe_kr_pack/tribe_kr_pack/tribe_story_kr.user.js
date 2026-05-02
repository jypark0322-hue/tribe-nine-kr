// ==UserScript==
// @name         NeoNeon Tribe Story KR Loader
// @namespace    neoneon-tribe-korean
// @version      0.2.0
// @description  Load Korean translations for NeoNeon Tribe story pages from external JSON files
// @author       OpenAI
// @match        https://neoneon-tribe.com/story/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // 반드시 자신의 GitHub Pages 주소로 바꿔주세요.
  // 예: https://yourname.github.io/tribe-nine-kr
  const BASE_URL = 'https://github.com/jypark0322-hue/tribe-nine-kr';

  const DEBUG = true;
  const CACHE_BUSTER = 'v=20260502a';

  function log(...args) {
    if (DEBUG) console.log('[TribeKR]', ...args);
  }

  function normalizePath(path) {
    return path.replace(/\/$/, '');
  }

  async function fetchJson(url) {
    const fullUrl = url + (url.includes('?') ? '&' : '?') + CACHE_BUSTER;
    const res = await fetch(fullUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${fullUrl}: ${res.status}`);
    }
    return await res.json();
  }

  function shouldSkipElement(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toUpperCase();
    return ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(tag);
  }

  function translateText(text, dictionary) {
    if (!text || !text.trim()) return text;
    let out = text;
    for (const [jp, ko] of dictionary) {
      if (out.includes(jp)) out = out.split(jp).join(ko);
    }
    return out;
  }

  function walk(node, dictionary) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const original = node.nodeValue;
      const translated = translateText(original, dictionary);
      if (translated !== original) node.nodeValue = translated;
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (shouldSkipElement(node)) return;

    for (const child of node.childNodes) {
      walk(child, dictionary);
    }
  }

  async function getDictionary() {
    const path = normalizePath(location.pathname);
    const pageName = path.split('/').pop();

    const commonUrl = `${BASE_URL}/translations/common.json`;
    const pageUrl = `${BASE_URL}/translations/${pageName}.json`;

    let common = [];
    let page = [];

    try {
      common = await fetchJson(commonUrl);
      log('Loaded common dictionary:', common.length);
    } catch (err) {
      console.warn('[TribeKR] common.json load failed:', err);
    }

    try {
      page = await fetchJson(pageUrl);
      log(`Loaded ${pageName}.json:`, page.length);
    } catch (err) {
      console.warn(`[TribeKR] ${pageName}.json load failed:`, err);
    }

    return [...page, ...common].sort((a, b) => b[0].length - a[0].length);
  }

  let currentDictionary = [];

  async function translateDocument() {
    if (!document.body) return;
    currentDictionary = await getDictionary();
    if (!currentDictionary.length) {
      log('No dictionary entries for this page.');
      return;
    }
    walk(document.body, currentDictionary);
    log('Translation applied.');
  }

  function boot() {
    translateDocument();

    const observer = new MutationObserver(() => {
      if (!currentDictionary.length) return;
      walk(document.body, currentDictionary);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
