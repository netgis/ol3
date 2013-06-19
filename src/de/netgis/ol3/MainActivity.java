package de.netgis.ol3;

import android.os.Bundle;
import org.apache.cordova.*;

public class MainActivity extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int ot = getResources().getConfiguration().orientation;

        if (ot == 2) {
            super.setIntegerProperty("splashscreen", R.drawable.splashlandscape);
        }
        else {
            super.setIntegerProperty("splashscreen", R.drawable.splashportrait);
        }
        
        
		//super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    
}