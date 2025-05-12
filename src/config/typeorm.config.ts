import { ApiKey } from '../users/entities/api-key.entity';
import { ConfigService } from '@nestjs/config';
import { Content } from '../content/entities/content.entity';
import { Credit } from '../credits/entities/credit.entity';
import { Sentence } from 'src/content/entities/sentence.entity';
import { Template } from '../entities/template.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

const certContents = `-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUG2V6Td9UvO3KippfOS5EK2rAu4gwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1ODRkYzc3MmMtZjM1ZS00YTkzLTgyOTgtYjRjODk3NWVk
ZDY3IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwNTExMTY1MTE4WhcNMzUwNTA5MTY1
MTE4WjBAMT4wPAYDVQQDDDU4NGRjNzcyYy1mMzVlLTRhOTMtODI5OC1iNGM4OTc1
ZWRkNjcgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAO2X5sIQU+9t19VRRSyuenezMctWqIh996mpTWJvb2KCFlCt0AlNCKog
sJIrfQ0a1aR7I5YAen5FhYXZXzByQ+RXabzOAgd2/LKAjiDhabUMK87MTCouMq71
YOaK+TfYF1KInbL4eZq5UsuDFygKz+w73Bo9SMvW2oXZmTkKf4oEMqlr+LcmBcq2
/08uCVb18PcBRzvBDHgONP+l9llXT4yq7lCtNg3J7o4lG636uXTmlFL4Ic/HC1Wn
q//ynxxe94Xpy8M2fLYjnXhcULnOr7+KN8CdPvf7lJg4OxhaZ1E0sM1HA8zcVq7a
EMYilIVjFEbMr989soR1L62qw+ZsJv0ia0OPUJrOx8FqKuKJ3sE1UHPvCnQ32XC2
xjkXpIWdWNR7rxATCIzF2jVy942eR5Fd46JNTIPfkHSKwXjrcJ4FmKTgJdLxuq9G
n7kdrv7Fx1YeL9RpBmEDR0KLefPqZOQWl0MI3GJXy5uigj30P57Lf+YjQp5z9M5s
aHxUijaq+QIDAQABoz8wPTAdBgNVHQ4EFgQU49ZhSLrNBew3dD40wNob2TXuTUAw
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AEKh9zDakckylGP8gvPrPuodzacj8HgZf6wBJtH5F4/POQDmTLBz71CiIuAX6VoL
Ec+au0gS3gdhqjfTgPezTH9tBa9cGJjoHaC9K7NI2JjkgEcgkXUc4bvvQh6WaFkZ
XNFfa4dv5mB+QBmn78WF0OFN0bS6RW8wmBjpkzvCIOboeFVX/iEB/m6C0rbA5peU
xZ9QuIn7Q/ulE+vXgNF9/jx+gQUp9SB80gFjThHh91nN0p69BhPrqEpMXIqI0F5J
YYWlcY2/MFvKHVg2p50vmvuhapZ3CveQ26tMvcrndWgMghtejNNAzva9PiEoUOCm
PCYjLJC5YrXDzUeng/l9K5AXJmkFLP8s0rOe6HH7VGu+DUvpw2yJc2xv0/2J9vER
IV17JecrNUfZ8Qsa28NpINczxOEcqpzLSYTRBrF1GPdux5uHNZdeN7ehLnCy2oe4
ganYj8qRC0p80r7Qa5as6/csRs1VnuD0mXqOYjAHez779L+KBiQvubVv0WLGfgaE
Hg==
-----END CERTIFICATE-----
`;

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
  entities: [
    User,           // Đặt User lên đầu tiên vì các bảng khác phụ thuộc vào nó
    ApiKey,
    Template, 
    Content, 
    Sentence, 
    Credit
  ],
  logging: configService.get('DB_LOGGING'),
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  timezone: 'Z',
  ssl: {
    ca: certContents,
  },
});
