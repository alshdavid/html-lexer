export class Index<U extends string, T> {
  readonly tokens: { [K in keyof Record<U, T>]: K }
  
  #tokens: Map<U, T>
  #values: Map<T, U>

  constructor(initial: Record<U, T>) {
    this.#tokens = new Map()
    this.#values = new Map()

    for (const [token, value] of Object.entries(initial)) {
      // @ts-expect-error
      this.#tokens.set(token, value)
      // @ts-expect-error
      this.#values.set(value, token)
      // @ts-expect-error
      this.tokens[token] = token
    }

    // @ts-expect-error
    this.tokens = Object.freeze(this.tokens)
  }

  getByToken(token: U): T | undefined {
    return this.#tokens.get(token)
  }

  getByValue(value: T): U | undefined {
    return this.#values.get(value)
  }
}
