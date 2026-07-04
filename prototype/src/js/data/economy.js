// DATA: prices & anchors (DESIGN.md §6). The ONLY place a price may be written.
export const PRICES = {
  item_rod: 25,          // price = placeholder guess
  item_hook_basic: 10,   // small fish
  item_hook_fine: 40,    // chance of BIG fish
  item_bread: 10,
  item_potion: 100,
  item_sword: 200,
  item_bow: 100,
  item_arrows: 80,   // pack of 10 (pack size = placeholder guess, not spec'd)
  item_turkey: 15,   // price = placeholder guess (restores 1.5 hearts vs bread's 1 at 10)
};
export const ANCHORS = { horse:500, best_sword:300, small_hammer:100 }; // future pricing reference
export const SELL_PRICES = { item_wild_turkey: 15, item_fish_small: 8, item_fish_big: 20, item_pearl: 18 };  // fish/pearl prices = placeholder guesses
export const STARTING_COINS = 10;  // just enough for one loaf of bread
