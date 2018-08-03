# Log weight

This app does one single thing - it lets you log your weight today to Fitbit
directly from your Versa or Ionic. When adding an entry for today it will,
if possible, use yesterdays weight as a starting point. From there you can go
up or down.

In order to function this app requires a connection to your phone and internet
to communicate with Fitbit.

In settings you can choose your unit (pounds or stone) if you're not happy with
the default kg. You also have to visit the settings screen when you first
install the app to log in with your Fitbit account. The app will request access
to read and write to your Fitbit weight log.

If you encounter errors:

-   Try restarting the app on your watch. The app should start
    working on the second or third try.
-   Try rebooting your watch.

Log weight is completely free and open source. Feel free to raise issues if you
find any bugs or have suggestions for new features.

You should also download Tyler's app
[Water-Logged](https://github.com/tylerl0706/Water-Logged), which is also open
source! With this app and his you'll be able to both log your weight and your
water intake directly from your watch.

## Acknowledgements

Even though Fitbit has created a very nice and easy to use ecosystem for
developing for Fitbit OS, keeping this app open source would have been way more
difficult without the amazing [FitbitFS](https://github.com/jrtm/FitbitFS). You
should take a look at it if you're thinking about writing open source apps for
Fitbit OS! It lets you sync your Fitbit Studio files onto your local drive.
