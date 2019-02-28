# Review contract

The project is a simple contract to simulate a review between a buyer and a seller after a trade.<br />
The payment part is willingly not developped too much to focus on the review part.<br />

## Assumption:

Everyone have heard about blockchain and tokens; and people know what tokens can be used to.<br />
Every transaction goes well.<br />
People are used to graphical interface to interact with their tokens.

## Idea:

The idea is to know when a transaction between two people happen and to get review about this transaction.
The goal between this is to:
- Have more precise **statistics** about the rate of performed transaction
- Give **trust** to the buyer about the seller with the rating system
- Reduce the number of **fraud** or bad seller
- Brings **people back** on the marketplace after a buy
- Reward and **give importance** to buyer and seller

## How it works:

Imagine a marketplace like *LeBonCoin*, a seller named *Pierre*, a seller named *Lucie* and a buyer named *Jean*.

*Pierre* is selling a pair of boots and Jean wants to buy them.<br />
*Jean* will say to *Pierre* that he is interested and bought him the boots.<br />
The deal went well, and *Pierre* remove the announce from *LeBonCoin*.<br />
*Pierre* will now have the possibility to confirm that he sold his boots to *Jean*.<br />
*Jean* will also have the possibility to confirm that he bought the boots of *Pierre*.<br />
After they both confirme, a small amount of LBCT (LeBonCoinToken) will be sent to *Jean* because he gives to *LeBonCoin* information about the trade.<br />
*Jean* will then have the possibility to review *Pierre*, he can grant him a rate from 0 to 5 and let a small review.<br />
When it's done, *Jean* will also get a small amount of LBCT because he gives to *LeBonCoin* information about the trade.<br />
Now that *Jean* is on the marketplace again, he saw the nice hat that *Lucie* is selling.<br />
*Jean* will buy the hat with his LBCT and will complete with his own money.<br />

Rating and reviews will be visible on the profile of the user so anyone can know is a seller can be trusted or not.

![Alt text](images/Review_contract_diagram.png?raw=true "Diagram")

### The confirmation system:

Here we can imagine that after the removal of the anounce, a pop-up will appear saying to the buyer that he can confirm the trade and earn some LBCT when the trade will be also confirmed by the buyer.<br />
After that, an email can be sent to the buyer asking him for the confirmation and a small review against some LBCT.<br />
When both confirm, tokens are released to the seller. The release is at the second confirmation to avoid abuse (people spamming annouce and confirm their sale even if they haven't).<br />

### Token usage:

Token will be used to get discount when you buy things, or to get discount on your next options.

## What the marketplace has to win with this system:

- **Traffics**: the buyer will be brought back to the marketplace to do the review.
- **More transactions**: Because of the traffics augmentation and the reward system.
- **More options bought**: The seller with enough token will be able to try an option for free, if he sees that the option is good for his announce he might start to buy options.
- **Trust of the users**: With the rating system we reduce the risk for bad seller, so we reduce the complains of the buyer.

