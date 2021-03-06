import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'
import ClientServiceBase from '@services/ClientServiceBase'
import UserAccountService from '@services/UserAccountService'
import crypto from 'crypto'

class ClientService extends ClientServiceBase {
  public async createClient(data: IClient): Promise<ClientInstance> {
    if (!data.secret) {
      data.secret = crypto.randomBytes(32).toString('hex')
    }
    return super.createClient(data)
  }

  public async getClientByclient_id(client_id: number): Promise<ClientInstance | null> {
    const client = await super.getClientByclient_id(client_id)
    if (client) {
      delete client.secret
    }
    return client
  }

  public async validateClient(client_id: number, secret: string): Promise<ClientInstance | null> {
    const client = await super.getClientByclient_idWithSensitiveData(client_id)
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
}

export default new ClientService()
