// ==UserScript==
// @name         Cool Papers Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 Cool Papers 搜索结果跳转 AlphaXiv / PDF
// @author       Cu_OH_2
// @match        https://papers.cool/arxiv/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=papers.cool
// ==/UserScript==

(function() {
    'use strict';

    function addEnhancements() {
        // 选中所有论文面板
        const papers = document.querySelectorAll('.panel.paper');

        papers.forEach(paper => {
            // 防止重复注入
            if (paper.querySelector('.enhanced-action-group')) return;

            // 直接从 ID 获取 arXiv ID
            const arxivId = paper.id;
            if (!arxivId || !/^\d{4}\.\d{4,5}$/.test(arxivId)) return;

            // 创建 arXiv ID 显示元素
            const p = document.createElement('p');
            p.id = `arxivid-${arxivId}`
            p.className = `metainfo arxivid`
            p.innerHTML = `<strong>arXiv ID: <a href="https://papers.cool/arxiv/${arxivId}"><span>${arxivId}</span></a></strong>`;

            // 插到日期信息后面，如果没有日期信息则放在最后
            const refP = paper.querySelector('.metainfo.date')
            if (refP) refP.after(p)
            else paper.appendChild(p);

            // 创建按钮容器
            const container = document.createElement('div');
            container.className = 'enhanced-action-group';
            container.style.cssText = `
                display: flex;
                gap: 8px;
                padding-top: 8px;
                padding-bottom: 8px;
            `;

            // 创建按钮
            const alphaBtn = createBtn('AlphaXiv', `https://www.alphaxiv.org/abs/${arxivId}`, '#e74c3c');
            const pdfBtn = createBtn('PDF', `https://arxiv.org/pdf/${arxivId}.pdf`, '#2980b9');
            container.appendChild(alphaBtn);
            container.appendChild(pdfBtn);

            // 插到 arXiv ID 后面
            p.after(container);
        });
    }

    // 辅助函数：创建按钮
    function createBtn(text, url, color) {
        const btn = document.createElement('a');
        btn.href = url;
        btn.target = '_blank';
        btn.innerText = text;
        btn.style.cssText = `
            display: inline-block;
            padding: 8px 15px;
            background: ${color};
            color: #fff;
            border-radius: 5px;
            font-size: 14px;
            text-decoration: none;
            font-weight: bold;;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            transition: opacity 0.2s;
        `;
        btn.onmouseover = () => btn.style.opacity = '0.8';
        btn.onmouseout = () => btn.style.opacity = '1';
        return btn;
    }

    // 只有当有节点增减时才触发，处理动态特性并减少性能开销
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