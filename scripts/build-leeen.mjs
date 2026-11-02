import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const template = await readFile(new URL('src/leeen.html', root), 'utf8');
const config = JSON.parse(await readFile(new URL('src/leeen-config.json', root), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

for (const key of ['helpdeskUrl', 'helpdeskPrivacyUrl']) {
  if (config[key] && new URL(config[key]).protocol !== 'https:') {
    throw new Error(`Use a public HTTPS URL for ${key}.`);
  }
}
const supportReady = Boolean(config.helpdeskUrl && config.helpdeskPrivacyUrl);

function section(name) {
  const match = template.match(new RegExp(`<!-- section:${name}:start -->([\\s\\S]*?)<!-- section:${name}:end -->`));
  if (!match) throw new Error(`Missing section: ${name}`);
  return match[1];
}

const pages = [
  { path: '', title: 'Leeen — FAQs, support & privacy', description: 'Leeen for iPhone. Find answers, get help, and read our privacy policy.' },
  { path: 'privacy/', title: 'Privacy policy — Leeen', description: 'How Leeen uses motion, location, photos, purchases, and support information.', sections: ['privacy'] },
  { path: 'support/', title: 'Help & contact — Leeen', description: 'Get help with Leeen, find answers, or make a privacy request.', sections: ['support', 'faq'] },
  { path: 'faq/', title: 'FAQs — Leeen', description: 'Answers to common questions about using Leeen for iPhone.', sections: ['faq'] },
];

for (const page of pages) {
  let html = template;
  if (page.sections) {
    let content = page.sections.map(section).join('\n');
    const firstHeading = `${page.sections[0]}-title`;
    content = content.replace(new RegExp(`<h2( id="${firstHeading}"[^>]*)>(.*?)</h2>`), '<h1$1>$2</h1>');
    html = html.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/, (_, open, close) => `${open}${content}\n    ${close}`);
  }
  const values = {
    TITLE: escape(page.title),
    DESCRIPTION: escape(page.description),
    CANONICAL: `https://8b2t.com/leeen/${page.path}`,
    DEVELOPER: escape(config.developerName),
    POLICY_DATE: escape(config.policyDate),
    POLICY_DATE_LABEL: new Date(`${config.policyDate}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    ROBOTS: supportReady ? '' : '<meta name="robots" content="noindex">',
    HELPDESK_LINK: config.helpdeskUrl
      ? `<a href="${escape(config.helpdeskUrl)}" class="underline">Open the Leeen helpdesk</a>`
      : '<span class="text-neutral-600 dark:text-neutral-400">Helpdesk coming soon. Contact information will be added here before release.</span>',
    HELPDESK_PRIVACY: supportReady
      ? `Our helpdesk service also processes information you submit to deliver support. See the <a href="${escape(config.helpdeskPrivacyUrl)}" class="underline">helpdesk provider’s privacy policy</a>. Any service provider handling support information on our behalf must protect it consistently with this policy and applicable law.`
      : 'Our helpdesk is not yet available. We will add the provider’s privacy information here before accepting support requests.',
  };
  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_, name) => {
    if (!(name in values)) throw new Error(`Unknown template value: ${name}`);
    return values[name];
  });
  const directory = new URL(`leeen/${page.path}`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
  console.log(`Built /leeen/${page.path}`);
}
if (!supportReady) {
  console.warn('Draft: add the public helpdesk URL and provider privacy URL before App Store submission. Pages remain noindex until both are configured.');
}
