import Actor from "./Actor";
import Dialogue from "@/ui/Dialogue";
import MissingDataError from "@/error/MissingDataError";
import Vector from "@common/Vector";
import { Drawable, Eventful, CallableMap } from "@/interfaces";
import { bus } from "@/EventBus";

/**
 * A non-playable character
 */
class NonPlayer extends Actor implements Eventful, Drawable {
  /**
   * Entities that were recently collided with
   */
  private collisions: Actor[] = [];

  /**
   * Create a new NonPlayer instance
   *
   * TODO: handle sprites when they are available
   *
   * @param data - info about the non-player
   */
  constructor(data: any) {
    super(
      new Vector(data.x, data.y),
      new Vector(data.width, data.height),
      data
    );

    this.resolveState(`nonPlayers.${this.id}`);

    bus.register(this);
  }

  /**
   * Update the non-player
   *
   * @param dt - delta time
   */
  public update(dt: number) {
    if (this.dialogue?.done) {
      this.dialogue = null;
    } else if (this.dialogue) {
      this.dialogue.update(dt);
    }
  }

  /**
   * Draw NPC and all underlying entities
   *
   * @param ctx        - render context
   * @param offset     - render position offset
   * @param resolution - render resolution
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    offset: Vector,
    resolution: Vector
  ) {
    if (this.dialogue) {
      this.dialogue.draw(ctx, offset, resolution);
    }
  }

  /**
   * Register events with the event bus
   *
   * @return events to register
   */
  public register(): CallableMap {
    return {
      keyup: (e: KeyboardEvent) => {
        if (e.key === "Enter" && this.collisions.length) {
          this.speak([...this.collisions]);
        }
      },

      "player.move": (e: CustomEvent) => {
        const player = e.detail?.player;

        if (!player) {
          throw new MissingDataError(
            "Player missing on player.move event as tracked by non-player."
          );
        }

        if (this.collidesWith(player)) {
          if (!this.collisions.includes(player)) {
            this.collisions.push(player);
          }
        } else if (this.collisions.includes(player)) {
          this.collisions = this.collisions.filter((actor) => actor !== player);
        }
      },
    };
  }

  /**
   * Start a dialogue with all actors the non-player has collided with
   *
   * @param actors - actors recently collided with
   */
  private speak(actors: Actor[]) {
    if (this.dialogue) {
      return;
    }

    this.dialogue = new Dialogue(this.data.speech, this, actors);
  }
}

export default NonPlayer;
