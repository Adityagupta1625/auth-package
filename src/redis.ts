import redis from 'redis'

export const redisClient = async (connectionString: string): Promise<any> => {
  try {
    const client = redis.createClient({
      url: connectionString
    })

    await client.connect()
    return client
  } catch (e: any) {
    throw new Error(e)
  }
}
