import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { XyoAboutMeResolver } from './about-me-resolver'
import { types } from './base-graphql-types'
import dotenvExpand from 'dotenv-expand'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION:'$npm_package_version',
      APP_NAME:'$npm_package_name'
    }
  })

  return process.env.APP_VERSION || 'Unknown'
}

export class XyoBaseGraphQlPlugin implements IXyoPlugin {
  public BASE_GRAPHQL_TYPES = types

  public getName(): string {
    return 'xyo-base-graphql'
  }

  public getProvides(): string[] {
    return ['BASE_GRAPHQL_TYPES']
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    if (!graphql) {
      throw new Error('Expecting GraphQl interface')
    }

    graphql.addType(types)
    graphql.addQuery('about: XyoAboutMe')
    graphql.addResolver('about', new XyoAboutMeResolver({
      version: getVersion(),
      ip: config.ip,
      name: config.name
    }))
    return true
  }
}

module.exports = new XyoBaseGraphQlPlugin()