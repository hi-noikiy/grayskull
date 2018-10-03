import Promise from 'bluebird'
import db from '../../data'
import { ClientInstance } from '../../data/models/Client'
import { IClient } from '../../data/models/IClient'

export default class ClientServiceBase {
  public createClient(data: IClient): Promise<ClientInstance> {
    return db.Client.create(data, { returning: true, raw: true })
  }

  public deleteClientByclientId(clientId: number): Promise<number> {
    return db.Client.destroy({
      where: {
        clientId
      }
    })
  }

  public getClientByclientId(clientId: number): Promise<ClientInstance | null> {
    return db.Client.findOne({
      where: {
        clientId
      },
      raw: true
    })
  }

  public updateClientByclientId(data: IClient, clientId: number): Promise<ClientInstance | null> {
    return db.Client.update(data, {
      where: {
        clientId
      },
      returning: true,
      plain: true,
      raw: true
    })
  }
}
