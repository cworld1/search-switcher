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
// @modified            03/04/2024
// @version             2.0.0
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
    // Add your own search engine here, or change the order. * config must be filled
    // WARN: BACKUP the list before update the script
    {
      // * Display name
      name: "Bing",
      // * Host name (the "@include" above should be added also)
      host: "bing.com",
      // * switcher element that neeed to insert in
      element: ".b_scopebar ul",
      // * Search link that jump to (replace keywords with %s)
      link: "https://www.bing.com/search?q=%s",
      // the key of keyword in searching links（Defaults to q if not set）
      key: "q",
      // Defaults to true if not set, hiding only disappears in the
      // jump list of regular search, panel will still be shown under the corresponding site
      enable: true,
      // Custom styles (applied to a tag)
      style: "padding: 0 10px;",
    },
    {
      // * 显示名称
      name: "Google",
      // * 应用域名（新增的话上面的 include 也要写）
      host: "google.com",
      // * 面板插入位置
      element:
        '#cnt > div > div[role="navigation"] > div >div > div[data-st-cnt="mode"] > div[role="navigation"] > div >div >div > div > div[role="list"]',
      // * 跳转的搜索链接（用 % s 替代关键词）
      link: "https://www.google.com/search?q=%s",
      // 关键词对应的键，用于提取关键词（不写默认为 q）
      key: "q",
      // 是否启用（不写默认为 true，隐藏仅在常规搜索的跳转列表里消失，对应站点下仍会展示面板）
      enable: true,
      // 自定义样式（应用到 a 标签）
      style: "padding:10px 14px;border-radius:20px;border:1px solid #dadce0;",
    },
    {
      name: "Baidu",
      host: "baidu.com",
      element: ".wrapper_new #s_tab .s_tab_inner",
      link: "https://www.baidu.com/s?wd=%s",
      key: "wd",
      style: "padding: 0 8px",
    },
    {
      name: "Github",
      host: "github.com",
      element: ".AppHeader-search",
      link: "https://github.com/search?q=%s",
      style: `border: var(--borderWidth-thin, 1px) solid var(--borderColor-default, var(--color-border-default));
        border-radius: var(--borderRadius-medium, 6px);
        background: transparent;
        padding: 4.5px 8px;
        margin: 0 4px !important;`,
    },
    {
      name: "Bili",
      host: "bilibili.com",
      element: ".vui_tabs--navbar .vui_tabs--nav",
      link: "https://search.bilibili.com/all?keyword=%s",
      key: "keyword",
    },
    /* {
      name: "Yandex",
      host: "yandex.com",
      element: ".navigation .navigation__region",
      link: "https://yandex.com/search/?text=%s",
      key: "text",
    }, */
  ];

  const css = `
      #search-switcher-parent {
        display: inline-block;
        justify-content: center;
        align-items: center;
      }
      .search-switcher .search-list a {
        padding: 6px 10px;
        margin: 0 5px !important;
        background-color: #ffffff1a;
        text-decoration: none;
        border-radius: 100px;
        color: #7e8991;
        display: inline-block;
      }
      `;

  function setup() {
    const switcherParentId = "search-switcher-parent";
    if (document.getElementById(switcherParentId)) return true;

    // Query sites
    // console.log("location:", location.href);
    const curSite = sites.find(({ host }) => location.hostname.includes(host));
    if (!curSite) return false;
    const siteList = sites.filter(
      ({ name, enable }) => curSite.name != name && enable != false
    );
    // console.log("siteList:", siteList);

    // Get queries
    const query = new URLSearchParams(location.search).get(curSite.key || "q");
    // console.log("site:", curSite, ",query:", query);
    if (!query) return false;

    // Setup styles
    const style = document.createElement("style");
    style.innerHTML =
      css +
      (curSite.style
        ? `.search-switcher.${curSite.name} a{${curSite.style}}`
        : "");
    console.log("style:", style.innerHTML);
    document.body.appendChild(style);

    // Create element
    const switcherParent = document.createElement("div");
    switcherParent.setAttribute("id", switcherParentId);
    // Fill the content
    const tags = siteList
      .map(
        ({ link, name }) =>
          `<a href='${link.replace("%s", query)}' target='_blank' >${name}</a>`
      )
      .join("");
    // console.log("siteList:", tags);
    switcherParent.innerHTML = `
            <div id='search-switcher' class='search-switcher ${curSite.name}'>
                <div id='search-list' class="search-list">${tags}</div>
            </div>
        `;
    document.querySelector(curSite.element)?.appendChild(switcherParent);
    // console.log(curSite.element + ".appendChild:", switcherParent);
  }

  (function init() {
    let _href = ""; // Declare and initialize _href
    var current_href = location.href;

    if (_href !== null && _href !== current_href) {
      // Check if _href is not null and different from current_href
      if (setup()) return;
      _href = current_href;
    }
    setTimeout(init, 2000);
  })();
}
// end userScript
