# Test scenarios

Each test is designed here before implementation. Every scenario file lists a test objective, preconditions, a step-by-step table, the final result, and short technical notes. The test ID and tag(s) from each file are applied to the corresponding Playwright test.

Tests are tagged by layer (`@UI`, `@API`, `@INTEGRATION`) so a group of tags can be implemented and reviewed as its own pull request. A tag is applied only for a layer that is actually asserted on in the test - using the API merely to arrange test data (e.g. creating an ephemeral user) does not count towards the `@API` tag.

| ID                    | Title                                                                      | Tags                     |
| --------------------- | -------------------------------------------------------------------------- | ------------------------ |
| [TC-001](./TC-001.md) | Newly registered user can log in                                           | `@TC-001` `@UI`          |
| [TC-002](./TC-002.md) | Create a marketplace offer and verify it in My Offers                      | `@TC-002` `@UI`          |
| [TC-003](./TC-003.md) | Marketplace offers listing returns valid data                              | `@TC-003` `@API`         |
| [TC-004](./TC-004.md) | Registration rejects a duplicate email                                     | `@TC-004` `@API`         |
| [TC-005](./TC-005.md) | Marketplace page shows an error notification when the offers request fails | `@TC-005` `@INTEGRATION` |
| [TC-006](./TC-006.md) | New user can purchase an item using deposited funds                        | `@TC-006` `@UI` `@API`   |
| [TC-007](./TC-007.md) | Adding a farm animal with an overridden animal type                        | `@TC-007` `@API`         |
