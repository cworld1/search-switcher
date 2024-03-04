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
    // Add your own search engine here, or change the order
    // WARN: BACKUP the list before update the script
    {
      name: "Bing", // display name
      host: "bing.com", // Host name (the "@include" above should be added also)
      link: "https://www.bing.com/search?q=%s", // search link
      key: "q", // the key of keyword in searching links
      element: ".b_scopebar ul", // switcher element that neeed to insert in
      hide: false, // hide or not
    },
    {
      name: "Google", // 显示名称
      host: "google.com", // 应用域名（新增的话上面的 include 也要写）
      link: "https://www.google.com/search?q=%s", // 跳转的搜索链接（用 %s 替代关键词）
      key: "q", // 关键词对应的键，用于提取关键词（不写的话默认为q）
      element:
        'div[role="navigation"]>div:nth-child(1)>div>h1+div>div>div[jsslot]', // 插入位置
      hide: false, // 是否隐藏
    },
    {
      name: "Baidu",
      host: "baidu.com",
      link: "https://www.baidu.com/s?wd=%s",
      element: ".wrapper_new #s_tab .s_tab_inner",
      key: "wd",
      hide: false,
    },
    {
      name: "Github",
      host: "github.com",
      link: "https://github.com/search?q=%s",
      key: "q",
      element: ".AppHeader-search",
      hide: false,
    },
    {
      name: "Bili",
      host: "bilibili.com",
      link: "https://search.bilibili.com/all?keyword=%s",
      key: "keyword",
      element: ".vui_tabs--navbar .vui_tabs--nav",
      hide: false,
    },
    /* {
      name: "Yandex",
      host: "yandex.com",
      link: "https://yandex.com/search/?text=%s",
      key: "text",
      element: ".navigation .navigation__region",
      hide: false,
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
        color: #a5b9c6;
        display: inline-block;
      }

      .search-switcher.Bing a {
        padding: 0 10px;
      }
      .search-switcher.Baidu a {
        padding: 0 8px;
      }
      .search-switcher.Github a {
        border: var(--borderWidth-thin, 1px) solid var(--borderColor-default, var(--color-border-default));
        border-radius: var(--borderRadius-medium, 6px);
        background: transparent;
        padding: 4.5px 8px;
        margin: 0 4px !important;
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
      // console.log("body.appendChild:", switcherParent);
      const parentElement = document.querySelector(curSite.element);
      if (!parentElement) return;
      parentElement.appendChild(switcherParent);
    }
    const siteTag = ({ link, name }) => {
      let href = link.replace("%s", query);
      // console.log("href:", href);
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
    return true;
  })();
}
// end userScript
