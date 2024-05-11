
function hexToBinary(hexString: string): string {
  return hexString.split('').map(hexChar => {
    return parseInt(hexChar, 16).toString(2).padStart(4, '0');
  }).join('');
 }
 
 
 function generateRandomBinary(length: number): string {
  let binaryString = '';
  for (let i = 0; i < length; i++) {
    binaryString += Math.round(Math.random()).toString();
  }
  return binaryString;
 }
 
 
 function binaryToHex(binaryString: string): string {
  let hexString = '';
  for (let i = 0; i < binaryString.length; i += 4) {
    hexString += parseInt(binaryString.substring(i, i + 4), 2).toString(16);
  }
  return hexString;
 }
 
// Core interfaces
import {
    createAgent,
    IDIDManager,
    IResolver,
    IDataStore,
    IDataStoreORM,
    IKeyManager,
    ICredentialPlugin,
  } from '@veramo/core'
  
  // Core identity manager plugin
  import { DIDManager } from '@veramo/did-manager'
  
  // Ethr did identity provider
  import { EthrDIDProvider } from '@veramo/did-provider-ethr'
  
  // Core key manager plugin
  import { KeyManager } from '@veramo/key-manager'
  
  // Custom key management system for RN
  import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
  
  // W3C Verifiable Credential plugin
  import { CredentialPlugin } from '@veramo/credential-w3c'
  
  // Custom resolvers
  import { DIDResolverPlugin } from '@veramo/did-resolver'
  import { Resolver } from 'did-resolver'
  import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
  import { getResolver as webDidResolver } from 'web-did-resolver'
  
  // Storage plugin using TypeOrm
  import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'
  
  // TypeORM is installed with `@veramo/data-store`
  import { DataSource } from 'typeorm'


  // This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = 'database.sqlite'

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = 'd04cdb12331148959e669e78f51e21e3'

// This will be the secret key for the KMS
const ORIGINAL_KMS_HEX_KEY = '0894d284e4f27eab9db3ca10c324d971de5bb82ff2a4e3961905b06a36fadcd0';
const binaryKey = hexToBinary(ORIGINAL_KMS_HEX_KEY);
const newBinaryKey = generateRandomBinary(binaryKey.length);
console.log("Binary Key:", newBinaryKey);
const newHexKey = binaryToHex(newBinaryKey);
console.log(" New Hex Key:", newHexKey);
const KMS_SECRET_KEY = '0894d284e4f27eab9db3ca10c324d971de5bb82ff2a4e3961905b06a36fadcd0';
  '< you can generate a key by running `npx @veramo/cli config create-secret-key` in a terminal>'


  const dbConnection = new DataSource({
    type: 'sqlite',
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
  }).initialize()

  export const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:ethr:goerli',
      providers: {
        'did:ethr:goerli': new EthrDIDProvider({
          defaultKms: 'local',
          network: 'goerli',
          rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
    new CredentialPlugin(),
  ],
})