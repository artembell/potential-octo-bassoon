<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## App
- Idempotent logic
- Feature design - each feature requires separate module

## Webhooks
- Secured with signature and construct
- Idempotent
- Asynchronously proccessed
- Secured of random events order

## Idempotency
Stripe APIs that require idempotency (used in app)
```js
stripe.customers.create()
stripe.paymentIntents.create()
stripe.subscriptions.create()
```


## Events
Event order on different actions

### Customer cancels subscription
```sh
- customer.subscription.deleted
```

### Customer created (user authorizes)
```sh
- customer.created
```

### Customer clicks `subscribe` on some product
```sh
- customer.subscription.created
- payment_intent.created
- invoice.created
- invoice.finalized
- customer.updated
```

### Customer subscriptions 1 week passes
```bash
- customer.updated
- invoice.created
- customer.subscription.updated
- invoice.upcoming
- charge.succeeded
- payment_intent.succeeded
- invoice.updated
- invoice.paid
- invoice.payment_succeeded
// when 1 period ticks
- customer.updated
- payment_intent.created
- invoice.finalized
```

### User hits 'Pay' button
```bash
- charge.succeeded
- payment_method.attached
- customer.subscription.updated
- payment_intent.succeeded
- invoice.updated
- invoice.paid
- invoice.payment_succeeded
- invoice.upcoming
```

ALTER DATABASE example
SET TIMEZONE TO 'Belarus/Minsk';

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
