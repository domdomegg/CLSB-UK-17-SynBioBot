# Synthetic Biology Bot
Synthetic Biology Bot is an app for Amazon Alexa and Google Assistant that helps scientists in the lab by looking up parts, step-by-step protocol instructions and iGEM teams.

Google Assistant action that helps out with synthetic biology questions in the lab. Built with API.ai and Firebase Cloud Functions.

More information, including usage instructions are available on our [iGEM wiki](http://2017.igem.org/Team:CLSB-UK/Software/SynBioBot).

## Installation

To install your own copy would like take several hours for each platform. However, if you're determined:

* for Amazon Alexa follow the [Custom skill](https://developer.amazon.com/docs/custom-skills/steps-to-build-a-custom-skill.html) guide, but using our code for the Lambda function and Alexa Skills Builder steps.
* for Google Assistant follow the [Diaglogflow first app](https://developers.google.com/actions/dialogflow/first-app) guide, but using our code for the cloud function and Diaglogflow steps.

It's much easier to simply try the apps already published to the respective stores.

* [Amazon Alexa Skills Store](https://www.amazon.co.uk/dp/B074W3WBND/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=domdomegg-21&linkId=e5960856b61227c7ab46a9fa52e58fa8)
* [Google Assistant App Directory](https://assistant.google.com/services/a/id/5044d74f16c31276/)

To use it on your Alexa-enabled device, turn on the skill in the [Amazon store](https://www.amazon.co.uk/dp/B074W3WBND/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=domdomegg-21&linkId=e5960856b61227c7ab46a9fa52e58fa8) for the Amazon account your Alexa-enabled device is signed into (just like enabling any other skill).

To use it with Google Assistant, simply ask Google Assistant to 'talk to Synthetic Biology'. Please note Google Assistant is not supported on all phones and in all countries yet.

If you have an Android phone and are unsure whether you have Google Assistant, try pressing and holding the home button and see if anything pops up. It should work on most phones with Android Marshmallow (6.0) or newer.

If you have an iPhone, you'll need to install the [Google Assistant app](https://itunes.apple.com/us/app/the-google-assistant-get-help-anytime-anywhere/id1220976145?ls=1&mt=8), available on iOS 9.1 or newer.

There are more detailed instructions avilable on [Google's help site](https://support.google.com/assistant/answer/7172657) about setting up Google Assistant.

## Structure

`lambdafunctions` contains the code for the Amazon Alexa skill, that runs as a Lambda Function on AWS as well as the Alexa Skills Builder data
`googlecloudfunctions` contains the code for the Google Assistant app, that runs as a Cloud Function on Google Cloud Platform / Firebase as well as the Diaglogflow agent data
`resources` contains data and short programs process that data, e.g. team information
`branding` contains branding materials, e.g. logos and banners

## Contributing

Please do submit pull requests and add issues if you find any. Please note that any code you submit as part of a pull request will inherit the project license, GPLv3.

## Credits

Built by Adam Jones ([domdomegg](https://github.com/domdomegg)) for CLSB-UK's iGEM, 2017
