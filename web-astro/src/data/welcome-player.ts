// Default profile used by the welcome page. Replaces the Stencil app's
// character-selection / login flow which the user removed as friction.

export interface PlayerProfile {
  name: string;
  digiCode: string;
  characterType: {
    flavor: string;
    type: string;
  };
}

export const DEFAULT_PLAYER: PlayerProfile = {
  name: 'Jeffrey N. Carré',
  digiCode: 'AB1C-2D3E-4F5G-6H7I-8J9K',
  characterType: {
    flavor: 'Fresh',
    type: 'Apple - Red Delicious',
  },
};
