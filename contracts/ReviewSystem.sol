pragma solidity ^0.4.18;

import '../library/StringUtils.sol';

contract ReviewSystem {
  address public  rewarder;
  uint    public  confirmation_reward;
  uint    public  review_reward;
  uint    public  tokenBalance;

  // The structure for a trade
  struct Trade {
    address seller;
    address buyer;
    uint    objectId;
    uint    price;
    string  status;
    uint    confirmation;
  }

  // The structure for a review
  struct Review {
    address reviewed;
    address reviewer;
    uint    rate;
    string  buyerReview;
  }

  // The structure for a profile
  struct Profile {
    uint      numberOfReview;
    uint      globalRate;
    Review[]  reviews;
    uint      tokenBalance;
  }

  // Declare a Trade structure for each possible uint
  mapping (uint => Trade) trades;

  // Declare a Review structure for each possible uint
  mapping (uint => Review) reviews;

  // Declare a Rating structure for each possible address
  mapping (address => Profile) profiles;

  // Constructor
  function ReviewSystem() public {
    rewarder =            msg.sender;
    confirmation_reward = 1;
    review_reward =       1;
    tokenBalance =        90000000000;
  }

  // Buying a good
  function buy(address seller, uint objectId, uint tokenUsed) public payable returns(Trade) {
    require(profiles[msg.sender].tokenBalance >= tokenUsed);
    profiles[msg.sender].tokenBalance -= tokenUsed;
    tokenBalance += tokenUsed;
    trades[objectId] = Trade({
      seller:       seller,
      buyer:        msg.sender,
      objectId:     objectId,
      price:        msg.value,
      status:       'IN PROGRESS',
      confirmation: 0
    });
    return (trades[objectId]);
  }

  // The seller can confirm the trade
  function sellerConfirm(uint objectId) public {
    Trade storage trade = trades[objectId];
    require(msg.sender == trade.seller && (StringUtils.equal(trade.status, 'IN PROGRESS') || StringUtils.equal(trade.status, 'IN CONFIRMATION')));
    trade.confirmation += 1;
    if (trade.confirmation == 2) {
      trade.status = 'DONE';
      RewardTheSeller(trade.seller);
    }
    else {
      trade.status = 'IN CONFIRMATION';
    }
  }

  // The buyer can confirm the trade
  function buyerConfirm(uint objectId) public {
    Trade storage trade = trades[objectId];
    require(msg.sender == trade.buyer && (StringUtils.equal(trade.status, 'IN PROGRESS') || StringUtils.equal(trade.status, 'IN CONFIRMATION')));
    trade.confirmation += 1;
    if (trade.confirmation == 2) {
      trade.status = 'DONE';
      RewardTheSeller(trade.seller);
    }
    else {
      trade.status = 'IN CONFIRMATION';
    }
  }

  // The buyer can review the seller
  function review(address reviewed, uint objectId, uint rate, string buyerReview) public returns(Review) {
    Trade storage trade = trades[objectId];
    require(msg.sender == trade.buyer && StringUtils.equal(trade.status, 'DONE') && rate <= 5);
    reviews[objectId] = Review({
      reviewed:     reviewed,
      reviewer:     msg.sender,
      rate:         rate,
      buyerReview:  buyerReview
    });
    RewardTheBuyer(msg.sender);
    AddReviewToProfile(reviews[objectId]);
    return (reviews[objectId]);
  }

  // Reward the seller with tokens for of his sell confirmation
  function RewardTheSeller(address seller) private {
    profiles[seller].tokenBalance += confirmation_reward;
    tokenBalance -= confirmation_reward;
  }

  // Reward the buyer with tokens for his review
  function RewardTheBuyer(address buyer) private {
    profiles[buyer].tokenBalance += review_reward;
    tokenBalance -= review_reward;
  }

  // Add the review to the seller profile
  function AddReviewToProfile(Review buyerReview) private {
    uint savedNumberOfReview = profiles[buyerReview.reviewed].numberOfReview;
    uint savedGlobalRate = profiles[buyerReview.reviewed].globalRate;
    profiles[buyerReview.reviewed].numberOfReview += 1;
    profiles[buyerReview.reviewed].globalRate = ((savedGlobalRate * savedNumberOfReview) + buyerReview.rate) / (savedNumberOfReview + 1);
    profiles[buyerReview.reviewed].reviews.push(buyerReview);
  }

  // Getter methods

  // Get a single Trade
  function getTrade(uint objectId) public view returns(address, address, uint, uint, string, uint) {
    require(msg.sender == rewarder);
    Trade memory t = trades[objectId];
    return (t.seller, t.buyer, t.objectId, t.price, t.status, t.confirmation);
  }

  // Get a single Review
  function getReview(uint objectId) public view returns(address, address, uint, string) {
    require(msg.sender == rewarder);
    Review memory r = reviews[objectId];
    return (r.reviewed, r.reviewer, r.rate, r.buyerReview);
  }

  // Get a single Profile
  function getProfile(address profileAddress) public view returns(uint, uint, uint) {
    require(msg.sender == rewarder);
    Profile memory p = profiles[profileAddress];
    return (p.numberOfReview, p.globalRate, p.tokenBalance);
  }

  // Get confirmation_reward
  function getConfirmationReward() public view returns(uint) {
    require(msg.sender == rewarder);
    return (confirmation_reward);
  }

  // Get review_reward
  function getReviewReward() public view returns(uint) {
    require(msg.sender == rewarder);
    return (review_reward);
  }
}
