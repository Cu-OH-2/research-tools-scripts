// ==UserScript==
// @name         HuggingFace Papers Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 HuggingFace 论文页面跳转 Cool Papers / AlphaXiv
// @author       Cu_OH_2
// @match        https://huggingface.co/papers/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// ==/UserScript==

(function() {
    'use strict';

    function addEnhancements() {
        // 1. 防止重复注入
        if (document.querySelector('.enhanced-link-btn')) return;

        // 2. 获取 arXiv ID
        const path = window.location.pathname;
        const arxivIdMatch = path.match(/\/papers\/(\d{4}\.\d{4,5})/);
        if (!arxivIdMatch) return;
        const arxivId = arxivIdMatch[1];

        // 3. 寻找按钮容器
        const container = document.querySelector('div.flex.flex-wrap.gap-2.py-6');
        if (!container) return;

        // 4. 定义按钮配置
        const buttons = [
            {
                text: 'AlphaXiv',
                url: `https://www.alphaxiv.org/abs/${arxivId}`,
                svg: '<path d="M18 6l-1.4 1.4l7.5 7.6H3v2h21.1l-7.5 7.6L18 26l10-10z" fill="currentColor"></path>'
            },
            {
                text: 'Cool Papers',
                url: `https://papers.cool/arxiv/${arxivId}`,
                svg: '<path d="M18 6l-1.4 1.4l7.5 7.6H3v2h21.1l-7.5 7.6L18 26l10-10z" fill="currentColor"></path>'
            }
        ];

        // 5. 循环创建并插入按钮
        buttons.forEach(btnInfo => {
            const a = document.createElement('a');
            // 使用页面原生的类名组合
            a.className = 'btn inline-flex h-9 items-center enhanced-link-btn';
            a.href = btnInfo.url;
            a.target = '_blank';

            // 构造内部 HTML
            a.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" class="-rotate-45 mr-2">
                    ${btnInfo.svg}
                </svg>
                ${btnInfo.text}
            `;
            // 插入最前面
            container.prepend(a);
        });
    }

    // 处理单页应用路由切换
    const observer = new MutationObserver(() => {
        addEnhancements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    addEnhancements();
})();