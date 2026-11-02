# 8-bit Two-stroke

Static website for `8b2t.com`. The original homepage is unchanged.

## Leeen

The main page is `/leeen/`, with `#faq`, `#support`, and `#privacy` jump links.
Standalone pages also work at `/leeen/faq/`, `/leeen/support/`, and
`/leeen/privacy/`. The privacy and support paths match the app’s existing links.

Edit `src/leeen.html` for content and Tailwind classes. All four pages are
generated from this single template, so their content stays consistent.
Edit `src/leeen-config.json` for the helpdesk URLs, developer name, and policy date.

```sh
npm ci
npm run build
npm run preview
```

Preview at `http://127.0.0.1:8080/leeen/`. Commit the generated `leeen/` HTML and CSS
with source changes; GitHub Pages can serve them without a build step. There is
no client-side JavaScript or CDN dependency.

## Before App Store submission

The helpdesk is intentionally pending. Add a working public `helpdeskUrl` and
the provider’s `helpdeskPrivacyUrl`, review the provider’s actual data practices,
and rebuild. Pages remain `noindex` until both URLs are configured. This is an
indexing hint, not an access restriction. Test submitting a support or privacy
request through the helpdesk before release.

Confirm the policy’s developer identity and data practices against the shipping
app and App Store privacy answers. The current draft reflects the app source
reviewed on November 2, 2026. Publish the generated pages before using these URLs:

- Marketing: `https://8b2t.com/leeen/`
- Support: `https://8b2t.com/leeen/support/`
- Privacy policy: `https://8b2t.com/leeen/privacy/`

Apple requires a public privacy policy, an easily accessible policy link inside
the app, and working support contact information. See
[App Review Guidelines §5.1.1](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)
and the [Support URL requirements](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information).
