

#import <Foundation/Foundation.h>
#import "StripeBridge.h"
#import <Stripe/Stripe.h>
#import "CheckoutViewController.h"

@implementation StripeBridge
RCT_EXPORT_MODULE();

// createPaymentIntent
RCT_EXPORT_METHOD(createPayment:(NSString*)clientSecret paymentMethodId:(NSString*)paymentMethodId callback:(RCTResponseSenderBlock)callback ){
  
  
  STPPaymentIntentParams *paymentIntentParams = [[STPPaymentIntentParams alloc] initWithClientSecret:clientSecret ];
  paymentIntentParams.paymentMethodId = paymentMethodId;
  
  CheckoutViewController *authContext = [[CheckoutViewController alloc] init];
  [[STPPaymentHandler sharedHandler] confirmPayment:paymentIntentParams withAuthenticationContext:authContext completion:^(STPPaymentHandlerActionStatus status, STPPaymentIntent * paymentIntent, NSError * error) {
    switch (status) {
      case STPPaymentHandlerActionStatusSucceeded:
        callback(@[[NSNull null], @"SUCCESS", paymentIntent.stripeId]);
        break;
        // Payment succeeded
      case STPPaymentHandlerActionStatusCanceled:
        callback(@[[NSNull null], @"CANCEL" ]);
        break;
        // Handle cancel
      case STPPaymentHandlerActionStatusFailed:
        callback(@[[NSNull null], @"ERROR", @"NULL" ]);
        break;
    }
  }];
}

RCT_EXPORT_METHOD(createAlipayPayment:(NSString*)clientSecret callback:(RCTResponseSenderBlock)callback ){
   
    STPPaymentIntentParams *paymentIntentParams = [[STPPaymentIntentParams alloc] initWithClientSecret:clientSecret];
    paymentIntentParams.paymentMethodParams = [STPPaymentMethodParams paramsWithAlipay:[STPPaymentMethodAlipayParams new] billingDetails:nil metadata:nil];
    paymentIntentParams.paymentMethodOptions = [STPConfirmPaymentMethodOptions new];
    paymentIntentParams.paymentMethodOptions.alipayOptions = [STPConfirmAlipayOptions new];
    paymentIntentParams.returnURL = @"wook-market://safepay/";

  
   CheckoutViewController *authContext = [[CheckoutViewController alloc] init];
  
    [[STPPaymentHandler sharedHandler] confirmPayment:paymentIntentParams
                            withAuthenticationContext:authContext
                                          completion:^(STPPaymentHandlerActionStatus status, STPPaymentIntent * _Nullable paymentIntent, NSError * _Nullable error) {
        switch (status) {
            case STPPaymentHandlerActionStatusCanceled:
                callback(@[[NSNull null], @"CANCEL" ]);
                break;
            case STPPaymentHandlerActionStatusFailed:
                callback(@[[NSNull null], @"ERROR", @"NULL" ]);
                break;
            case STPPaymentHandlerActionStatusSucceeded:
                callback(@[[NSNull null], @"SUCCESS" , @"NULL" ]);
                break;
        }
    }];
}

@end
