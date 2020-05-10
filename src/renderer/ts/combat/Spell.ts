import CombatStrategy from "./CombatStrategy";
import { bus } from "@/EventBus";

/**
 * Data required to instantiate a spell
 *
 * @type {SpellTemplate}
 */
type SpellTemplate = {
  displayAs: string;
  description: string;
  value: number;
  special: boolean;
};

/**
 * Spells are techniques used by the player to deal damage against an entity
 */
class Spell extends CombatStrategy {
  /**
   * Whether the spell deals special damage
   *
   * @prop {boolean} _special
   */
  private _special: boolean;

  /**
   * Create a new Spell instance
   *
   * @param {SpellTemplate} template Spell data
   */
  constructor(template: SpellTemplate) {
    super(template);

    this._special = template.special;
  }
}

export default Spell;