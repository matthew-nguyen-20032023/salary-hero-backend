import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import { EventEmit } from "src/socket/socket-server.const";

export class SocketEmitter {
  private static instance: SocketEmitter;
  private emitter;

  constructor() {
    const redisClient = createClient({
      // @ts-ignore
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    redisClient.connect().then();
    this.emitter = new Emitter(redisClient);
  }

  public static getInstance(): SocketEmitter {
    if (!this.instance) {
      this.instance = new SocketEmitter();
    }
    return this.instance;
  }

  /**
   * @description for emit order book by pair
   * @param orderBook
   * @param pairId
   */
  // public emitOrderBookByPairId(orderBook: IOrderBook, pairId: string): void {
  //   this.emitter.emit(`${EventEmit.OrderBookByPair}_${pairId}`, orderBook);
  // }
}
