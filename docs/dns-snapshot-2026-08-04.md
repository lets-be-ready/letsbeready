# letsbeready.org — DNS snapshot before the Vercel → Netlify cutover

Captured 2026-08-04, ~4:56 PM ET, immediately before editing the zone at Wix.
Every value below is from a live `dig` against the authoritative nameservers,
so it is complete (the Wix UI truncates the DKIM values).

**Registrar:** GoDaddy (renews 2026-12-10, locked account)
**Nameservers:** `ns8.wixdns.net`, `ns9.wixdns.net` — Wix hosts the zone only; it does not host the site.
**Mail:** Google Workspace (inbound) + Brevo (sending). None of it is affected by the two web records.

## Changed in this cutover

| Type | Host | Before | After |
|---|---|---|---|
| A | `letsbeready.org` | `76.76.21.21` (Vercel) | `75.2.60.5` (Netlify) |
| CNAME | `www.letsbeready.org` | `cname.vercel-dns.com` | `letsbeready2.netlify.app` |

**To roll back:** restore the two "Before" values. Nothing else in the zone was touched.
The Vercel deployment stays live throughout, so the rollback is just these two rows.

## Untouched — do not edit (all mail)

| Type | Host | Value |
|---|---|---|
| MX | `letsbeready.org` | `10 aspmx.l.google.com.` |
| MX | `letsbeready.org` | `20 alt1.aspmx.l.google.com.` |
| MX | `letsbeready.org` | `30 alt2.aspmx.l.google.com.` |
| MX | `letsbeready.org` | `40 alt3.aspmx.l.google.com.` |
| MX | `letsbeready.org` | `50 alt4.aspmx.l.google.com.` |
| CNAME | `brevo1._domainkey` | `b1.letsbeready-org.dkim.brevo.com.` |
| CNAME | `brevo2._domainkey` | `b2.letsbeready-org.dkim.brevo.com.` |
| TXT | `letsbeready.org` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `letsbeready.org` | `brevo-code:cf1f4ec646c546fe16c97cef276c3f97` |
| TXT | `letsbeready.org` | `google-site-verification=_tK_pr7kFM7kyGftmmB7nt5LPZ5aFOwM1XDlywQWUYc` |
| TXT | `letsbeready.org` | `2048` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

The bare `2048` TXT is a malformed leftover (almost certainly a truncated DKIM key).
It does nothing. Leave it — removing it is unrelated cleanup and not worth the risk today.

No other subdomains resolve: checked `mail`, `ftp`, `autodiscover`, `_domainconnect`,
`blog`, `shop`, `calendar` — all empty.

## Traps

- **Never click Wix's "Try Again" / reconnect banner.** It rewrites the zone to point at Wix.
- **Never accept Netlify's "Use Netlify DNS" nameserver offer.** It moves authority off Wix,
  and every mail record above disappears unless recreated by hand.
- The two `brevo*._domainkey` rows live in the CNAME section but are mail, not web.
