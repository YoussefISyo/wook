package com.wook.market;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.content.Intent;

import android.app.Activity;
import android.util.Log;

import com.zmxv.RNSound.RNSoundPackage;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;

import com.stripe.android.AlipayAuthenticator;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.PaymentIntentResult;
import com.stripe.android.Stripe;
import com.stripe.android.model.ConfirmPaymentIntentParams;
import com.stripe.android.model.PaymentIntent;
import com.stripe.android.PaymentConfiguration;

import com.wook.market.R;

public class MainActivity extends ReactActivity {
    private final static String publishableKey = "pk_live_51IsoKUGwWIaCjE8IL9PwqWh57aYWiMBHKTayIPadt9Gcu4LPRJopzlfC2QQuLnSPpZH3APBiRZZRRtPpbQcKEAlv00hoIt1lns";
    MainApplication application;
    ReactNativeHost reactNativeHost;
    ReactInstanceManager reactInstanceManager;
    ReactContext reactContext;
    private String paymentIntentClientSecret;
    private Stripe stripe;
    private ConfirmPaymentIntentParams confirmParams;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this); // here
        super.onCreate(savedInstanceState);
        PaymentConfiguration.init(
                this,
                "pk_live_51IsoKUGwWIaCjE8IL9PwqWh57aYWiMBHKTayIPadt9Gcu4LPRJopzlfC2QQuLnSPpZH3APBiRZZRRtPpbQcKEAlv00hoIt1lns");
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Wook_Market";
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        application = (MainApplication) MainActivity.this.getApplication();
        reactNativeHost = application.getReactNativeHost();
        reactInstanceManager = reactNativeHost.getReactInstanceManager();
        reactContext = reactInstanceManager.getCurrentReactContext();

        String clientSecret = intent.getStringExtra("clientSecret");
        Log.e("clientSecret", clientSecret);

        String paymentMethodId = intent.getStringExtra("paymentMethodId");
        // Log.e("paymentMethodId",paymentMethodId);

        if (clientSecret != null && paymentMethodId != null) {

            startCheckout(clientSecret, paymentMethodId);
        }

        if (clientSecret != null && paymentMethodId == null) {
            startAlipayCheckout(clientSecret);
        }
    }

    private void startAlipayCheckout(String clientSecret) {
        Log.e("startAlipayCheckout", "startAlipayCheckout");

        stripe = new Stripe(
                getApplicationContext(),
                PaymentConfiguration.getInstance(getApplicationContext()).getPublishableKey());

        Activity activity = this;
        confirmParams = ConfirmPaymentIntentParams.createAlipay(clientSecret);
        /*stripe.confirmAlipayPayment(
                confirmParams,
                (AlipayAuthenticator) data -> new PayTask(activity).payV2(data, true),
                new AlipayPaymentResultCallback(this, stripe, confirmParams));*/

    }

    private void startCheckout(String clientSecret, String paymentMethodId) {
        Log.e("startCheckout", "startCheckout");
        ConfirmPaymentIntentParams confirmParams = ConfirmPaymentIntentParams.createWithPaymentMethodId(
                paymentMethodId,
                clientSecret);

        stripe = new Stripe(
                getApplicationContext(),
                PaymentConfiguration.getInstance(getApplicationContext()).getPublishableKey());
        stripe.confirmPayment(MainActivity.this, confirmParams);
    }
    // ...

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Handle the result of stripe.confirmPayment
        stripe.onPaymentResult(requestCode, data, new PaymentResultCallback(this));
    }

    // ...

    private static final class PaymentResultCallback
            implements ApiResultCallback<PaymentIntentResult> {

        @NonNull
        private final WeakReference<MainActivity> activity;
        MainApplication application;
        ReactNativeHost reactNativeHost;
        ReactInstanceManager reactInstanceManager;
        ReactContext reactContext;

        PaymentResultCallback(@NonNull MainActivity activity) {
            this.activity = new WeakReference<>(activity);
            application = (MainApplication) this.activity.get().getApplication();
            reactNativeHost = application.getReactNativeHost();
            reactInstanceManager = reactNativeHost.getReactInstanceManager();
            reactContext = reactInstanceManager.getCurrentReactContext();
        }

        @Override
        public void onSuccess(@NonNull PaymentIntentResult result) {

            Log.e("success", "e.toString()");

            PaymentIntent paymentIntent = result.getIntent();
            PaymentIntent.Status status = paymentIntent.getStatus();
            if (status == PaymentIntent.Status.Succeeded) {
                // Payment completed successfully

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Response",
                        "Success");

            } else {
                // Payment failed

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Response",
                        "PaymentFailedError");

            }
        }

        @Override
        public void onError(@NonNull Exception e) {
            // Payment request failed – allow retrying using the same payment method
            Log.e("error", e.toString());
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Response",
                    "RequestFailedError");

        }
    }

    private static final class AlipayPaymentResultCallback
            implements ApiResultCallback<PaymentIntentResult> {

        @NonNull
        private final WeakReference<MainActivity> activity;
        MainApplication application;
        ReactNativeHost reactNativeHost;
        ReactInstanceManager reactInstanceManager;
        ReactContext reactContext;
        ConfirmPaymentIntentParams confirmParams;
        Stripe stripe;

        AlipayPaymentResultCallback(@NonNull MainActivity activity, Stripe stripe,
                ConfirmPaymentIntentParams confirmParams) {
            this.activity = new WeakReference<>(activity);
            application = (MainApplication) this.activity.get().getApplication();
            reactNativeHost = application.getReactNativeHost();
            reactInstanceManager = reactNativeHost.getReactInstanceManager();
            reactContext = reactInstanceManager.getCurrentReactContext();
            this.confirmParams = confirmParams;
            this.stripe = stripe;
        }

        @Override
        public void onSuccess(@NonNull PaymentIntentResult result) {

            PaymentIntent paymentIntent = result.getIntent();
            PaymentIntent.Status status = paymentIntent.getStatus();
            if (status == PaymentIntent.Status.Succeeded) {
                // Payment completed successfully
                Log.e("status success.toString()", status.toString());

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Response",
                        "Success");

            } else {
                // Payment failed
                Log.e("status fail.toString()", status.toString());

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Response",
                        "PaymentFailedError");

            }
        }

        @Override
        public void onError(@NonNull Exception e) {
            // Payment request failed – allow retrying using the same payment method
            Log.e("errpppr", e.toString());
            stripe.confirmPayment(this.activity.get(), confirmParams);

        }
    }
}
