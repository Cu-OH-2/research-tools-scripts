// ==UserScript==
// @name         Google Scholar Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 Google Scholar 搜索结果跳转到 Cool Papers / Alphaxiv / PDF
// @author       Cu_OH_2
// @match        https://scholar.google.com/scholar?*
// @match        https://scholar.google.com.hk/scholar?*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scholar.google.com
// ==/UserScript==

(function() {
    'use strict';

    function addEnhancements() {
        // 选中所有搜索结果条目
        const results = document.querySelectorAll('.gs_r.gs_or.gs_scl');

        results.forEach(result => {
            // 防止重复注入
            if (result.querySelector('.enhanced-buttons-container')) return;

            // 从右侧链接或标题链接中提取 arXiv ID
            const links = result.querySelectorAll('a');
            let arxivId = null;
            for (let link of links) {
                const match = link.href.match(/arxiv\.org\/(abs|pdf)\/(\d{4}\.\d{4,5}(v\d+)?)/);
                if (match) { arxivId = match[2]; break; }
            }

            if (arxivId) {
            // 创建按钮容器
                const container = document.createElement('div');
                container.className = 'enhanced-buttons-container';
                container.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-top: 10px;
                    width: fit-content;
                `;

                // 创建按钮
                const coolBtn = createBtn('Cool Papers', `https://papers.cool/arxiv/${arxivId}`, '#27ae60'); // 绿色
                const alphaBtn = createBtn('AlphaXiv', `https://www.alphaxiv.org/abs/${arxivId}`, '#e74c3c'); // 红色
                const downloadBtn = createBtn('PDF', `https://arxiv.org/pdf/${arxivId}.pdf`, '#2980b9'); // 蓝色

                container.appendChild(coolBtn);
                container.appendChild(alphaBtn);
                container.appendChild(downloadBtn);

                // 插入到操作栏
                const footer = result.querySelector('.gs_fl');
                if (footer) footer.appendChild(container);
            }
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
            padding: 3px 9px;
            background: ${color};
            color: #fff;
            border-radius: 3px;
            font-size: 10px;
            line-height: 1.2;
            text-decoration: none;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            white-space: nowrap;
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