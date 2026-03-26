// ==UserScript==
// @name         arXiv Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 arXiv abs 页面跳转 Cool Papers / AlphaXiv
// @author       Cu_OH_2
// @match        https://arxiv.org/abs/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// ==/UserScript==

(function() {
    'use strict';

    function addEnhancements() {
        // 防止重复注入
        if (document.querySelector('.enhanced-buttons-container')) return;

        // 从当前 URL 提取 arXiv ID
        const logolink = window.location.pathname;
        const arxivIdMatch = logolink.match(/\/abs\/(\d{4}\.\d{4,5}(v\d+)?)/);
        if (!arxivIdMatch) return;
        const arxivId = arxivIdMatch[1];

        // 找到右侧的下载列表容器
        const downloadSection = document.querySelector('.full-text');
        if (!downloadSection) return;

        // 创建按钮容器
        const container = document.createElement('div');
        container.className = 'enhanced-buttons-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
            margin-bottom: 4px;
            padding: 10px;
            background: #f4f4f4;
            border-radius: 5px;
            border: 1px solid #ddd;
        `;

        // 添加一个微型标题
        const title = document.createElement('div');
        title.innerText = 'Quick Links';
        title.style.cssText = 'text-align: center; font-size: 12px; font-weight: bold; color: #555; margin-bottom: 4px;';
        container.appendChild(title);

        // 创建并添加按钮
        const coolBtn = createBtn('Cool Paper', `https://papers.cool/arxiv/${arxivId}`, '#27ae60'); // 绿色
        const alphaBtn = createBtn('AlphaXiv', `https://www.alphaxiv.org/abs/${arxivId}`, '#e74c3c'); // 红色

        container.appendChild(coolBtn);
        container.appendChild(alphaBtn);

        // 插入到页面
        downloadSection.appendChild(container);
    }

    // 辅助函数：创建按钮
    function createBtn(text, url, color) {
        const btn = document.createElement('a');
        btn.href = url;
        btn.target = '_blank';
        btn.innerText = text;
        btn.style.cssText = `
            display: block;
            padding: 6px 12px;
            background: ${color};
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            text-decoration: none;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            transition: opacity 0.2s;
        `;
        btn.onmouseover = () => btn.style.opacity = '0.8';
        btn.onmouseout = () => btn.style.opacity = '1';
        return btn;
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                addEnhancements();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    addEnhancements();
})();