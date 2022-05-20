# Setup notes

TODO:

- go through all code TODOs
- setup the rest of the routes
- setup actual sponsors
- go through "moz" copy in en.yml
- review rich text rendering
- caching notion images?
- DeconfApiClient's
  - isn't finished?

future work

- minimise "Routes" to be only the ones deconf needs
- move `api/fetchContent` patch back to deconf
- `createMemoryStore` should be migrated to class-based
- `RedisService` should be migrated to redis@4
- explore general `options` in `Context` for domain-specific configuration
  - non-standard: `CarbonRoutes`, `EmailService`, `I18nService`, `JwtService`,
    `MetricsSockets`, `PretalxService`, `RegistrationRoutes`
  - maybe a second `options` parameter?
- remove all use of now deprecated `Config`
- sort out exports on deconf-shared

documentation needed

- update CalendarRoutes to use express-based examples
- content needed
  - conference/
    - conference-routes
    - mock-schedule-command
  - interpret/
  - lib/
    - api-error
    - config
    - context
    - env
    - i18n
    - resources
    - s3
    - semaphore
    - sockets
    - structs
    - url-service
    - utils
  - metrics/
  - test-lib/
