# Validation Plan

The goal of this MVP is not to build every feature - it's to prove that
people actually have this problem and will use a marketplace to solve it.
This document is the checklist for that.

## Questions the MVP needs to answer

1. Do people actually have missing parts?
2. Do people search for individual replacement components?
3. Do people have unused/spare components sitting at home?
4. Are people willing to list them?
5. Can the platform create a useful buyer <-> seller match?
6. Will people actually contact each other?
7. Will someone eventually pay for a part?

If the answer to most of these is "no" after real usage, that's a valid
and important outcome - it means the idea needs to change before more
engineering time goes into it.

## Buyer interview questions

1. Have you ever lost, damaged, or needed to replace just one part of a product?
2. What product?
3. Which part?
4. What did you do after?
5. Where did you search?
6. Could you find the exact part?
7. If not, why was it difficult?
8. How much did you spend (if anything)?
9. Would you buy a working original/used part from another person for less?
10. What would make you trust the seller?

## Seller interview questions

1. Do you have unused/extra/leftover parts?
2. What parts?
3. Which products/models do they belong to?
4. Why are they unused?
5. What do you currently do with them?
6. Have you tried selling them individually?
7. What stopped you?
8. What price would you expect?
9. Would you sell if you knew someone specifically needed it?
10. What information would you be comfortable providing?

The strongest signal is a real example or a real item someone can show you
- not a compliment about the idea.

## Metrics to track

Keep a simple spreadsheet (or a table at the bottom of this file) with:

| Metric | Count |
| --- | --- |
| People interviewed | |
| ...who had experienced this problem | |
| ...with an actual missing-part story | |
| ...with an unused-part story | |
| ...who had searched for a replacement part before | |
| ...who failed to find an exact part | |
| ...willing to buy | |
| ...willing to sell | |
| Real need requests created in the app | |
| Real listings created in the app | |
| Exact matches produced by the matching engine | |
| Contact-seller messages sent | |
| Completed transactions (reported informally) | |

Track behavior, not compliments: someone creating a real listing or a real
need request is a much stronger signal than someone saying "cool idea."

## How to run the first validation round

1. Deploy the MVP (see README -> Deploying) so you have a real URL to share.
2. Interview 8-10 people who plausibly fit "owns several electronics
   products" - friends, coworkers, online communities for a specific brand
   (e.g. a Sony headphone subreddit) work well as a first sample.
3. After the interview, ask them to actually try creating a need request or
   a listing in the live app, right there if possible. Watching them use it
   in real time surfaces confusing UI faster than any amount of guessing.
4. Fill in the metrics table above after each batch of interviews.
5. Revisit `PROJECT_CHECKLIST.md` and reprioritize the "TO DO" section based
   on what you learn - most likely candidates: which categories to seed
   first, whether the exact-matching rule is too strict, and whether people
   trust the contact-seller flow enough to actually reach out.
