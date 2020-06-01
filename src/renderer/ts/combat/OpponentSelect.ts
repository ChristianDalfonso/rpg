import Actor from "@/actors/Actor";
import Team from "./Team";
import Vector from "@common/Vector";
import { Eventful, CallableMap, Drawable, Lockable } from "@/interfaces";
import { bus } from "@/EventBus";

/**
 * A tool to select which opponent to attack
 *
 * This class allows members of a team to be traversed and targeted for combat.
 * It draws an arrow above their sprite as an indicator.
 */
class OpponentSelect implements Eventful, Drawable, Lockable {
  /**
   * Currently selected index of the opponents
   */
  private _index: number = 0;

  /**
   * If this selection is locked from changing
   */
  private _locked: boolean = true;

  /**
   * Create a new OpponentSelect instance
   *
   * @param _opponents - opponent team members
   */
  constructor(private _opponents: Team) {
    bus.register(this);
  }

  /**
   * Get the locked state of the selection
   */
  get isLocked(): boolean {
    return this._locked;
  }

  /**
   * Get the currently selected opponent
   */
  get selected(): Actor {
    return this._opponents.all()[this._index];
  }

  /**
   * Register events with the event bus
   *
   * @return events to register
   */
  public register(): CallableMap {
    return {
      keyup: (e: KeyboardEvent) => {
        if (this._locked) {
          return;
        }

        switch (e.key) {
          case "ArrowRight":
            return this._next();

          case "ArrowLeft":
            return this._previous();
        }
      },
    };
  }

  /**
   * Draw opponent select arrow
   *
   * @param ctx         - render context
   * @param offset      - render position offset
   * @param _resolution - render resolution
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    offset: Vector,
    _resolution: Vector
  ) {
    const fontOffset = new Vector(17, -36);
    const position = this.selected.position.plus(offset).plus(fontOffset);

    ctx.save();

    ctx.translate(position.x, position.y);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.font = "42px Minecraftia";
    ctx.fillStyle = "#0DD";
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "#333";
    ctx.fillText("➧", 0, 0);

    ctx.restore();
  }

  /**
   * Lock the selection
   *
   * @return if the lock succeeded
   */
  public lock(): boolean {
    this._locked = true;
    return true;
  }

  /**
   * Unlock the selection
   *
   * @return if the unlock succeeded
   */
  public unlock(): boolean {
    this._locked = false;
    return true;
  }

  /**
   * Switch to the next selection
   */
  private _next() {
    if (this._index === this._opponents.length - 1) {
      this._index = 0;
    } else {
      this._index++;
    }
  }

  /**
   * Switch to the previous selection
   */
  private _previous() {
    if (this._index === 0) {
      this._index = this._opponents.length - 1;
    } else {
      this._index--;
    }
  }
}

export default OpponentSelect;
