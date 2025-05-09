import { AffiliateClick } from "../models/Affiliate/AffiliateClicks.Model";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";
import { AffiliateLink } from "../models/Affiliate/Link.Model";
import { Postback } from "../models/Affiliate/AffiliatePostbacks.Model";
import { AffiliateSendEvent } from "../utils/pub_sub";

export const registerAffiliateHooks = () => {
  AffiliateClick.afterCreate(async (click : any) => {
    await AffiliateSendEvent("clicks", click.userId);
  });

  AffiliateUser.afterCreate(async (user : any) => {
    await AffiliateSendEvent("new_affiliate_user", user.id);
  });

  AffiliateLink.afterCreate(async (link) => {
    await AffiliateSendEvent("new_affiliate_link", link.id);
  });

  Postback.afterCreate(async (postback) => {
    await AffiliateSendEvent("new_postback", postback.affiliateId);
  });

  console.log("Affiliate hooks registered ✅");
};
