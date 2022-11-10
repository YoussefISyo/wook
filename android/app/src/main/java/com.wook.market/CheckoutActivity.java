package com.wook.market;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.lang.ref.WeakReference;

import com.stripe.android.ApiResultCallback;
import com.stripe.android.PaymentIntentResult;
import com.stripe.android.Stripe;
import com.stripe.android.model.ConfirmPaymentIntentParams;
import com.stripe.android.model.PaymentIntent;

import com.wook.market.R;

public class CheckoutActivity extends AppCompatActivity {
    // ...
    private String paymentIntentClientSecret;
    private Stripe stripe;

    MainApplication application ;
    ReactNativeHost reactNativeHost ;
    ReactInstanceManager reactInstanceManager ;
    ReactContext reactContext ;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkout);

         application = (MainApplication) CheckoutActivity.this.getApplication();
         reactNativeHost = application.getReactNativeHost();
         reactInstanceManager = reactNativeHost.getReactInstanceManager();
        reactContext = reactInstanceManager.getCurrentReactContext();

        Intent intent = getIntent();
        String clientSecret = intent.getStringExtra("clientSecret");
        String paymentMethodId = intent.getStringExtra("paymentMethodId");

        startCheckout(clientSecret,paymentMethodId);
    }

    private void startCheckout(String clientSecret,String paymentMethodId) {

        ConfirmPaymentIntentParams confirmParams = ConfirmPaymentIntentParams.createWithPaymentMethodId(
                      paymentMethodId,
                      clientSecret
                    ); 
              
              reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "after confirmParams");  
              
         stripe = new Stripe(
                       getApplicationContext(),
                       "pk_live_51IsoKUGwWIaCjE8IL9PwqWh57aYWiMBHKTayIPadt9Gcu4LPRJopzlfC2QQuLnSPpZH3APBiRZZRRtPpbQcKEAlv00hoIt1lns"
                     );
         stripe.confirmPayment(CheckoutActivity.this, confirmParams);    
   
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "end ckeckout");
        Log.d("CheckoutActivity","end of checkout method");
     }
    // ...

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "success");

        // Handle the result of stripe.confirmPayment
        stripe.onPaymentResult(requestCode, data, new PaymentResultCallback(this));
    }

    // ...

    private static final class PaymentResultCallback
            implements ApiResultCallback<PaymentIntentResult> {

      @NonNull private final WeakReference<CheckoutActivity> activity;
      MainApplication application ;
      ReactNativeHost reactNativeHost ;
      ReactInstanceManager reactInstanceManager ;
      ReactContext reactContext ;

        PaymentResultCallback(@NonNull CheckoutActivity activity) {
             this.activity = new WeakReference<>(activity);
             application = (MainApplication) this.activity.get().getApplication();
             reactNativeHost = application.getReactNativeHost();
             reactInstanceManager = reactNativeHost.getReactInstanceManager();
             reactContext = reactInstanceManager.getCurrentReactContext();
        }

        @Override
        public void onSuccess(@NonNull PaymentIntentResult result) {
          

            PaymentIntent paymentIntent = result.getIntent();
            PaymentIntent.Status status = paymentIntent.getStatus();
            if (status == PaymentIntent.Status.Succeeded) {
                // Payment completed successfully

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "success");
    
            } else if (status == PaymentIntent.Status.RequiresPaymentMethod || status == PaymentIntent.Status.RequiresAction)  {
                // Payment failed

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "error");
   
            } 
        }

        @Override
        public void onError(@NonNull Exception e) {
            // Payment request failed – allow retrying using the same payment method

            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Success", "error");
           
        }
    }
}