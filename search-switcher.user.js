// ==UserScript==
// @name                Search Switcher
// @name:zh-CN          搜索切换器
// @name:zh-TW          搜索切換器
// @description         Add links to each other in search engines. Including multiple search modes.
// @description:zh-CN   在常用的搜索引擎页面中添加互相切换的按钮。
// @description:zh-TW   在常用的搜索引擎頁面中添加互相切換的按鈕。
// @author              CWorld
// @icon                https://www.freeiconspng.com/uploads/search-icon-png-21.png
// @license             MIT
// @date                01/06/2023
// @modified            01/07/2023
// @version             1.0.3
// @namespace           https://blog.cworld.top
// @downloadURL         https://raw.githubusercontent.com/cworld1/search-switcher/main/search-switcher.user.js
// @updateURL           https://raw.githubusercontent.com/cworld1/search-switcher/main/search-switcher.user.js
// @include             https://www.baidu.com/s?*
// @include             https://www.bing.com/search?*
// @include             https://www.bing.cn/search?*
// @include             https://search.bilibili.com/*
// @include             https://github.com/search?*
// @include             https://www.google.com/search?*
// @include             https://www.google.com.hk/search?*
// @include             https://yandex.com/search/?*
// @include             /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @grant               none
// @run-at              document_body
// ==/UserScript==

{
  const sites = [
    {
      name: "Bing",
      host: "bing.com",
      link: "https://www.bing.com/search",
      key: "q",
      element: ".b_scopebar ul",
      hide: false,
    },
    {
      name: "Google",
      host: "google.com",
      link: "https://www.google.com/search",
      key: "q",
      element: "#top_nav #hdtb-msb",
      hide: false,
    },
    {
      name: "Github",
      host: "github.com",
      link: "https://github.com/search",
      key: "q",
      element: ".search-with-dialog",
      hide: false,
    },
    {
      name: "Baidu",
      host: "baidu.com",
      link: "https://www.baidu.com/s",
      key: "wd",
      element: ".wrapper_new #s_tab .s_tab_inner",
      hide: false,
    },
    {
      name: "Bili",
      host: "bilibili.com",
      link: "https://search.bilibili.com/all",
      key: "keyword",
      element: ".vui_tabs--navbar .vui_tabs--nav",
      hide: false,
    },
    {
      name: "Yandex",
      host: "yandex.com",
      link: "https://yandex.com/search/?",
      key: "text",
      element: ".navigation .navigation__region",
      hide: false,
    },
  ];

  const css = `
      #search-switcher-parent {
        display: inline-block;
      }
      .search-switcher .search-list a {
        padding: 4px 10px;
        margin: 0 5px;
        background-color: #ffffff1a;
        text-decoration: none;
        border-radius: 100px;
        color: #a5b9c6;
      }

      .search-switcher.Bing a {
        padding: 0 10px;
      }
      .search-switcher.Baidu a {
        padding: 0;
        background: transparent;
      }
      .search-switcher.Yandex {
        position: relative;
        top: 3px;
      }
      `;

  function setup() {
    // console.log("location:", location.href);
    let curSite;
    for (let site of sites) {
      if (
        location.hostname === site.host ||
        location.hostname.endsWith("." + site.host)
      ) {
        curSite = site;
        break;
      }
    }
    if (!curSite) return;
    let siteList = sites.filter(
      ({ host, hide }) => !location.hostname.includes(host) && !hide
    );
    // console.log("siteList:", siteList);
    let query = new URLSearchParams(location.search).get(curSite.key || "q");
    // console.log("site:", curSite, ",query:", query);
    if (query == null) {
      return;
    }
    let body = document.body;
    if (body == undefined) {
      return;
    }
    let switcherParentId = "search-switcher-parent";
    let switcherParent = document.getElementById(switcherParentId);
    if (switcherParent == undefined) {
      // 样式
      const style = document.createElement("style");
      style.innerHTML = css;
      body.appendChild(style);
      // 生成切换框
      switcherParent = document.createElement("div");
      switcherParent.setAttribute("id", switcherParentId);
    //   console.log("body.appendChild:", switcherParent);
      document.querySelector(curSite.element).appendChild(switcherParent);
    }
    const siteTag = ({ link, name, key }) => {
      let href = `${link}?${key}=${query}`;
    //   console.log("href:", href);
      return `<a href='${href}' target='_blank' >${name}</a>`;
    };
    const tags = siteList
      .filter(({ hidden }) => !hidden)
      .map(siteTag)
      .join("");

    switcherParent.innerHTML = `
            <div id='search-switcher' class='search-switcher ${curSite.name}'>
                <div id='search-list' class="search-list">${tags}</div>
            </div>
        `;
    // console.log("switcherParent:", switcherParent);
  }

  let _href = "";
  !(function init() {
    var current_href = location.href;
    if (_href != current_href) {
      setup();
      _href = current_href;
    }
    setTimeout(init, 2000);
  })();
}
// end userScript
