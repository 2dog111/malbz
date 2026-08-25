# Project Rules

- Keep loaded raster image assets at or below 700 KB. Prefer AVIF/WebP with a lightweight fallback when transparency is needed.
- For `mal.bz`, Cloudflare is no longer part of deployment or DNS operations because the domain nameservers were moved away from Cloudflare. Use the GitHub repository and our server as the active publishing path unless the user gives a new explicit instruction.
- Do not rewrite user-supplied offer copy. Preserve wording, punctuation, casing, numbers, and currency notation unless the user explicitly asks to edit the text.
- Keep brand/logo visuals niche-neutral because the site will host offers across different business categories.
- Offer cards should share a coherent visual system, but they do not need to be the same height or size. Let longer offers have larger cards when the copy needs more room.
- Keep offer cards vertical. On desktop, show two tight masonry-like columns; on mobile, show one card per row/screen. Do not create large gaps between cards, and do not make offer cards span full width unless explicitly requested.
- Add new offer cards to the bottom of the existing offer list by default, preserving the order in which the user provides them.
- Do not use bold or heavy font weights by default. Keep typography light or regular unless the user explicitly asks to make a specific part bold.
- Treat the offer title/product name as the main attention point in each offer card. Make it roughly twice the size of the card body copy, keep the font weight light/regular rather than bold, use balanced wrapping, and add a restrained visual accent such as a compact bordered icon tile, thin accent line, or small neutral label instead of relying on heavy type.
- For offer-card icons, crop away unused margins or fake transparency backgrounds, resize source assets to about 320 px on the longest side for retina display, and save as optimized WebP when transparency is not required. Keep displayed icons in compact bordered tiles that match the existing offer-card visual system.
