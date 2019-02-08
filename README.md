# Intro

SoulCap an AR platform where you can tokenize, buy and sell souls. Later on, we'll also add the ability to play interact with (and/or torture 😈) souls. We made this proof of concept for the 0x hackathon to get started.

We wanted to help people tokenize their creativity in a new way, and have a little fun as well. Over the long term, we're also highly interested in game interopability, and hope to partner with other games to make Souls an avatar standard. 

We are big fans of 0x, and also had an interest in experimenting with new token mechanics for ZRX, so we offer a discount for minting souls if the user holds ZRX in their wallet.

The way it works is pretty simple. The user goes to our site, and can browse the various souls we have to offer--they take picture of themselves, and "entomb" this picture into a "soul" as an ERC721 for a small fee (.005 Eth, .0025 if the user holds ZRX in their wallet).

*Note* at time of submission our deployed website may not have all functions deployed, but the core soul minting process and purchasing ZRX for a discount on soul minting should work if you clone and run locally.

# Relevant Branches/Repos/Smart Contract Addresses

We are running the out-or-the-box 0x launch kit on AWS for our relayer for the moment. Repo for it can be found here: https://github.com/polezo/0x-launch-kit

Soul Minting Contract: https://etherscan.io/address/0xb52e21ca2e6d46832551b45eb60a63b0987d0c7a

# Issues/known bugs

It runs great in Chromium browsers, but has buggy styling on Firefox. Mobile stylesheets also leave **a lot** to be desired. Speaking of mobile, it doesn't work in most of the main mobile dApp browsers (it seems most of them do not allow webcam access yet), but does seem to function in Status for Android (although again, mobile layout is hideous)

It probably goes without saying our soul store also needs work. We have the ability to buy ZRX, and you can obviously use that ZRX to get a discount on your soul minting, however, buying and selling souls is still a bit of a work in progress.

# Other Idiosyncracies (image hosting)
We thought for a while on how to best handle hosting for the image URI for the NFT. The best thing for the UX is almost certainly to just handle the hosting on our own, and this is something we still may do eventually for a later iteration. At the end of the day though, our long term preference is to have a flow to IPFS or Storj and not have any point of failure where the soul images could get lost. This is not something we could do in the scope of this hackathon, so in the mean time we just thought we'd allow the user to pick the service for hosting that they'd prefer to trust. Want to host your soul's image on your own hosting? Go ahead. Want something user friendly like imgur? That works to. 

This also of course means you want to, you could also host images not created on our platform, or other non-images as your soul (like a tweet you really like or something else), however obviously at the end of the day if it doesn't contain a 600x600 image as a .png, we can't really tap into it as a "soul" for our purposes.

# SetUp to run locally

Clone repo on local machine 

FaceFilter API requires webcam access and thus must be set up with an HTTPS server. In the command line from the root of the project folder, launch the httpServer.py, and visit https://localhost:4443. You may also have to click "advanced" in your browser to proceed with the unsigned certificate. Note you MUST type in http**S**, or it will not operate as expected.

