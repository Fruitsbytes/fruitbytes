import { Fruit, FRUIT_FLAVORS, FRUIT_TYPES } from '../interfaces/fruits';
import {
  deleteEntities,
  getEntity,
  selectAllEntities, selectEntity,
  setEntities,
  updateEntities, upsertEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createStore, Store } from '@ngneat/elf';
import { debounceTime } from 'rxjs';
import { persistState } from '@ngneat/elf-persist-state';
import * as localForage from 'localforage';
import { dec2bin, text2Binary } from '../utils';

export const characterStore = createStore({ name: 'characters' }, withEntities<Character>());
export const playerStore = createStore({ name: 'auth' }, withEntities<Player>());

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'FruitsBytes',
  version: 1.0,
  storeName: 'auth',
});

export const persist = persistState(playerStore, {
  key: 'auth',
  storage: localForage as any,
  source: () => playerStore.pipe(debounceTime(1000)),
});


/**
 * try implement FlyWeight
 */

/**
 * Player , enemy ...
 */
export class Character {
  readonly id: PropertyKey;
  characterType: Partial<Fruit>;
  name?: string;

  constructor(obj: Partial<Character> = {}) {
    this.name = obj.name;
    this.characterType = obj.characterType || {};
    this.id = obj.id || <string>(crypto as any).randomUUID();
  }

  get store(): Store{
    return characterStore
  }

  get digiCode() {
    const selectedFruit = FRUIT_TYPES.indexOf(this.characterType?.type || 'Apple - Red Delicious');
    const selectedFlavor = FRUIT_FLAVORS.indexOf(this.characterType?.flavor || 'Fresh');
    return text2Binary(`${this.name}`.replace(/\s/g, '')) + dec2bin(selectedFruit * 10 + selectedFlavor);
  }

  static all() {
    return characterStore.pipe(selectAllEntities());
  }

  /**
   * Hydrate this character from ID. 🤯 YO Mr. Smith use to do that a lot in the Matrix on already hydrated sleeves (Altered Carbon)
   * @param id
   */
  static load(id: string) {
    const entity = characterStore.query(getEntity(id)); // TODO try/catch
    return new Character(entity);
  }

  static update(chars: Character[]) {
    characterStore.update(
      setEntities(chars), // TODO
    );
  }

  static delete(ids: string[]) {
    characterStore.update(deleteEntities(ids));
  }

  public update(data: Partial<Character>) {
    this.store.update(
      updateEntities(this.id, data),
    );
    return this;
  }

  public delete() {
    this.store.update(deleteEntities(this.id));
  }


  toJSON() {
    return (Object.getOwnPropertyNames(this) as Array<keyof this>).reduce((a: Partial<typeof this>, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}


export const PLAYER_STATUS = ['active', 'disabled'] as const;
export type PlayerStatus = typeof PLAYER_STATUS[number];

/**
 * user playing
 */
export class Player extends Character {
  status: PlayerStatus = 'active';
  data: {
    createdAt: Date;
    [key: string]: any
  };
  readonly playerID: string;
  readonly id: string;


  constructor(data: Partial<Player>) {
    super(data as Partial<Character>);
    this.id = '0';
    this.playerID = <string>(crypto as any).randomUUID();
    this.data = { createdAt: new Date, ...data.data };
    this.status = data.status || 'active';
  }

  static find() {
    return playerStore.query(
      getEntity('0'),
    );
  }

  get store(): Store{
    return playerStore
  }

  save(): Player {

    this.store.update(upsertEntities({ id: '0', ...this.toJSON() }));
    return this;
  }

  static get observable() {
    return playerStore.pipe(selectEntity('0'));
  }

}
