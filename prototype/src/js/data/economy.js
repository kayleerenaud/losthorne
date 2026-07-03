// DATA: prices & anchors (DESIGN.md §6). The ONLY place a price may be written.
export const PRICES = {
  item_bread: 10,
  item_potion: 100,
  item_sword: 200,
  item_bow: 100,
  item_arrows: 80,   // pack of 10 (pack size = placeholder guess, not spec'd)
};
export const ANCHORS = { horse:500, best_sword:300, small_hammer:100 }; // future pricing reference
export const STARTING_COINS = 50;
