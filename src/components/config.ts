// Dependency-free (no drinksData.ts import — see templateKeys.ts for why: this is read by
// PotionCard/CharacterCard, which ScreenCarousel pulls into the client bundle).

// Per-item prices (PotionCard/CharacterCard corner badge) were replaced by a per-category price
// shown once near the screen title (see ScreenHeader) — flip this back to true to revert to
// per-item pricing without touching either card component.
export const SHOW_ITEM_PRICES = false;
