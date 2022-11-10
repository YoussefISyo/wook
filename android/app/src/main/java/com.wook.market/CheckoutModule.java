package com.wook.market;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Intent;
import android.content.Context;

public class CheckoutModule extends ReactContextBaseJavaModule {
    private final Context context;

    CheckoutModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "CheckoutModule";
    }


    @ReactMethod
    public void makePayment(String clientSecret, String paymentMethodId) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.putExtra("clientSecret", clientSecret);
        intent.putExtra("paymentMethodId", paymentMethodId);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    @ReactMethod
    public void makeAlipayPayment(String clientSecret) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.putExtra("clientSecret", clientSecret);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

}