const ReviewSystem = artifacts.require('./ReviewSystem.sol');

contract('ReviewSystem', (profiles) => {
  const buyer = profiles[0x1];
  const seller1 = profiles[0x2];
  const seller2 = profiles[0x3];
  const item1 = {
    id: 1,
    price: 40
  }
  const item2 = {
    id: 2,
    price: 20
  }
  const validReview = {
    rate: 4,
    review: 'It was nice'
  }
  const invalidReview = {
    rate: 6,
    review: 'Awesome'
  }

  it('should successfully create a trade', async () => {
    const contract = await ReviewSystem.new();
    await contract.buy(seller1, item1.id, 0, { value: item1.price, from: buyer });

    // Validates that the trade has been created
    var trade = await contract.getTrade.call(item1.id);
    assert.equal(trade[0], seller1, 'Seller is incorrect');
    assert.equal(trade[1], buyer, 'Buyer is incorrect');
    assert.equal(trade[2], item1.id, 'ObjectId is incorrect');
    assert.equal(trade[3], item1.price, 'Price is incorrect');
    assert.equal(trade[4], 'IN PROGRESS', 'Status is incorrect');
    assert.equal(trade[5], 0, 'Confirmation is incorrect');

    // Validate that buyer can't buy with unavailable tokens
    try {
     await contract.buy(seller2, item2.id, 10, { value: item2.price, from: buyer });
    } catch (err) {
      var trade = await contract.getTrade.call(item2.id);
      assert.equal(trade[3], 0, 'Trade should not have been created');
    }
  });

  it ('should successfully confirm a trade', async () => {
    const contract = await ReviewSystem.new();
    await contract.buy(seller1, item1.id, 0, { value: item1.price, from: buyer });

    await contract.sellerConfirm(item1.id, { from: seller1 });

    // Validates that seller can confirm
    var trade = await contract.getTrade.call(item1.id);
    assert.equal(trade[4], 'IN CONFIRMATION', 'Status is incorrect');
    assert.equal(trade[5], 1, 'Confirmation is incorrect');

    // Validates that seller can't confirm for the buyer
    try {
      await contract.buyerConfirm(item1.id, { from: seller1 });
    } catch (err) {
      var trade = await contract.getTrade.call(item1.id);
      assert.equal(trade[4], 'IN CONFIRMATION', 'Seller should not be able to confirm for the buyer');
      assert.equal(trade[5], 1, 'Seller should not be able to confirm for the buyer');
    }

    // Validates that buyer can't confirm for the seller
    try {
      await contract.sellerConfirm(item1.id, { from: buyer });
    } catch (err) {
      var trade = await contract.getTrade.call(item1.id);
      assert.equal(trade[4], 'IN CONFIRMATION', 'Buyer should not be able to confirm for the seller');
      assert.equal(trade[5], 1, 'Buyer should not be able to confirm for the seller');
    }

    await contract.buyerConfirm(item1.id, { from: buyer });

    // Validates that buyer can confirm and that two confirmations give the right status
    var trade = await contract.getTrade.call(item1.id);
    assert.equal(trade[4], 'DONE', 'Status is incorrect');
    assert.equal(trade[5], 2, 'Confirmation is incorrect');

    // Validates that the seller has been rewarded
    var profile = await contract.getProfile.call(seller1);
    var confirmation_reward = await contract.getConfirmationReward.call();
    assert.equal(profile[2].valueOf(), confirmation_reward.valueOf(), 'Reward has not been sended to the seller');
  });

  it ('should successfully review a seller', async () => {
    const contract = await ReviewSystem.new();
    await contract.buy(seller1, item1.id, 0, { value: item1.price, from: buyer });

    // Validates that it's not possible to review a seller with no confirmation
    try {
      await contract.review(seller1, item1.id, validReview.rate, validReview.review, { from: buyer });
    } catch (err) {
      var review = await contract.getReview.call(item1.id);
      assert.equal(review[3], 0, 'Review should not be possible with no confirmation');
    }

    await contract.buyerConfirm(item1.id, { from: buyer });

    // Validates that it's not possible to review a seller with one confirmation
    try {
      await contract.review(seller1, item1.id, validReview.rate, validReview.review, { from: buyer });
    } catch (err) {
      var review = await contract.getReview.call(item1.id);
      assert.equal(review[3], 0, 'Review should not be possible with one confirmation');
    }

    await contract.sellerConfirm(item1.id, { from: seller1 });

    // Validates that seller can't review himself
    try {
      await contract.review(seller1, item1.id, validReview.rate, validReview.review, { from: seller1 });
    } catch (err) {
      var review = await contract.getReview.call(item1.id);
      assert.equal(review[3], 0, 'Seller should not be able to review himself');
    }

    // Validates that buyer can't done a false review
    try {
      await contract.review(seller1, item1.id, invalidReview.rate, invalidReview.review, { from: seller1 });
    } catch (err) {
      var review = await contract.getReview.call(item1.id);
      assert.equal(review[3], 0, 'Buyer should not be able to do false review');
    }

    await contract.review(seller1, item1.id, validReview.rate, validReview.review, { from: buyer });

    // Validates that a review is created
    var review = await contract.getReview.call(item1.id);
    assert.equal(review[0], seller1, 'Seller is incorrect');
    assert.equal(review[1], buyer, 'Buyer is incorrect');
    assert.equal(review[2], validReview.rate, 'Rate is incorrect');
    assert.equal(review[3], validReview.review, 'Review is incorrect');

    // Validates that the buyer has been rewarded
    var profile = await contract.getProfile.call(buyer);
    var review_reward = await contract.getReviewReward.call();
    assert.equal(profile[2].valueOf(), review_reward.valueOf(), 'Reward has not been sended to the buyer');

    // Validates that the review has been added to the profile
    var profile = await contract.getProfile.call(seller1);
    assert.equal(profile[0], 1, 'Profile NumberOfReview is incorrect');
    assert.equal(profile[1], validReview.rate, 'Profile Rate is incorrect');
  });
})
