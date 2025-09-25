import React, { useState, useEffect } from 'react';
import {
  LockConfig,
  SocialActionConfig,
  SocialPlatform,
  ContentType,
  LogoConfig,
} from '../types';
import { SocialIcon } from '../components/icons/SocialIcons';

// Helper object containing SVG strings for embedding in the standalone HTML
const socialIconSVGs: { [key in SocialPlatform]: string } = {
  [SocialPlatform.Facebook]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM16.5 12.06h-2.1v6.97h-2.8v-6.97h-1.4v-2.46h1.4v-1.7c0-1.4.87-2.17 2.1-2.17h1.8v2.46h-1.1c-.68 0-.81.32-.81.8v1.61h1.93l-.26 2.46z" /></svg>`,
  [SocialPlatform.TikTok]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.63-1.1-6.16-2.96-1.3-1.59-1.94-3.56-1.93-5.52.02-1.95 1.05-3.85 2.63-5.11 1.34-1.04 3.06-1.55 4.81-1.56v4.11c-.87.01-1.73.21-2.52.6-.43.21-.84.48-1.2.82-.23.21-.42.46-.57.73-.25.45-.38.97-.4 1.49-.01.48.04.96.14 1.42.15.71.49 1.38.99 1.91.73.78 1.78 1.18 2.83 1.13.9-.04 1.77-.43 2.38-1.1.5-.54.8-1.24.9-2.02.02-1.35.02-2.71.01-4.06.01-4.07.01-8.14.02-12.21z" /></svg>`,
  [SocialPlatform.YouTube]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.353c-.23-.84-.88-1.48-1.72-1.7C18.25 5.25 12 5.25 12 5.25s-6.25 0-7.862.403c-.84.22-1.49.86-1.72 1.7C2 8.96 2 12 2 12s0 3.04.418 4.647c.23.84.88 1.48 1.72 1.7C5.75 18.75 12 18.75 12 18.75s6.25 0 7.862-.403c.84-.22 1.49-.86 1.72-1.7C22 15.04 22 12 22 12s0-3.04-.418-4.647zM9.75 14.85V9.15l5.2 2.85-5.2 2.85z" /></svg>`,
  [SocialPlatform.Twitter]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>`,
  [SocialPlatform.Instagram]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.483.01-4.71.066-2.583.118-3.927 1.46-4.043 4.043-.056 1.226-.066 1.593-.066 4.71s.01 3.483.066 4.71c.117 2.583 1.46 3.927 4.043 4.043 1.227.056 1.594.066 4.71.066s3.483-.01 4.71-.066c2.583-.118 3.927-1.46 4.043-4.043.056-1.226.066-1.593.066-4.71s-.01-3.483-.066-4.71c-.117-2.583-1.46-3.927-4.043-4.043-1.227-.056-1.594-.066-4.71-.066zm0 2.88c-1.804 0-3.26 1.456-3.26 3.26s1.456 3.26 3.26 3.26 3.26-1.456 3.26-3.26-1.456-3.26-3.26-3.26zm0 5.32c-.935 0-1.69-.755-1.69-1.69s.755-1.69 1.69-1.69 1.69.755 1.69 1.69-.755 1.69-1.69 1.69zm4.72-6.57c-.55 0-.996.446-.996.996s.446.996.996.996.996-.446.996-.996-.446-.996-.996-.996z" /></svg>`,
  [SocialPlatform.Telegram]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.08l16.16-5.87c.72-.26 1.39.26 1.15.99l-2.67 12.58c-.28.85-1.02 1.05-1.72.63l-4.2-3.1-2.02 1.95c-.34.33-.62.61-.98.61z" /></svg>`,
  [SocialPlatform.WhatsApp]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.85L2 22l5.35-1.38c1.42.75 3.01 1.18 4.69 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.28-.14-1.65-.81-1.9-.91-.25-.09-.44-.14-.62.14-.18.28-.72.91-.88 1.1-.16.18-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.75-1.39-1.66-1.56-1.95-.16-.28-.01-.43.13-.57.13-.13.28-.32.41-.48.14-.16.18-.28.28-.46.09-.18.05-.37-.02-.51-.07-.14-.62-1.5-1.1-2.05-.47-.55-1.02-.47-1.17-.47-.14 0-.32-.01-.5-.01s-.46.07-.7.35c-.24.28-.93.9-1.14 2.2s.22 2.56.25 2.74c.03.18.93 1.44 2.26 2.53.33.27.63.49.95.66.62.33 1.09.43 1.48.35.48-.09 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.18-.53-.32z" /></svg>`,
  [SocialPlatform.Discord]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.32 3.38c-1.38-1-3.08-1.55-4.83-1.82-.12.44-.3.9-.53 1.38-1.5-.32-3.06-.32-4.57 0-.23-.48-.4-1-.53-1.38-1.75.27-3.45.8-4.83 1.82-2.3 3.1-2.9 6.2-2.73 9.4.9 1.08 2.07 1.9 3.44 2.52.48-.6.9-1.25 1.25-1.93-.43-.2-.84-.42-1.22-.68.1-.06.2-.13.3-.2.93.42 1.93.74 3.02.94a10.6 10.6 0 0 0 2.22-.02c1.1-.2 2.1-.52 3.02-.94.1.08.2.14.3.2-.38.26-.8.48-1.22.68.35.68.77 1.33 1.25 1.93 1.37-.62 2.54-1.44 3.44-2.52.27-3.3-1.13-6.5-2.73-9.4zM9.9 14.8c-.8 0-1.45-.67-1.45-1.5s.65-1.5 1.45-1.5 1.45.67 1.45 1.5-.65 1.5-1.45 1.5zm4.2 0c-.8 0-1.45-.67-1.45-1.5s.65-1.5 1.45-1.5 1.45.67 1.45 1.5-.65 1.5-1.45 1.5z" /></svg>`,
  [SocialPlatform.Website]: `<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
};

/**
 * Creates a full, standalone HTML document for the locker.
 * This includes the structure, styles (via CDN), and all necessary JavaScript logic.
 */
const createLockerHtml = (config: LockConfig): string => {
  // Basic HTML sanitation
  const escapeHtml = (unsafe: string) => 
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const escapedConfig: LockConfig = {
    ...config,
    title: escapeHtml(config.title),
    subtitle: config.subtitle ? escapeHtml(config.subtitle) : undefined,
    logo: config.logo ? { ...config.logo, value: config.logo.type === 'text' ? escapeHtml(config.logo.value) : config.logo.value } : undefined,
    actions: config.actions.map(a => ({...a, platform: escapeHtml(a.platform) as SocialPlatform}))
  };

  const configJsonString = JSON.stringify(escapedConfig);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapedConfig.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 dark:bg-gray-900">
    <div id="locker-root"></div>

    <script type="text/javascript">
        const config = ${configJsonString};
        const root = document.getElementById('locker-root');
        let actionStates = config.actions.map(action => ({ ...action, isClicked: false, isConfirmed: false }));
        const icons = ${JSON.stringify(socialIconSVGs)};

        const isUnlocked = () => actionStates.length === 0 || actionStates.every(a => a.isConfirmed);

        const getUnlockedHTML = () => {
          let contentHtml = '';
          if (config.contentType === '${ContentType.URL}') {
            contentHtml = \`
              <div class="text-center">
                <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Content Unlocked!</h3>
                <p class="mb-6 text-gray-600 dark:text-gray-400">You can now access the content.</p>
                <a
                  href="\${config.contentValue}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block px-8 py-3 text-lg font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition"
                >
                  Access Content
                </a>
              </div>
            \`;
          } else if (config.contentType === '${ContentType.Text}') {
            contentHtml = \`
              <div>
                <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Content Unlocked!</h3>
                <div 
                  class="p-4 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 prose dark:prose-invert max-w-none"
                >
                  \${config.contentValue}
                </div>
              </div>
            \`;
          }
          return \`
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
                    \${contentHtml}
                </div>
            </div>
            <style>.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }</style>
          \`;
        };

        const getLockedHTML = () => {
            const logoHtml = config.logo
                ? \`<div class="flex justify-center mb-6">
                    \${config.logo.type === 'text'
                        ? \`<h1 class="text-3xl font-bold tracking-wider">\${config.logo.value}</h1>\`
                        : \`<img src="\${config.logo.value}" alt="Logo" class="max-h-16 max-w-xs object-contain" />\`
                    }
                  </div>\`
                : '';

            const actionsHtml = actionStates.map(action => {
                if (action.isConfirmed) {
                    return \`
                        <div class="flex items-center justify-center px-4 py-3 text-base font-medium rounded-md bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                           <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                           Completed: \${action.platform}
                        </div>
                    \`;
                }
                return \`
                  <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      data-action-click-id="\${action.id}"
                      \${action.isClicked ? 'disabled' : ''}
                      class="w-full sm:flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition \${action.isClicked ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}"
                    >
                      \${icons[action.platform] || ''}
                      Visit \${action.platform}
                    </button>
                    \${action.isClicked ? \`
                      <button
                        data-action-confirm-id="\${action.id}"
                        class="w-full sm:w-auto px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Confirm
                      </button>
                    \` : ''}
                  </div>
                \`;
            }).join('');

            return \`
            <div class="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
              <div class="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
                \${logoHtml}
                <div class="text-center mb-6">
                  <h2 class="text-2xl sm:text-3xl font-bold">\${config.title}</h2>
                  \${config.subtitle ? \`<p class="mt-2 text-gray-600 dark:text-gray-400">\${config.subtitle}</p>\` : ''}
                </div>
                <div class="space-y-4">\${actionsHtml}</div>
              </div>
            </div>
            \`;
        };

        const render = () => {
            root.innerHTML = isUnlocked() ? getUnlockedHTML() : getLockedHTML();
        };

        root.addEventListener('click', (e) => {
            const actionButton = e.target.closest('[data-action-click-id]');
            if (actionButton && !actionButton.disabled) {
                const id = actionButton.dataset.actionClickId;
                const action = actionStates.find(a => a.id === id);
                if(action) {
                    window.open(action.url, '_blank', 'noopener,noreferrer');
                    action.isClicked = true;
                    render();
                }
            }

            const confirmButton = e.target.closest('[data-action-confirm-id]');
            if (confirmButton) {
                const id = confirmButton.dataset.actionConfirmId;
                const action = actionStates.find(a => a.id === id);
                if (action) {
                    action.isConfirmed = true;
                    render();
                }
            }
        });

        render();
    </script>
</body>
</html>
  `;
};


const GeneratorPage: React.FC = () => {
  const [title, setTitle] = useState('Complete actions to unlock');
  const [subtitle, setSubtitle] = useState('This content is locked. Perform the actions below to view it.');
  const [contentType, setContentType] = useState<ContentType>(ContentType.URL);
  const [contentValue, setContentValue] = useState('');
  const [actions, setActions] = useState<SocialActionConfig[]>([
    { id: Date.now().toString(), platform: SocialPlatform.Twitter, url: 'https://twitter.com/intent/follow?screen_name=google' }
  ]);
  const [useLogo, setUseLogo] = useState(false);
  const [logoType, setLogoType] = useState<'text' | 'url' | 'upload'>('text');
  const [logoValue, setLogoValue] = useState('My Brand');
  const [logoUploadError, setLogoUploadError] = useState('');

  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  // Update preview in real-time
  useEffect(() => {
    const currentConfig: LockConfig = {
      title,
      subtitle: subtitle || undefined,
      contentType,
      contentValue,
      actions,
      logo: useLogo && logoValue ? { type: logoType === 'text' ? 'text' : 'url', value: logoValue } : undefined,
    };
    const html = createLockerHtml(currentConfig);
    setPreviewHtml(html);
  }, [title, subtitle, contentType, contentValue, actions, useLogo, logoType, logoValue]);


  const handleAddAction = () => {
    setActions([...actions, { id: Date.now().toString(), platform: SocialPlatform.Facebook, url: '' }]);
  };

  const handleRemoveAction = (id: string) => { setActions(actions.filter(a => a.id !== id)); };

  const handleUpdateAction = (id: string, field: 'platform' | 'url', value: SocialPlatform | string) => {
    setActions(actions.map(a => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const handleLogoTypeChange = (type: 'text' | 'url' | 'upload') => {
    setLogoType(type);
    setLogoValue(type === 'text' ? 'My Brand' : '');
    setLogoUploadError('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoValue('');
    setLogoUploadError('');
    if (!file) return;
    const MAX_SIZE_KB = 50;
    if (file.size > MAX_SIZE_KB * 1024) {
      setLogoUploadError(`File is too large. Max size is ${MAX_SIZE_KB}KB.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Invalid file type. Please select an image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoValue(reader.result as string);
    reader.onerror = () => setLogoUploadError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const generate = () => {
    if (!title || !contentValue || actions.length === 0) {
      alert("Please fill in Title, Content, and at least one Action.");
      return;
    }

    const finalConfig: LockConfig = {
      title,
      subtitle: subtitle || undefined,
      contentType,
      contentValue,
      actions,
      logo: useLogo && logoValue ? { type: logoType === 'text' ? 'text' : 'url', value: logoValue } : undefined,
    };

    try {
      // Generate Link
      const jsonConfig = JSON.stringify(finalConfig);
      const base64Config = btoa(jsonConfig);
      const link = `${window.location.origin}${window.location.pathname}#/view/${base64Config}`;
      setGeneratedLink(link);

      // Generate Standalone HTML
      const html = createLockerHtml(finalConfig);
      setGeneratedHtml(html);

    } catch (e) {
      console.error("Failed to generate:", e);
      alert("There was an error generating the link/code. The uploaded logo might be too large.");
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    }, (err) => {
      alert(`Failed to copy ${type}.`);
    });
  };

  const downloadHtmlFile = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'locker.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Content Lock Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            {/* Main Details */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h2 className="text-xl font-semibold mb-4">1. Main Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">Title</label>
                  <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium">Subtitle (Optional)</label>
                  <input type="text" id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
              </div>
            </div>

            {/* Locked Content */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h2 className="text-xl font-semibold mb-4">2. Locked Content</h2>
              <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm font-medium">Content Type:</span>
                  <label className="flex items-center"><input type="radio" name="contentType" value={ContentType.URL} checked={contentType === ContentType.URL} onChange={() => setContentType(ContentType.URL)} className="form-radio" /> <span className="ml-2">URL</span></label>
                  <label className="flex items-center"><input type="radio" name="contentType" value={ContentType.Text} checked={contentType === ContentType.Text} onChange={() => setContentType(ContentType.Text)} className="form-radio" /> <span className="ml-2">Text / HTML</span></label>
              </div>
              <div>
                <label htmlFor="contentValue" className="block text-sm font-medium">Content {contentType === ContentType.URL ? 'URL' : 'Value'}</label>
                <textarea id="contentValue" value={contentValue} onChange={e => setContentValue(e.target.value)} placeholder={contentType === ContentType.URL ? 'https://example.com/download' : 'Your secret text or HTML code here'} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" rows={contentType === ContentType.Text ? 4 : 1}></textarea>
                {contentType === ContentType.Text && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300">
                        <p className="text-sm font-bold">Security Warning</p>
                        <p className="text-sm">Content entered here will be rendered as HTML. Avoid untrusted code.</p>
                    </div>
                )}
              </div>
            </div>

            {/* Logo */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h2 className="text-xl font-semibold mb-4">3. Customize Appearance (Optional)</h2>
              <div className="flex items-center mb-4">
                <input type="checkbox" id="useLogo" checked={useLogo} onChange={e => setUseLogo(e.target.checked)} className="form-checkbox" />
                <label htmlFor="useLogo" className="ml-2 block text-sm font-medium">Add a Brand Name or Logo</label>
              </div>
              {useLogo && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 flex-wrap">
                    <span className="text-sm font-medium">Type:</span>
                    <label className="flex items-center"><input type="radio" name="logoType" value="text" checked={logoType === 'text'} onChange={() => handleLogoTypeChange('text')} className="form-radio" /> <span className="ml-2">Brand Name</span></label>
                    <label className="flex items-center"><input type="radio" name="logoType" value="url" checked={logoType === 'url'} onChange={() => handleLogoTypeChange('url')} className="form-radio" /> <span className="ml-2">Logo from URL</span></label>
                    <label className="flex items-center"><input type="radio" name="logoType" value="upload" checked={logoType === 'upload'} onChange={() => handleLogoTypeChange('upload')} className="form-radio" /> <span className="ml-2">Upload Logo</span></label>
                  </div>
                  <div>
                    {logoType === 'text' && <input type="text" value={logoValue} onChange={e => setLogoValue(e.target.value)} placeholder='My Brand' className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />}
                    {logoType === 'url' && <input type="text" value={logoValue} onChange={e => setLogoValue(e.target.value)} placeholder='https://example.com/logo.png' className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />}
                    {logoType === 'upload' && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium">Upload Logo (max 50KB)</label>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100" />
                        {logoUploadError && <p className="mt-2 text-sm text-red-600">{logoUploadError}</p>}
                        {logoValue && logoType === 'upload' && <div className="mt-4 p-2 border border-gray-200 dark:border-gray-600 rounded-md inline-block"><p className="text-sm mb-2">Preview:</p><img src={logoValue} alt="Logo Preview" className="max-h-24" /></div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Social Actions */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h2 className="text-xl font-semibold mb-4">4. Social Actions</h2>
              <div className="space-y-4">
                {actions.map(action => (
                  <div key={action.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <SocialIcon platform={action.platform} className="w-6 h-6 text-gray-500" />
                    <select value={action.platform} onChange={e => handleUpdateAction(action.id, 'platform', e.target.value as SocialPlatform)} className="block w-48 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                      {Object.values(SocialPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="text" placeholder="https://..." value={action.url} onChange={e => handleUpdateAction(action.id, 'url', e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    <button onClick={() => handleRemoveAction(action.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddAction} className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">+ Add Action</button>
            </div>

            <div className="text-center pt-4">
              <button onClick={generate} className="w-full sm:w-auto px-10 py-3 text-lg font-semibold rounded-md text-white bg-green-600 hover:bg-green-700">Generate</button>
            </div>
          </div>
          
          {/* Right Column: Preview and Output */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-center mb-4">Live Preview</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md aspect-[9/16] sm:aspect-video lg:aspect-[9/16] w-full">
                <iframe
                  srcDoc={previewHtml}
                  title="Locker Preview"
                  className="w-full h-full border-0 rounded-lg"
                  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                ></iframe>
              </div>
            </div>

            {generatedLink && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-semibold">Your locker is ready!</h3>
                {/* Link */}
                <div>
                  <label className="block text-sm font-medium">Shareable Link</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input type="text" readOnly value={generatedLink} className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    <button onClick={() => copyToClipboard(generatedLink, 'Link')} className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Copy</button>
                  </div>
                </div>
                {/* Standalone File */}
                <div>
                  <label className="block text-sm font-medium">Standalone File</label>
                  <div className="flex items-center space-x-2 mt-1">
                     <button onClick={() => copyToClipboard(generatedHtml, 'HTML Code')} className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">Copy HTML</button>
                     <button onClick={downloadHtmlFile} className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">Download as .html</button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
