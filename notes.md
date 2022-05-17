# Setup notes

TODO:

- review things to be moved to deconf libraries
- release new versions of the deconf libs
- go through all code TODOs
- experiment pulling from notion
- setup the rest of the routes
- setup actual sponsors
- go through "moz" copy in en.yml
- `createMemoryStore` should be migrated to class-based
- `RedisService` should be migrated to redis@4
- explore general `options` in `Context` for domain-specific configuration
- remove all use of now deprecated `Config`
- review rich text rendering
- caching images
- DeconfApiClient's
  - `jwtIssuer` doesn't do anything
  - No way to unauthenticate
  - isn't exported
  - isn't finished?

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
