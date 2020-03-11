function getPocketValue(pocketValue) {
  return parseFloat(pocketValue.split(' ')[1].substr(1));
}

function normalizeFloat(number) {
  return parseFloat((Math.round(number * 100) / 100).toFixed(2));
}

function normalizeMoneyValueWithCoins(amount) {
  return amount
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    .substr(1);
}

describe('test that pockets disable works correctly', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('initial pockets with same currency are disabled ', () => {
    cy.findByTestId('from_pocket')
      .findByText(/USD/)
      .should('have.attr', 'disabled');

    cy.findByTestId('to_pocket')
      .findByText(/USD/)
      .should('have.attr', 'disabled');
  });

  it('after click pockets with same currency are disabled', () => {
    cy.findByTestId('from_pocket')
      .findByText(/EUR/)
      .should('not.have.attr', 'disabled');

    cy.findByTestId('from_pocket')
      .findByText(/EUR/)
      .click()
      .should('have.attr', 'disabled');

    cy.findByTestId('to_pocket')
      .findByText(/EUR/)
      .should('have.attr', 'disabled');
  });
});

describe('input errors work correctly', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('not enough money error shows up', () => {
    cy.findByTestId('from_pocket')
      .findByText(/USD/)
      .then($fromPocket => {
        const fromPocketValue = getPocketValue($fromPocket.text());

        cy.findByPlaceholderText(/From/).type((fromPocketValue * 2).toString());
        cy.findByText('Not enough money').should('be.visible');
        cy.findByText(/Convert/).should('have.attr', 'disabled');

        cy.findByPlaceholderText(/From/)
          .clear()
          .type(fromPocketValue.toString());
        cy.findByText('Not enough money').should('not.be.visible');

        cy.findByText(/Convert/).click();
        cy.findByText('Not enough money').should('be.visible');

        cy.findByPlaceholderText(/To/)
          .clear()
          .type(fromPocketValue.toString());
        cy.findByText('Not enough money').should('be.visible');
      });
  });

  it('invalid money number error shows up, button disables', () => {
    cy.findByPlaceholderText(/From/).type('abcd');
    cy.findAllByText('Invalid money number').should('be.visible');
    cy.findByText(/Convert/).should('have.attr', 'disabled');

    cy.findByPlaceholderText(/From/).clear();
    cy.findAllByText('Invalid money number').should('not.be.visible');

    cy.findByPlaceholderText(/To/).type('abcd');
    cy.findAllByText('Invalid money number').should('be.visible');
    cy.findByText(/Convert/).should('have.attr', 'disabled');
  });
});

describe('transaction between pockets works correctly', () => {
  it('initial pockets with same currency are disabled ', () => {
    cy.server();
    cy.route('https://api.exchangeratesapi.io/latest*').as('getRate');

    cy.visit('/');

    cy.wait('@getRate').then(xhr => {
      cy.findByTestId('from_pocket')
        .findByText(/USD/)
        .then($fromPocket => {
          cy.findByTestId('to_pocket')
            .findByText(/EUR/)
            .then($toPocket => {
              const { EUR: rate } = xhr.response.body.rates;

              const fromPocketValue = getPocketValue($fromPocket.text());
              const toPocketValue = getPocketValue($toPocket.text());

              const fromValue = normalizeFloat(fromPocketValue / 2);
              const toValue = normalizeFloat(fromValue * rate);
              console.log(toValue, fromValue * rate);

              cy.findByPlaceholderText(/From/).type(fromValue.toString());
              cy.findByPlaceholderText(/To/).should(
                'have.value',
                normalizeMoneyValueWithCoins(toValue),
              );

              cy.findByText(/Convert/).click();
              cy.findByTestId('from_pocket')
                .findByText(/USD/)
                .should($fromPocketUpdated => {
                  const fromPocketValueUpdated = getPocketValue(
                    $fromPocketUpdated.text(),
                  );

                  expect(fromPocketValueUpdated).to.equal(
                    normalizeFloat(fromPocketValue - fromValue),
                  );
                });

              cy.findByTestId('to_pocket')
                .findByText(/EUR/)
                .should($toPocketUpdated => {
                  const toPocketValueUpdated = getPocketValue(
                    $toPocketUpdated.text(),
                  );

                  expect(toPocketValueUpdated).to.equal(
                    normalizeFloat(toPocketValue + toValue),
                  );
                });
            });
        });
    });

    cy.findByPlaceholderText(/From/).clear();

    cy.findByTestId('from_pocket')
      .findByText(/EUR/)
      .click();

    cy.findByTestId('to_pocket')
      .findByText(/GBP/)
      .click();

    cy.wait('@getRate').then(xhr => {
      cy.findByTestId('from_pocket')
        .findByText(/EUR/)
        .then($fromPocket => {
          cy.findByTestId('to_pocket')
            .findByText(/GBP/)
            .then($toPocket => {
              const { GBP: rate } = xhr.response.body.rates;

              const fromPocketValue = getPocketValue($fromPocket.text());
              const toPocketValue = getPocketValue($toPocket.text());

              const toValue = normalizeFloat(fromPocketValue / 3);
              const fromValue = normalizeFloat(toValue * (1 / rate));

              cy.findByPlaceholderText(/To/).type(toValue.toString());
              cy.findByPlaceholderText(/From/).should(
                'have.value',
                normalizeMoneyValueWithCoins(fromValue),
              );

              cy.findByText(/Convert/).click();
              cy.findByTestId('from_pocket')
                .findByText(/EUR/)
                .should($fromPocketUpdated => {
                  const fromPocketValueUpdated = getPocketValue(
                    $fromPocketUpdated.text(),
                  );

                  expect(fromPocketValueUpdated).to.equal(
                    normalizeFloat(fromPocketValue - fromValue),
                  );
                });

              cy.findByTestId('to_pocket')
                .findByText(/GBP/)
                .should($toPocketUpdated => {
                  const toPocketValueUpdated = getPocketValue(
                    $toPocketUpdated.text(),
                  );

                  expect(toPocketValueUpdated).to.equal(
                    normalizeFloat(toPocketValue + toValue),
                  );
                });
            });
        });
    });
  });
});
