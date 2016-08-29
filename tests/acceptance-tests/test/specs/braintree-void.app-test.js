"use strict";
let yaml = require("js-yaml");
let fs   = require("fs");
let expect = require("chai").expect;
let shopUser = require("../../lib/user-shop-actions.js");
let userDo = require("../../lib/basic-user-actions.js");
let adminUser = require("../../lib/admin-order-actions.js");


beforeEach(function () {
  let browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});


describe("braintree net void test", function () {
  let eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
  it("verify user can void an order with braintree", function () {
    userDo.UserActions.userLogin("admin");
    browser.pause("5000");
    browser.click(eleMap.shop_btn);
    browser.pause("15000");
    browser.click(eleMap.product);
    browser.pause("5000");
    browser.click(eleMap.red_option);
    browser.pause("2000");
    browser.click(eleMap.add_to_cart_logged_in);
    browser.pause("2000");
    browser.click(eleMap.checkout_btn);
    browser.pause("5000");
    shopUser.checkForAddress();
    // free shipping option
    browser.click(eleMap.free_shipping);
    browser.pause("3000");
    browser.click(eleMap.braintree);
    browser.pause("6000");
    shopUser.braintreePaymentInfo();
    browser.click(eleMap.braintree_complete_order_btn);
    browser.pause("6000");
    // navigate to orders page
    browser.click(eleMap.orders_page_btn);
    browser.pause("5000");
    browser.click(eleMap.first_order_new_btn);
    browser.pause("2000");
    adminUser.voidAmount();
    browser.click(eleMap.approve_btn);
    browser.pause("2000");
    expect(browser.getText("h2")).to.equal("Applying a 100% discount will void / cancel this order with your payment provider");
    browser.click(eleMap.apply_discount_btn);
    browser.pause("5000");
    let getTotal = browser.getText(eleMap.order_total_post_discount);
    expect(getTotal[0]).to.equal("$0.00");
    browser.click(eleMap.capture_payment_btn);
  });
});
