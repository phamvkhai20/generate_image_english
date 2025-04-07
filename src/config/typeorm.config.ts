import { ConfigService } from '@nestjs/config';
import { Template } from '../entities/template.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const certContents = `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUYdK8Pax2IlZ63DjC3YGfTeF8MIIwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNjliNjBiNzEtYjI2Yy00NTUyLTkyZTgtMWViMTlkOTI3
ZjM4IFByb2plY3QgQ0EwHhcNMjQwMzA2MDkzNjA3WhcNMzQwMzA0MDkzNjA3WjA6
MTgwNgYDVQQDDC82OWI2MGI3MS1iMjZjLTQ1NTItOTJlOC0xZWIxOWQ5MjdmMzgg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANW8sG9Y
7FdR0ygqOfTU7/FTwxTenjIDWCLUp7tI2EaN3IgFh5D0r+wOtZWdRKV9pzcg9ZhF
bRj3kKdknjpt2PxtzVS5v86b1Bvm9FJ3/3gc8oyzoreKAUc10x5B9mFSw4z85Ck0
fwPOxV0zGtshJdtJNh59GGo2mJMSYzvqcP+FGXbsS1Lyv2K8/bo9CXbyCfgCpXmj
jb+L7+AVz1fu86g69ImW6Df+XCJrfPIMzv8E3ZygLZns/W1VO9l91Wlpm5SD5SoN
wC1q4NUfZ2p95zz7FafuregpDdRcjd41Bd0mHeuAwwp7V+hL4ebaIJfuD/cG61W+
gCTYAQjuhMR+sTHUVpBOlrcH6lZFFHnH+7MHaWB39MFjQQIhNS3kdgWvW9h4mwnS
+NmicYn2ZKdXzlH3VCJ3THJkMey+Xzi12Zko1oKAvCE+HIb+uqvpe0cxYlh7Ihb5
mLmEQsAwY8Sk9ekngOn4D/DjhFWpjWFW8cpWYKETWAd9uhHcIOJb/FM1TwIDAQAB
oz8wPTAdBgNVHQ4EFgQU7QVQMsyaKBSGFXmmMRQtGW1tdwQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACUgpg2Pk2zN+qkY
1DPVKnqnuJAibNPu9u+Y0VIhP4SVyokV4N0m6yVmU9uIw2+F8U3xLoiCjN9w+unK
KpgUCaWuvVseVtaClItpe8Z3cv4WhFMnAqALZxPLh9+lEWfL2zLyqZbDTRMut0T2
JgVPq4nKrJs2rVfbZxgpP37UlbwQudKX1ZK6Qz2M8o3/9313AS3M+F+xnlMmiCbY
hq/e62rlDDanpvuGLKseU1U0/sZhcMM7vyz0ndDfjZ41waasmcbILxx1BmyDrJZN
tRHTGoxqjiRvyVOgm0etHgr54RIPzfjDAPo9C/Y5ZKvQbXIyVAizaKTNUftBnMeB
v9vzZqEYYUFj4RVrzYs9fFALZ/tup4GiobfUZcoYMbUy3h/xzjMzhs7DJcBHfeMp
vXiO/otkjV/rhgXD4huu6Uq357Wo8Z7S1ReWN7nzMsZmQ4jeGr8tyRsnIXPUuwHk
JSU00UtbL/PYJByJy6Ecjf25gl/RHpWRLenPFgYmk9G3uhBwgw==
-----END CERTIFICATE-----`;

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  driver: require('mysql2'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [Template],
  logging: configService.get('DB_LOGGING'),
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  timezone: 'Z',
  ssl: {
    ca: certContents,
  },
});
