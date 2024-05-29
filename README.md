# Search Switcher

[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/cworld1/search-switcher?label=commits&style=flat-square)](https://github.com/cworld1/search-switcher/commits)
[![GitHub stars](https://img.shields.io/github/stars/cworld1/search-switcher?style=flat-square)](https://github.com/cworld1/search-switcher/stargazers)
[![GitHub license](https://img.shields.io/github/license/cworld1/search-switcher?style=flat-square)](https://github.com/cworld1/search-switcher/blob/main/LICENSE)

Add links to each other in search engines. Including multiple search modes.

> 在常用的搜索引擎页面中添加互相切换的按钮。

## Screenshots

![image](<src/Screenshot 2024-05-29 at 17-01-05 cworld1 search-switcher - Google Search.png>)

![image](<src/Screenshot 2024-05-29 at 17-04-37 cworld1 search-switcher - Bing.png>)

![image](<src/Screenshot 2024-05-29 at 17-05-18 cworld1 search-switcher_百度搜索.png>)

## Download & Installnation

First you need a userscript extension on your desktop broswer, such as [Tampermonkey](https://www.tampermonkey.net/), [ScriptCat](https://github.com/scriptscat/scriptcat), [Violentmonkey](https://violentmonkey.github.io/), etc.

Then click the download button below:

[![Download](https://user-images.githubusercontent.com/74561130/137598555-649c77c7-1719-4aa3-8017-8b41283de730.png)](https://raw.githubusercontent.com/cworld1/search-switcher/main/search-switcher.user.js)

## Configs

If you need to edit the search supporting-list, you can edit script by yourself.

Config your sites like this:

```javascript
const sites = [
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
  // ...
];
```

But don't forget to add the `@include` domain to make sure it works.

## Contributions

To spend more time coding and less time fiddling with whitespace, this project uses code conventions and styles to encourage consistency. Code with a consistent style is easier (and less error-prone!) to review, maintain, and understand.

## License

This project is licensed under the GPL 3.0 License.
