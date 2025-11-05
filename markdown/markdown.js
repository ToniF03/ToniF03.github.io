/**
 * Simple Markdown Embed Script
 * Automatically loads markdown files into elements with data-markdown attribute
 */

(function() {
    'use strict';

    /**
     * Render markdown text to HTML
     */
    function renderMarkdown(markdown) {
        let html = markdown;
        
        // Code blocks (```language ... ```)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Images ![alt](url) - process before links
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
        
        // Links with double brackets [[text]](url) - handle before single bracket links
        html = html.replace(/\[\[([^\]]+)\]\]\(([^)]+)\)/g, (match, text, url) => {
            const isExternal = url.startsWith('http') || url.startsWith('//');
            const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${url}"${target}>${text}</a>`;
        });
        
        // Links [text](url) - process before headers
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            const isExternal = url.startsWith('http') || url.startsWith('//');
            const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${url}"${target}>${text}</a>`;
        });
        
        // Headers (# ## ### #### ##### ######)
        html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Bold (**text** or __text__)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic (*text* or _text_) - be careful not to match bold
        html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+?)_/g, '<em>$1</em>');
        
        // Strikethrough (~~text~~)
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
        
        // Task lists (- [ ] and - [x])
        html = html.replace(/^- \[ \] (.+)$/gm, '<li class="task-item"><input type="checkbox" disabled> $1</li>');
        html = html.replace(/^- \[x\] (.+)$/gim, '<li class="task-item"><input type="checkbox" checked disabled> $1</li>');
        
        // Unordered lists (- or * at start of line)
        html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in <ul>
        html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');
        
        // Ordered lists (1. 2. etc)
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        
        // Blockquotes (> text)
        html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Horizontal rules (--- or ***)
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/^\*\*\*$/gm, '<hr>');
        
        // Line breaks (two spaces at end of line)
        html = html.replace(/  \n/g, '<br>\n');
        
        // Paragraphs (double line break)
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs and fix nesting
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ol>)/g, '$1');
        html = html.replace(/(<\/ol>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)/g, '$1');
        html = html.replace(/(<hr>)<\/p>/g, '$1');
        
        return html;
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Load and render markdown from URL into element
     */
    async function loadMarkdown(element, url) {
        try {
            element.innerHTML = '<p style="color: var(--main-fg-color); opacity: 0.6;">Loading...</p>';
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdown = await response.text();
            const html = renderMarkdown(markdown);
            
            element.innerHTML = html;
            element.classList.add('markdown-content');
            
        } catch (error) {
            console.error('Error loading markdown:', error);
            element.innerHTML = `<p style="color: #d73a49;">Error loading markdown: ${error.message}</p>`;
        }
    }

    /**
     * Initialize all elements with data-markdown attribute
     */
    function init() {
        const elements = document.querySelectorAll('[data-markdown]');
        elements.forEach(element => {
            const url = element.getAttribute('data-markdown');
            if (url) {
                loadMarkdown(element, url);
            }
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-run init when called (useful for dynamically loaded content)
    window.initMarkdown = init;
})();
